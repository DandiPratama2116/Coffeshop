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
  title: "Norma Coffee Pekanbaru",
  description: "Nikmati Kopi Terbaik di Caffe Norma Pekanbaru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="/assets/LogoNorma.jpg"
          rel="icon"
          type="image/jpeg"
        />
      </head>
      <body
        className={`${montserrat.variable} bg-background text-on-surface antialiased selection:bg-primary selection:text-background min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
