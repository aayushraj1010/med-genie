"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaDiscord, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [messageLen, setMessageLen] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!formRef.current) return;

  const form = formRef.current;
  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const honey = String(formData.get("_phone") || "").trim(); // honeypot

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) newErrors.email = "Enter a valid email.";
    if (!message) newErrors.message = "Message is required.";
    if (message.length > 5000) newErrors.message = "Message is too long.";
    if (honey) {
      // bot detected, silently ignore
      return;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setStatus({ type: "error", msg: "Please fix the errors above." });
      return;
    }

    setLoading(true);

    try {
      // Try server-side first
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (resp.ok) {
        const json = await resp.json();
        setStatus({ type: "success", msg: json.message || "Message sent — thanks!" });
        form.reset();
        setMessageLen(0);
        setErrors({});
        return;
      }

      // If server returns non-ok, fallback to EmailJS (client-side) if configured
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
      const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_USER_ID as string;

      if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
        await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY);
        setStatus({ type: "success", msg: "Message sent — thanks!" });
        form.reset();
        setMessageLen(0);
        setErrors({});
        return;
      }

      // Final fallback: open mailto
      const mailto = `mailto:info@medgenie.ai?subject=${encodeURIComponent("Contact from " + name)}&body=${encodeURIComponent(message + '\n\n' + email)}`;
      window.location.href = mailto;
      setStatus({ type: "success", msg: "Opened mail client as fallback." });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Failed to send message. Try again later." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            Have a question, suggestion, or want to collaborate? Send us a message and we'll
            get back to you soon. Please do not send medical emergencies here.
          </p>

          <div className="flex items-center gap-4 mt-6">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-2xl text-sky-500 hover:text-sky-600">
              <FaXTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-2xl text-pink-500 hover:text-pink-600">
              <FaInstagram />
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-2xl text-violet-600 hover:text-violet-700">
              <FaDiscord />
            </a>
          </div>
        </div>

        <div>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur py-6 px-6 rounded-lg shadow-lg"
            aria-labelledby="contact-heading"
          >
            <input type="text" name="_phone" tabIndex={-1} autoComplete="off" className="hidden" />

            <div className="mb-3">
              <label htmlFor="contact-name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                className="w-full border rounded px-3 py-2 text-gray-900 placeholder-gray-400 dark:text-white dark:placeholder-gray-300"
                placeholder="Your name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'error-name' : undefined}
                required
              />
              {errors.name && (
                <p id="error-name" className="text-sm text-red-600 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="contact-email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                className="w-full border rounded px-3 py-2 text-gray-900 placeholder-gray-400 dark:text-white dark:placeholder-gray-300"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'error-email' : undefined}
                required
              />
              {errors.email && (
                <p id="error-email" className="text-sm text-red-600 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="contact-message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                className="w-full border rounded px-3 py-2 text-gray-900 placeholder-gray-400 dark:text-white dark:placeholder-gray-300"
                placeholder="How can we help?"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'error-message message-help' : 'message-help'}
                required
                onChange={(e) => setMessageLen(e.target.value.length)}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.message ? (
                  <p id="error-message" className="text-sm text-red-600">{errors.message}</p>
                ) : (
                  <p id="message-help" className="text-sm text-gray-500">We aim to reply within 48 hours.</p>
                )}
                <p className="text-sm text-gray-500">{messageLen}/5000</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded disabled:opacity-60"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {status && (
                <p role="status" className={`text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
                  {status.msg}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
