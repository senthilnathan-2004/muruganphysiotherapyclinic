import React from "react";
import { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import FAQ from "@/models/FAQ";
import ClinicSettings from "@/models/ClinicSettings";
import FaqsClient from "./FaqsClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) | Murugan Physiotherapy Clinic",
  description:
    "Find answers to common questions about physiotherapy treatments, timings, home visits, and appointments with Dr. G. Murugan in Kilkodungalur.",
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function FaqsPage() {
  let faqs: any[] = [];
  let settings: any = null;

  try {
    await connectToDatabase();

    const [faqsRes, settingsRes] = await Promise.all([
      FAQ.find().select("question answer category createdAt").sort({ createdAt: -1 }).lean(),
      ClinicSettings.findOne().lean(),
    ]);

    faqs = faqsRes;
    settings = settingsRes;
  } catch (error) {
    console.error("Failed to fetch FAQs in FaqsPage Server Component:", error);
  }

  // Serialize ObjectIds and dates for client component safety
  const serializedFaqs = faqs.map((faq) => ({
    ...faq,
    _id: faq._id ? faq._id.toString() : "",
    createdAt: faq.createdAt ? faq.createdAt.toISOString() : new Date().toISOString(),
  }));

  const serializedSettings = settings
    ? JSON.parse(JSON.stringify(settings))
    : {
        clinicName: "Murugan Physiotherapy Clinic",
        phone: "+91 97863 14138",
        whatsapp: "+91 97863 14138",
        email: "senthilragunathan2004@gmail.com",
      };

  return <FaqsClient initialFaqs={serializedFaqs} settings={serializedSettings} />;
}
