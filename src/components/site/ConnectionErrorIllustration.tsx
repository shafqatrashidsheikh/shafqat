import { cn } from "@/lib/utils";

/**
 * Playful offline mascot scene — floating wifi ghost + campus bits.
 */
export function ConnectionErrorIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("connection-offline-hero relative mx-auto w-[min(100%,17rem)]", className)}>
      <svg
        viewBox="0 0 280 200"
        className="h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Campus wifi ghost floating offline"
      >
        <title>Campus signal on chai break</title>

        {/* Soft glow */}
        <ellipse cx="140" cy="168" rx="78" ry="12" fill="#9BB4D9" opacity="0.35" />

        {/* Floating chinar leaf */}
        <g className="connection-offline-float-a" opacity="0.9">
          <path
            d="M48 52 C58 40 78 44 72 58 C86 56 88 72 74 74 C78 86 62 90 56 78 C44 84 40 68 48 52 Z"
            fill="#2F6B4F"
          />
          <path d="M56 78 L62 98" stroke="#1E4A36" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Second leaf */}
        <g className="connection-offline-float-b" opacity="0.75">
          <path
            d="M228 40 C238 28 256 34 250 46 C262 48 260 64 248 62 C250 74 236 76 232 66 C222 70 220 52 228 40 Z"
            fill="#3D8A63"
          />
        </g>

        {/* Book stack */}
        <g transform="translate(42 118)">
          <rect x="0" y="22" width="58" height="12" rx="2" fill="#2457A6" />
          <rect x="4" y="12" width="54" height="12" rx="2" fill="#17365D" />
          <rect x="8" y="2" width="50" height="12" rx="2" fill="#6B8FBF" />
          <rect x="14" y="5" width="28" height="2" rx="1" fill="#F8FAFF" opacity="0.5" />
        </g>

        {/* Mini diploma */}
        <g transform="translate(200 108)">
          <g className="connection-offline-bob">
            <rect x="0" y="8" width="40" height="28" rx="3" fill="#F8FAFF" stroke="#2457A6" strokeWidth="2" />
            <circle cx="20" cy="22" r="7" fill="#2457A6" opacity="0.15" />
            <path d="M16 22 L19 25 L25 18" stroke="#2457A6" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 36 L4 48 M32 36 L36 48" stroke="#F4C430" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>

        {/* WIFI GHOST — main character */}
        <g transform="translate(96 28)">
          <g className="connection-offline-ghost">
          {/* Body */}
          <path
            d="M12 36 C12 14 76 14 76 36 L76 78 C76 78 68 70 60 78 C52 70 44 78 44 78 C44 78 36 70 28 78 C20 70 12 78 12 78 Z"
            fill="#F8FAFF"
            stroke="#17365D"
            strokeWidth="2.5"
          />
          {/* Blush */}
          <ellipse cx="28" cy="52" rx="6" ry="3.5" fill="#FFB4A8" opacity="0.55" />
          <ellipse cx="60" cy="52" rx="6" ry="3.5" fill="#FFB4A8" opacity="0.55" />
          {/* Eyes */}
          <circle cx="30" cy="44" r="4.5" fill="#17365D" />
          <circle cx="58" cy="44" r="4.5" fill="#17365D" />
          <circle cx="31.5" cy="42.5" r="1.4" fill="#fff" />
          <circle cx="59.5" cy="42.5" r="1.4" fill="#fff" />
          {/* Worried mouth */}
          <path d="M38 58 Q44 52 50 58" stroke="#17365D" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* Broken wifi arcs on ghost belly */}
          <g opacity="0.85" transform="translate(20 8)">
            <path
              d="M12 22 C18 14 30 14 36 22"
              stroke="#2457A6"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="connection-offline-arcs-pulse"
            />
            <path
              d="M16 26 C20 22 28 22 32 26"
              stroke="#2457A6"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="connection-offline-arcs-pulse"
              style={{ animationDelay: "0.25s" }}
            />
            <circle cx="24" cy="30" r="2.5" fill="#2457A6" />
            <path d="M8 12 L40 34" stroke="#C5221F" strokeWidth="2.8" strokeLinecap="round" />
          </g>
          {/* Little graduation cap */}
          <path d="M22 18 L44 6 L66 18 L44 26 Z" fill="#17365D" />
          <rect x="38" y="18" width="12" height="6" fill="#2457A6" />
          <path d="M66 18 L72 28" stroke="#F4C430" strokeWidth="2" strokeLinecap="round" />
          <circle cx="72" cy="30" r="2.5" fill="#F4C430" />
          </g>
        </g>

        {/* Speech bubble */}
        <g className="connection-offline-bubble">
          <rect x="168" y="18" width="88" height="34" rx="12" fill="#17365D" />
          <path d="M176 50 L168 62 L188 50 Z" fill="#17365D" />
          <text
            x="212"
            y="39"
            textAnchor="middle"
            fill="#F8FAFF"
            style={{ fontSize: "11px", fontFamily: "system-ui, sans-serif", fontWeight: 700 }}
          >
            brb · chai ☕
          </text>
        </g>
      </svg>
    </div>
  );
}
