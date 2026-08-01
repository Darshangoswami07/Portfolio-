import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppChrome from "./components/AppChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-rouge-ten-ric6b2uei5.vercel.app";
const title = "Darshan Giri Goswami — Full Stack MERN Developer";
const description =
  "Portfolio of Darshan Giri Goswami, a Full Stack MERN Developer skilled in React.js, Node.js, Express.js, and MongoDB. Explore projects, experience, and get in touch.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Darshan Giri Goswami",
  },
  description,
  keywords: [
    "Darshan Giri Goswami",
    "Full Stack Developer",
    "MERN Stack Developer",
    "React Developer",
    "Node.js Developer",
    "Web Developer Portfolio",
  ],
  authors: [{ name: "Darshan Giri Goswami" }],
  creator: "Darshan Giri Goswami",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: "Darshan Giri Goswami Portfolio",
    images: [
      {
        url: "/images/darshan-2.jpg",
        width: 768,
        height: 1024,
        alt: "Darshan Giri Goswami",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/darshan-2.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

const themeInitScript = `
(function () {
  try {
    // Dark mode is the default; a stored explicit choice (from the toggle)
    // always wins, and falls back to dark rather than system preference.
    var stored = localStorage.getItem('site-theme');
    var isDark = stored ? stored === 'dark' : true;
    document.documentElement.classList.add(isDark ? 'theme-dark' : 'theme-light');
  } catch (e) {
    document.documentElement.classList.add('theme-dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
