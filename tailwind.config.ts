import type { Config } from "tailwindcss";

/**
 * Alvora IT Solution — "Black Edition" Tailwind Configuration
 * (now the PRIMARY design direction, per client direction — the light
 * theme config this was forked from is preserved separately, but this
 * file is the one being carried forward.)
 *
 * Every color/shadow/gradient token below has been re-authored for a
 * premium dark theme. Token NAMES are unchanged (primary, secondary,
 * accent, neutral.900/600/300/100, background, surface, border, every
 * shadow/gradient key) — only the VALUES changed. Since nearly every
 * component references these tokens by name rather than hardcoded
 * hex, this file reskins the overwhelming majority of the site
 * automatically.
 *
 * One deliberate exception: `primary.DEFAULT` was the brand navy
 * (used as `bg-primary` in a handful of "dark panel" contexts — admin
 * sidebar, tooltips, the quote form's active step indicator — AND as
 * `text-primary` for every heading/title sitewide). Those two uses
 * need different colors on a dark theme, so `primary.DEFAULT` is now
 * the light heading color, and the original navy moved to
 * `primary.dark`. The handful of call sites that needed to stay a
 * dark navy panel were updated to `bg-primary-dark` in place.
 *
 * Three new accent tokens (cyan, accent-blue, accent-purple) support
 * the gradient/glow treatments — additive only.
 *
 * Luxury Color Refinement pass (Enterprise Edition): `background` and
 * `surface` nudged fractionally deeper (verified via WCAG contrast
 * math against every text/background pairing sitewide — every ratio
 * moved by ≤0.02, i.e. imperceptible, and nothing dropped out of AA)
 * for a touch more layered depth without an obvious visual change.
 * `accent-purple` was desaturated ~18%/deepened ~6% so it reads as
 * "subtle violet" (its supporting-accent role — used sparingly, in
 * gradients only, never as text) rather than a vivid periwinkle.
 * cyan, accent-blue, secondary, the neutral scale, and border were
 * deliberately left unchanged — they already independently satisfied
 * the brief's own stated goals with real contrast headroom, and
 * changing them further would be churn without benefit.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem", // 20px — mobile margin
        sm: "2rem", // 32px — tablet margin
        lg: "3rem", // 48px — laptop margin
        xl: "4rem", // 64px — desktop margin
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1200px", // container max-width caps here per design system
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#EDF2F8", // light — headings/titles (text-primary) sitewide
          dark: "#0B3A56", // original brand navy — "dark panel" backgrounds only
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#0E8C8C",
          light: "#3AA9A9",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F2A93B",
          foreground: "#101820",
        },
        cyan: {
          DEFAULT: "#46D7D7",
        },
        "accent-blue": {
          DEFAULT: "#4F8CFF",
        },
        "accent-purple": {
          DEFAULT: "#7465F0", // desaturated/deepened from #7B6CFF — reads as "subtle violet" (supporting accent, gradients only)
        },
        neutral: {
          900: "#EDF1F6", // primary body text (lightness inverted vs. light theme)
          600: "#93A2B4", // secondary/muted text
          300: "#5A6B82", // tertiary/disabled — decorative use only
          100: "#0E1622", // subtle bg tint
        },
        background: "#05070A",
        surface: "#111827",
        border: "rgba(255, 255, 255, 0.08)",
        success: "#22C55E",
        warning: "#FBBF24",
        error: "#F87171",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      fontSize: {
        h1: ["56px", { lineHeight: "1.1", fontWeight: "700" }],
        h2: ["40px", { lineHeight: "1.15", fontWeight: "700" }],
        h3: ["28px", { lineHeight: "1.2", fontWeight: "600" }],
        h4: ["22px", { lineHeight: "1.25", fontWeight: "600" }],
        h5: ["18px", { lineHeight: "1.3", fontWeight: "600" }],
        h6: ["16px", { lineHeight: "1.3", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "1.4", fontWeight: "400" }],
        button: ["15px", { lineHeight: "1", fontWeight: "500" }],
        label: ["13px", { lineHeight: "1.2", fontWeight: "500" }],
        "h1-mobile": ["36px", { lineHeight: "1.1", fontWeight: "700" }],
        "h2-mobile": ["28px", { lineHeight: "1.15", fontWeight: "700" }],
        "h3-mobile": ["22px", { lineHeight: "1.2", fontWeight: "600" }],
        "h4-mobile": ["18px", { lineHeight: "1.25", fontWeight: "600" }],
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "16px",
        4: "24px",
        5: "32px",
        6: "48px",
        7: "64px",
        8: "96px",
        9: "128px",
        10: "160px",
      },
      borderRadius: {
        input: "8px",
        card: "12px",
        modal: "16px",
        pill: "999px",
        structural: "0px",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },
      transitionTimingFunction: {
        standard: "ease-out",
        inout: "ease-in-out",
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        prose: "70ch",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        "card-hover":
          "0 8px 30px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(70, 215, 215, 0.14)",
        soft: "0 1px 2px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.3)",
        elevated:
          "0 4px 16px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        "elevated-hover":
          "0 24px 60px -12px rgba(79, 140, 255, 0.28), 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(70, 215, 215, 0.16)",
        glow: "0 0 0 1px rgba(70, 215, 215, 0.28), 0 0 44px rgba(70, 215, 215, 0.22), 0 8px 30px rgba(0, 0, 0, 0.4)",
        "primary-lg":
          "0 30px 80px -20px rgba(79, 140, 255, 0.35), 0 0 60px rgba(116, 101, 240, 0.16)",
        button: "0 1px 2px rgba(0, 0, 0, 0.3), 0 0 24px rgba(79, 140, 255, 0.18)",
        "button-hover":
          "0 10px 28px rgba(79, 140, 255, 0.35), 0 0 48px rgba(70, 215, 215, 0.28)",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #4F8CFF 0%, #46D7D7 55%, #7465F0 100%)",
        "gradient-secondary": "linear-gradient(135deg, #0E8C8C 0%, #4F8CFF 100%)",
        "gradient-radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(70, 215, 215, 0.30), transparent 60%)",
        "gradient-mesh":
          "radial-gradient(at 15% 20%, rgba(70, 215, 215, 0.20) 0px, transparent 50%), radial-gradient(at 85% 10%, rgba(116, 101, 240, 0.18) 0px, transparent 50%), radial-gradient(at 50% 90%, rgba(79, 140, 255, 0.16) 0px, transparent 50%)",
        "grid-pattern":
          "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        aurora:
          "radial-gradient(at 20% 30%, rgba(70, 215, 215, 0.28) 0px, transparent 55%), radial-gradient(at 80% 20%, rgba(116, 101, 240, 0.26) 0px, transparent 55%), radial-gradient(at 50% 80%, rgba(79, 140, 255, 0.22) 0px, transparent 55%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(1.5deg)" },
        },
        // New — "almost invisible" logo breathing (Hero/Splash), used
        // in place of any translateY float on the logo mark itself.
        // A ~1.5% scale swing is deliberately near-imperceptible.
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.015)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 400ms ease-out",
        "fade-in": "fade-in 250ms ease-out",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        breathe: "breathe 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        marquee: "marquee 28s linear infinite",
        "accordion-down": "accordion-down 250ms ease-out",
        "accordion-up": "accordion-up 250ms ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
