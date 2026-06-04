"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const router = useRouter();
  const pulseRef = useRef<SVGCircleElement>(null);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0f1a]">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow behind illustration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute right-40 top-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/8 blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* ── LEFT: Text Content ── */}
        <div className="flex flex-col gap-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 w-fit">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-medium tracking-widest uppercase">
              AI-Powered Health Assistant
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Your Personal
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Medical Genie
            </span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Get instant, accurate health guidance through natural conversation.
            Powered by advanced AI, available 24/7, completely private.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              onClick={() => router.push("/homepage")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 text-base font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-800/60"
            >
              Start Chatting →
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/sign-up")}
              className="border-white/15 text-white hover:bg-white/8 px-8 py-3 text-base rounded-xl"
            >
              Create Account
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 pt-4 border-t border-white/8 mt-2">
            {[
              { value: "24/7", label: "Available" },
              { value: "100%", label: "Private" },
              { value: "< 2s", label: "Response" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Medical/AI Illustration ── */}
        <div className="flex justify-center lg:justify-end">
          <MedicalIllustration />
        </div>
      </div>

      {/* Fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0f1a] to-transparent pointer-events-none" />
    </section>
  );
}

function MedicalIllustration() {
  return (
    <svg
      viewBox="0 0 520 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[480px] lg:max-w-[520px] drop-shadow-2xl"
      aria-label="AI-powered medical health illustration"
    >
      <defs>
        {/* Gradients */}
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e40af" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0a0f1a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.98" />
        </linearGradient>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="heartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id="brainGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="pillGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#3b82f6" floodOpacity="0.2" />
        </filter>
        <filter id="glowBlue">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="cardClip">
          <rect x="80" y="80" width="360" height="360" rx="32" />
        </clipPath>
      </defs>

      {/* Background glow */}
      <circle cx="260" cy="260" r="260" fill="url(#bgGlow)" />

      {/* Outer orbit rings */}
      <circle cx="260" cy="260" r="230" stroke="#3b82f6" strokeOpacity="0.08" strokeWidth="1" fill="none" />
      <circle cx="260" cy="260" r="200" stroke="#3b82f6" strokeOpacity="0.12" strokeWidth="1" fill="none" strokeDasharray="4 6" />
      <circle cx="260" cy="260" r="170" stroke="#06b6d4" strokeOpacity="0.1" strokeWidth="1" fill="none" />

      {/* Orbit dots */}
      <circle cx="260" cy="60" r="4" fill="#3b82f6" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" from="0 260 260" to="360 260 260" dur="18s" repeatCount="indefinite" />
      </circle>
      <circle cx="460" cy="260" r="3" fill="#06b6d4" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="90 260 260" to="450 260 260" dur="22s" repeatCount="indefinite" />
      </circle>
      <circle cx="260" cy="460" r="3.5" fill="#818cf8" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="180 260 260" to="540 260 260" dur="15s" repeatCount="indefinite" />
      </circle>

      {/* Main card */}
      <rect x="80" y="80" width="360" height="360" rx="32" fill="url(#cardGrad)" stroke="#1e40af" strokeOpacity="0.4" strokeWidth="1.5" filter="url(#softShadow)" />

      {/* Card header bar */}
      <rect x="80" y="80" width="360" height="52" rx="32" fill="#1e3a5f" opacity="0.6" />
      <rect x="80" y="108" width="360" height="24" fill="#1e3a5f" opacity="0.6" />

      {/* Header dots */}
      <circle cx="116" cy="106" r="6" fill="#f43f5e" opacity="0.9" />
      <circle cx="136" cy="106" r="6" fill="#fbbf24" opacity="0.9" />
      <circle cx="156" cy="106" r="6" fill="#34d399" opacity="0.9" />

      {/* Header label */}
      <text x="180" y="111" fill="#94a3b8" fontSize="11" fontFamily="monospace" letterSpacing="1">MED GENIE AI</text>

      {/* ── Central: AI Brain circle ── */}
      <circle cx="260" cy="200" r="52" fill="#0f172a" stroke="url(#ringGrad)" strokeWidth="2" />
      <circle cx="260" cy="200" r="44" fill="#1e293b" opacity="0.8" />

      {/* Brain icon (simplified, stylized) */}
      {/* Left hemisphere */}
      <path
        d="M248 190 C240 182 232 184 230 192 C228 200 232 208 240 210 C244 218 252 220 256 214 L256 194 Z"
        fill="url(#brainGrad)" opacity="0.9"
      />
      {/* Right hemisphere */}
      <path
        d="M272 190 C280 182 288 184 290 192 C292 200 288 208 280 210 C276 218 268 220 264 214 L264 194 Z"
        fill="url(#brainGrad)" opacity="0.9"
      />
      {/* Brain stem */}
      <rect x="256" y="214" width="8" height="10" rx="3" fill="url(#brainGrad)" opacity="0.8" />
      {/* Centerline */}
      <line x1="260" y1="186" x2="260" y2="216" stroke="#0f172a" strokeWidth="2" />
      {/* Neural sparks */}
      <circle cx="243" cy="193" r="2" fill="#a5b4fc">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="277" cy="193" r="2" fill="#a5b4fc">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="252" cy="207" r="1.5" fill="#c7d2fe">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="268" cy="207" r="1.5" fill="#c7d2fe">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Outer ring pulse */}
      <circle cx="260" cy="200" r="56" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeOpacity="0.4">
        <animate attributeName="r" values="52;60;52" dur="3s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* ── ECG / heartbeat line ── */}
      <polyline
        points="100,300 130,300 145,270 158,330 170,290 183,310 196,300 226,300"
        stroke="#f43f5e"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
        filter="url(#glowBlue)"
      />
      <polyline
        points="226,300 256,300 271,270 284,330 296,290 309,310 322,300 420,300"
        stroke="#f43f5e"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />

      {/* ECG label */}
      <text x="100" y="318" fill="#64748b" fontSize="8.5" fontFamily="monospace" letterSpacing="0.5">CARDIAC MONITOR</text>
      <text x="360" y="318" fill="#f43f5e" fontSize="9" fontFamily="monospace" opacity="0.8">72 BPM</text>
      {/* Blinking dot */}
      <circle cx="408" cy="314" r="3" fill="#f43f5e">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
      </circle>

      {/* ── Floating metric cards ── */}
      {/* Blood Oxygen */}
      <g transform="translate(100, 340)">
        <rect width="100" height="52" rx="10" fill="#0f172a" stroke="#1d4ed8" strokeOpacity="0.5" strokeWidth="1" />
        <text x="10" y="18" fill="#64748b" fontSize="8" fontFamily="monospace" letterSpacing="0.5">BLOOD O₂</text>
        <text x="10" y="36" fill="#60a5fa" fontSize="18" fontWeight="bold" fontFamily="monospace">98%</text>
        <rect x="10" y="42" width="80" height="2" rx="1" fill="#1e293b" />
        <rect x="10" y="42" width="78" height="2" rx="1" fill="#3b82f6" opacity="0.8" />
      </g>

      {/* Temperature */}
      <g transform="translate(210, 340)">
        <rect width="100" height="52" rx="10" fill="#0f172a" stroke="#059669" strokeOpacity="0.5" strokeWidth="1" />
        <text x="10" y="18" fill="#64748b" fontSize="8" fontFamily="monospace" letterSpacing="0.5">TEMPERATURE</text>
        <text x="10" y="36" fill="#34d399" fontSize="18" fontWeight="bold" fontFamily="monospace">98.6°</text>
        <rect x="10" y="42" width="80" height="2" rx="1" fill="#1e293b" />
        <rect x="10" y="42" width="52" height="2" rx="1" fill="#34d399" opacity="0.8" />
      </g>

      {/* BP */}
      <g transform="translate(320, 340)">
        <rect width="100" height="52" rx="10" fill="#0f172a" stroke="#7c3aed" strokeOpacity="0.5" strokeWidth="1" />
        <text x="10" y="18" fill="#64748b" fontSize="8" fontFamily="monospace" letterSpacing="0.5">BLOOD PRESS.</text>
        <text x="10" y="36" fill="#a78bfa" fontSize="16" fontWeight="bold" fontFamily="monospace">120/80</text>
        <rect x="10" y="42" width="80" height="2" rx="1" fill="#1e293b" />
        <rect x="10" y="42" width="60" height="2" rx="1" fill="#7c3aed" opacity="0.8" />
      </g>

      {/* ── Floating icons (orbiting pills, cross, etc.) ── */}
      {/* Medical cross — top right */}
      <g transform="translate(375, 118)">
        <rect x="0" y="6" width="24" height="12" rx="2" fill="#3b82f6" opacity="0.9" />
        <rect x="6" y="0" width="12" height="24" rx="2" fill="#3b82f6" opacity="0.9" />
      </g>

      {/* Pill — bottom left float */}
      <g transform="translate(95, 155)" opacity="0.85">
        <rect x="0" y="0" width="44" height="20" rx="10" fill="url(#pillGrad)" />
        <line x1="22" y1="0" x2="22" y2="20" stroke="#0a0f1a" strokeWidth="1.5" opacity="0.6" />
      </g>

      {/* DNA helix dots — right side */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <circle
            cx={400 + Math.sin((i / 6) * Math.PI * 2) * 10}
            cy={140 + i * 18}
            r="3"
            fill="#06b6d4"
            opacity={0.4 + i * 0.1}
          />
          <circle
            cx={420 - Math.sin((i / 6) * Math.PI * 2) * 10}
            cy={140 + i * 18}
            r="3"
            fill="#818cf8"
            opacity={0.4 + i * 0.1}
          />
          <line
            x1={400 + Math.sin((i / 6) * Math.PI * 2) * 10}
            y1={140 + i * 18}
            x2={420 - Math.sin((i / 6) * Math.PI * 2) * 10}
            y2={140 + i * 18}
            stroke="#3b82f6"
            strokeWidth="1"
            opacity="0.3"
          />
        </g>
      ))}

      {/* Chat bubble */}
      <g transform="translate(100, 240)">
        <rect x="0" y="0" width="90" height="36" rx="12" fill="#1e3a5f" stroke="#3b82f6" strokeOpacity="0.4" strokeWidth="1" />
        <rect x="0" y="24" width="16" height="16" rx="2" fill="#1e3a5f" />
        <polygon points="4,28 16,28 4,40" fill="#1e3a5f" />
        <circle cx="18" cy="18" r="4" fill="#60a5fa" opacity="0.7">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="18" r="4" fill="#60a5fa" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="46" cy="18" r="4" fill="#60a5fa" opacity="0.7">
          <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Shield (privacy) */}
      <g transform="translate(340, 138)" opacity="0.8">
        <path d="M16 2 L28 6 L28 14 C28 20 22 25 16 27 C10 25 4 20 4 14 L4 6 Z" fill="#1e3a5f" stroke="#34d399" strokeWidth="1.5" />
        <polyline points="10,14 14,18 22,11" stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Bottom label */}
      <text x="260" y="415" fill="#475569" fontSize="9" textAnchor="middle" fontFamily="monospace" letterSpacing="2">SECURE · PRIVATE · INSTANT</text>
    </svg>
  );
}
