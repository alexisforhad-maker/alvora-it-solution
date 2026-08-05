import { Space_Grotesk, Inter } from "next/font/google";

/**
 * Heading typeface — bold, geometric, echoes the confident character
 * of the Alvora logo's wordmark. Design System §4.
 */
export const fontHeading = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

/**
 * Body typeface — highly legible, neutral, optimized for long-form
 * reading (blog, case studies). Design System §4.
 */
export const fontBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const fontVariables = `${fontHeading.variable} ${fontBody.variable}`;
