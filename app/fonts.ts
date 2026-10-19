import localFont from "next/font/local";
import { Geist_Mono, Instrument_Serif } from "next/font/google";

export const generalSans = localFont({
  src: [{ path: "./fonts/GeneralSans-Variable.woff2", style: "normal" }],
  variable: "--font-sans",
  display: "swap",
  weight: "200 700",
});

export const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
