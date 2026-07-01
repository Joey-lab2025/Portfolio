import type { Metadata } from "next";
import "./globals.css";

import {
  IBM_Plex_Sans,
  Noto_Sans_SC,
  Playfair_Display,
  Cormorant_Garamond,
} from "next/font/google";

const ibm = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm",
  weight: ["300", "400", "500"],
  display: "swap",
});

const noto = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["300", "400", "500"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JOEY Portfolio",
  description: "Landscape Architecture Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`
          ${ibm.variable}
          ${noto.variable}
          ${playfair.variable}
          ${cormorant.variable}
        `}
      >
        {children}
      </body>
    </html>
  );
}