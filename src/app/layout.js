import { inter, displayFace } from "@/lib/fonts";
import { APP } from "@/constants/config";
import AppProviders from "@/components/providers/AppProviders";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(APP.url),
  title: {
    default: `${APP.name} — ${APP.tagline}`,
    template: `%s · ${APP.name}`,
  },
  description: APP.description,
  applicationName: APP.name,
  keywords: [
    "grocery delivery",
    "fresh produce",
    "online supermarket",
    "food delivery",
    APP.name,
  ],
  openGraph: {
    type: "website",
    siteName: APP.name,
    title: `${APP.name} — ${APP.tagline}`,
    description: APP.description,
    url: APP.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP.name} — ${APP.tagline}`,
    description: APP.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${displayFace.variable}`}>
      <body className="min-h-dvh">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
