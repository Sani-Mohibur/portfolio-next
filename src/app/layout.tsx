import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sani-mohibur.netlify.app"),
  title: "Mohibur Rahman Sani (Farabi Sunny) | Portfolio",
  description:
    "Portfolio of Mohibur Rahman Sani (Farabi Sunny) - a Computer Science graduate and Full Stack Developer specializing in Software Engineering.",
  openGraph: {
    title: "Mohibur Rahman Sani (Farabi Sunny) | Portfolio",
    description:
      "Portfolio of Mohibur Rahman Sani (Farabi Sunny) - a Computer Science graduate and Full Stack Developer specializing in Software Engineering.",
    url: "https://sani-mohibur.netlify.app",
    siteName: "Mohibur Rahman Sani Portfolio",
    images: [
      {
        url: "/opengraph-image.png", // Make sure this matches your image filename exactly!
        width: 1200,
        height: 630,
        alt: "Mohibur Rahman Sani Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  verification: {
    google: "KBn27Y9b8tT44SSx066-jAOr4f_lPAMwBtNFiUjkYzU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
