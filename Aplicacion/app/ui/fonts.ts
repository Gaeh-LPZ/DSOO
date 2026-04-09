import { Newsreader } from "next/font/google";
import { Noto_Serif, Manrope } from "next/font/google";

export const newsreader = Newsreader({
    subsets: ['latin'],
    weight: ['400', '600']
});

export const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

export const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});