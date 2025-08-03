// app/contact/page.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import emailjs from '@emailjs/browser';
import { Mail } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';

interface Status {
    type: 'success' | 'error';
    msg: string;
}

export default function ContactPage() {
    const form = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<Status | null>(null);
    const [loading, setLoading] = useState(false);

    // Use NEXT_PUBLIC_ vars for Next.js on both client/server
    const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
    const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_USER_ID!;

    const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        if (!form.current) {
            setStatus({ type: 'error', msg: 'Internal error. Please refresh and try again.' });
            setLoading(false);
            return;
        }

        try {
            await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY);
            setStatus({ type: 'success', msg: 'Message sent successfully!' });
            form.current.reset();
        } catch {
            setStatus({ type: 'error', msg: 'Failed to send message. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <Card className="w-full max-w-xl shadow-xl">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-7 w-7 text-primary" />
                        <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
                    </div>
                    <p className="text-muted-foreground">
                        Have a question, suggestion, or want to contribute? Fill out the form below and we’ll get back to you!
                    </p>
                </CardHeader>
                <CardContent>
                    <form
                        ref={form}
                        onSubmit={sendEmail}
                        className="flex flex-col gap-4 w-full mt-4"
                        autoComplete="off"
                    >
                        <Input
                            type="text"
                            name="user_name"
                            placeholder="Your Name"
                            required
                        />
                        <Input
                            type="email"
                            name="user_email"
                            placeholder="Your Email"
                            required
                        />
                        <Textarea
                            name="message"
                            placeholder="Your Message"
                            rows={5}
                            required
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                        {status && (
                            <div
                                className={`text-center font-medium mt-2 ${status.type === 'success'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                    }`}
                            >
                                {status.msg}
                            </div>
                        )}
                    </form>
                </CardContent>
                <div className="pb-4 text-xs text-muted-foreground text-center">
                    Please do not send medical emergencies or personal health queries here.
                </div>
            </Card>
        </div>
    );
}
