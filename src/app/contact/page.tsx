import React from "react";
import { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Murugan Physiotherapy Clinic Kilkodungalur",
  description:
    "Get in touch with Dr. G. Murugan at Murugan Physiotherapy Clinic in Kilkodungalur. Address, phone, consultation hours, and online booking.",
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function ContactPage() {
  let settings: any = null;

  try {
    await connectToDatabase();
    settings = await ClinicSettings.findOne().lean();
  } catch (error) {
    console.error("Failed to fetch settings in ContactPage Server Component:", error);
  }

  const serializedSettings = settings
    ? JSON.parse(JSON.stringify(settings))
    : {
        clinicName: "Murugan Physiotherapy Clinic",
        address: "No. 343, Badhur Road, Opposite to Sendamizh Matriculation School, Mangalam Mamandur, Kilkodungalur - 604 403, Tiruvannamalai District, Tamil Nadu",
        phone: "+91 97863 14138",
        whatsapp: "+91 97863 14138",
        email: "senthilragunathan2004@gmail.com",
        workingHours: "Mon - Sat: 5:30 PM - 8:30 PM (Sunday Holiday) | Home Visit Care Available",
      };

  return <ContactClient settings={serializedSettings} />;
}
