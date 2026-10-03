import React from "react";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";
import BlogPost from "@/models/BlogPost";
import AllBlogsView from "@/components/AllBlogsView";
import JsonLd from "@/components/JsonLd";
import { graph, breadcrumbSchema, blogListSchema, KEYWORDS } from "@/lib/seo";

// ISR — cached HTML, busted on demand via revalidatePath in admin mutations.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Physiotherapy Blog — Health, Rehab & Recovery Tips | Murugan Clinic",
  description:
    "Expert physiotherapy advice from Murugan Physiotherapy Clinic, Kilkodungalur: neck pain, back pain, stroke rehabilitation, and posture guidance.",
  keywords: KEYWORDS.blog,
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Physiotherapy Blog | Murugan Physiotherapy Clinic",
    description:
      "Rehabilitation guidance, pain relief advice, and health tips from Dr. G. Murugan.",
    url: "/blogs",
    type: "website",
  },
};

export default async function BlogsPage() {
  let settings = null;
  let posts: any[] = [];

  try {
    await connectToDatabase();
    const [settingsRes, postsRes] = await Promise.all([
      ClinicSettings.findOne().lean(),
      BlogPost.find().sort({ createdAt: -1 }).lean()
    ]);
    settings = settingsRes;
    posts = postsRes;
  } catch (error) {
    console.error("Blogs page db error:", error);
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

  const serializedPosts = serialize(posts);
  const structuredData = graph(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blogs" },
    ]),
    blogListSchema(serializedPosts)
  );

  return (
    <div className="pt-32 pb-24">
      <JsonLd data={structuredData} />
      <AllBlogsView posts={serializedPosts} />
    </div>
  );
}
