import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "../components/ui/FoldText.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Coffee Shop Pekanbaru",
  description: "Nikmati Kopi Terbaik di Coffee Shop Pekanbaru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light scroll-smooth notranslate" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="/assets/Coffeshoplogo.jpeg"
          rel="icon"
          type="image/jpeg"
        />
      </head>
      <body
        className={`${montserrat.variable} bg-background text-on-surface antialiased selection:bg-primary selection:text-background min-h-screen notranslate`}
      >
        {children}
      </body>
    </html>
  );
}
