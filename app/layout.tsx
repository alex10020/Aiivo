import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jbmono",
  display: "swap",
});

const title = "Aiivo — The compliance record for every new business";
const description =
  "Tell us your business type and address. Aiivo maps every federal, state, county and city permit you need — then files and renews them on your behalf.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aiivo.ai"),
  title: { default: title, template: "%s — Aiivo" },
  description,
  keywords: [
    "business permits",
    "business licenses",
    "compliance",
    "permit filing",
    "small business compliance",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://aiivo.ai",
    siteName: "Aiivo",
  },
  twitter: { card: "summary_large_image", title, description },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23f3efe4'/%3E%3Ccircle cx='16' cy='16' r='11' fill='none' stroke='%2315623d' stroke-width='1.7'/%3E%3Ccircle cx='16' cy='16' r='8.4' fill='none' stroke='%2315623d' stroke-width='0.9' opacity='0.45'/%3E%3Cpath d='M10.6 16.5l3.1 3.1L22 11.8' fill='none' stroke='%2315623d' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#f3efe4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${inter.variable} ${jbmono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
