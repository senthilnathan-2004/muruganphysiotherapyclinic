import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";

import Script from "next/script";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteTitle = "Murugan Physiotherapy Clinic";
// Homepage <title> — leads with the top commercial + local keywords
const homeTitle =
  "Murugan Physiotherapy Clinic | Dr. G. Murugan BPT, MPT (Ortho) | Kilkodungalur, Vandavasi";
const siteDescription =
  "Murugan Physiotherapy Clinic in Kilkodungalur, Tamil Nadu offers expert orthopaedic physiotherapy, stroke rehab, paralysis care, neck & back pain relief, facial palsy treatment, and home visits by Dr. G. Murugan.";
// Question-led variant — higher click-through on social shares.
const siteSocialDescription =
  "Looking for an expert physiotherapist in Kilkodungalur / Vandavasi? Murugan Physiotherapy Clinic provides specialized orthopaedic therapy, stroke rehabilitation, and home visit care by Dr. G. Murugan. Call 097863 14138.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: homeTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  keywords: [
    "Murugan Physiotherapy Clinic Kilkodungalur",
    "physiotherapist in Kilkodungalur",
    "physiotherapy clinic Vandavasi",
    "Dr G Murugan physiotherapist",
    "orthopaedic physiotherapist Kilkodungalur",
    "home visit physiotherapy Vandavasi",
    "neck pain physiotherapy",
    "back pain treatment Vandavasi",
    "stroke paralysis rehabilitation",
    "facial palsy physiotherapy",
    "Murugan Physio Clinic Mamandur",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: siteTitle,
    description: siteSocialDescription,
    siteName: siteTitle,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteSocialDescription,
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, email: true, address: true },
};

async function getLayoutSettings() {
  try {
    await connectToDatabase();
    return await ClinicSettings.findOne()
      .select("clinicName logo favicon phone whatsapp email address workingHours facebook instagram youtube linkedin createdAt updatedAt")
      .lean();
  } catch (err) {
    console.error("Layout settings load err:", err);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings: any = await getLayoutSettings();
  const faviconUrl = settings?.favicon || "/favicon.ico";
  const serializedSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href={faviconUrl} />
      </head>
      <body className={`${outfit.variable} ${spaceGrotesk.variable} antialiased`}>
        <Providers>
          <PublicLayoutWrapper settings={serializedSettings}>
            {children}
          </PublicLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
