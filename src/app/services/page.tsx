import React from "react";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";
import Service from "@/models/Service";
import AllServicesView from "@/components/AllServicesView";
import JsonLd from "@/components/JsonLd";
import { graph, breadcrumbSchema, serviceListSchema, KEYWORDS } from "@/lib/seo";

// ISR — cached HTML, busted on demand via revalidatePath in admin mutations.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Physiotherapy Treatments & Services | Murugan Physiotherapy Clinic",
  description:
    "Murugan Physiotherapy Clinic services in Kilkodungalur: neck pain, back pain & sciatica, frozen shoulder, knee arthritis, paralysis/stroke rehab, facial palsy, and home visits.",
  keywords: KEYWORDS.services,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Physiotherapy Services | Murugan Physiotherapy Clinic Kilkodungalur",
    description:
      "Expert orthopaedic physiotherapy, stroke rehabilitation, joint mobilization, and home care treatments by Dr. G. Murugan.",
    url: "/services",
    type: "website",
  },
};

export default async function ServicesPage() {
  let settings = null;
  let services: any[] = [];

  try {
    await connectToDatabase();
    const [settingsRes, servicesRes] = await Promise.all([
      ClinicSettings.findOne().lean(),
      Service.find().sort({ createdAt: -1 }).lean()
    ]);
    settings = settingsRes;
    services = servicesRes;
  } catch (error) {
    console.error("Services page db error:", error);
  }

  const finalSettings = settings || {
    clinicName: "Murugan Physiotherapy Clinic",
    tagline: "Restore Mobility • Relieve Pain • Revive Life",
    logo: "/logo.jpg",
    favicon: "/logo.jpg",
    heroImage: "/herobanner.jpg",
    address: "No. 343, Badhur Road, Opposite to Sendamizh Matriculation School, Mangalam Mamandur, Kilkodungalur - 604 403, Tiruvannamalai District, Tamil Nadu",
    phone: "+91 97863 14138",
    email: "senthilragunathan2004@gmail.com",
    whatsapp: "+91 97863 14138",
  };

  const serialize = (arr: any[]) =>
    arr.map((item) => ({
      ...item,
      _id: item._id ? item._id.toString() : "",
      createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : new Date().toISOString(),
    }));

  const serializedServices = serialize(services);
  const structuredData = graph(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]),
    serviceListSchema(serializedServices)
  );

  return (
    <div className="pt-32 pb-24">
      <JsonLd data={structuredData} />
      <AllServicesView services={serializedServices} />
    </div>
  );
}
