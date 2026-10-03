import React from "react";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";
import Doctor from "@/models/Doctor";
import Service from "@/models/Service";
import Review from "@/models/Review";
import FAQ from "@/models/FAQ";
import BlogPost from "@/models/BlogPost";
import Gallery from "@/models/Gallery";
import MainHome from "@/components/MainHome";
import { seedDatabase } from "@/lib/seed";
import JsonLd from "@/components/JsonLd";
import {
  graph,
  organizationSchema,
  medicalClinicSchema,
  websiteSchema,
  faqSchema,
  physicianSchemas,
} from "@/lib/seo";

export const revalidate = 300;

export default async function Page() {
  let settings = null;
  let doctors: any[] = [];
  let services: any[] = [];
  let reviews: any[] = [];
  let faqs: any[] = [];
  let blogs: any[] = [];
  let gallery: any[] = [];

  try {
    await connectToDatabase();

    // Fetch from database in parallel
    const [
      settingsRes,
      doctorsRes,
      servicesRes,
      reviewsRes,
      faqsRes,
      blogsRes,
      galleryRes,
    ] = await Promise.all([
      ClinicSettings.findOne().lean(),
      Doctor.find()
        .select("name qualification specialization experience description consultingTime phone availability photo createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
      Service.find()
        .select("title description icon createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Review.find({ approved: true })
        .select("name rating reviewText createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      FAQ.find()
        .select("question answer createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      BlogPost.find()
        .select("title content category tags author image createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      Gallery.find({ category: { $in: ["gallery", "services", "doctors"] } })
        .select("imageUrl category caption order createdAt updatedAt")
        .sort({ order: 1, createdAt: -1 })
        .limit(8)
        .lean(),
    ]);

    settings = settingsRes;
    doctors = doctorsRes;
    services = servicesRes;
    reviews = reviewsRes;
    faqs = faqsRes;
    blogs = blogsRes;
    gallery = galleryRes;

    // Auto seed if database is empty
    if (!settings || doctors.length === 0 || services.length === 0) {
      console.log("Database empty. Seeding database directly on server...");
      try {
        await seedDatabase();
        // Refetch after seeding in parallel
        const [
          settingsRes2,
          doctorsRes2,
          servicesRes2,
          reviewsRes2,
          faqsRes2,
          blogsRes2,
          galleryRes2,
        ] = await Promise.all([
          ClinicSettings.findOne().lean(),
          Doctor.find()
            .select("name qualification specialization experience description consultingTime phone availability photo createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(4)
            .lean(),
          Service.find()
            .select("title description icon createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(6)
            .lean(),
          Review.find({ approved: true })
            .select("name rating reviewText createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(6)
            .lean(),
          FAQ.find()
            .select("question answer createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(8)
            .lean(),
          BlogPost.find()
            .select("title content category tags author image createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(3)
            .lean(),
          Gallery.find({ category: { $in: ["gallery", "services", "doctors"] } })
            .select("imageUrl category caption order createdAt updatedAt")
            .sort({ order: 1, createdAt: -1 })
            .limit(8)
            .lean(),
        ]);

        settings = settingsRes2;
        doctors = doctorsRes2;
        services = servicesRes2;
        reviews = reviewsRes2;
        faqs = faqsRes2;
        blogs = blogsRes2;
        gallery = galleryRes2;
      } catch (setupErr) {
        console.error("Auto seeding failed:", setupErr);
      }
    }
  } catch (error) {
    console.error("Database connection failed in Page Server Component:", error);
  }


  // Fallback / Mock Data if DB connection isn't working
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
    workingHours: "Mon - Sat: 5:30 PM - 8:30 PM (Sunday Holiday) | Home Visit Care Available",
  };

  const finalDoctors = doctors.length > 0 ? doctors : [
    {
      _id: "doc1",
      name: "Dr. G. Murugan",
      qualification: "B.P.T., M.P.T. (Ortho)",
      specialization: "Consultant Orthopaedic Physiotherapist",
      experience: 8,
      description: "Dr. G. Murugan specializes in Orthopaedic Physiotherapy (B.P.T., M.P.T. Ortho), delivering expert clinical care for neck pain, lumbar spine & back pain, shoulder stiffness, knee arthritis, paralysis / stroke rehabilitation, facial palsy, and post-fracture recovery, along with personalized home visit therapy.",
      consultingTime: "Mon - Sat: 5:30 PM - 8:30 PM (Home Visits by Appointment)",
      phone: "+91 97863 14138",
      availability: "Available Today",
    }
  ];

  const finalServices = services.length > 0 ? services : [
    { _id: "s1", title: "Neck Pain & Cervical Care (கழுத்து வலி)", description: "Comprehensive therapy for cervical spondylosis, neck spasms, and radiating pain.", icon: "Bone" },
    { _id: "s2", title: "Back Pain & Sciatica Relief (முதுகு வலி)", description: "Advanced spinal mobilization and core strengthening for lasting lower back relief.", icon: "Shield" },
    { _id: "s3", title: "Shoulder Pain & Frozen Shoulder (தோள்பட்டை வலி)", description: "Capsular stretching and mobilization to restore complete shoulder movement.", icon: "Hand" },
    { _id: "s4", title: "Knee Pain & Arthritis Care (மூட்டு வலி)", description: "Targeted joint mobility and pain-relief therapy for knee osteoarthritis.", icon: "Activity" },
    { _id: "s5", title: "Stroke & Paralysis Rehabilitation (பக்கவாதம்)", description: "Neuro-rehabilitation, gait training, and mobility recovery for hemiplegia.", icon: "Sparkles" },
    { _id: "s6", title: "Home Visit Physiotherapy (வீட்டு சிகிச்சை)", description: "Doorstep physiotherapy care for elderly and bedridden patients in their homes.", icon: "Home" }
  ];

  // Map mongoose models object IDs to strings for serialization
  const serialize = (arr: any[]) =>
    arr.map((item) => ({
      ...item,
      _id: item._id ? item._id.toString() : "",
      createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : new Date().toISOString(),
      doctor: item.doctor ? item.doctor.toString() : undefined,
    }));

  const settingsForSchema = JSON.parse(JSON.stringify(finalSettings));
  const structuredData = graph(
    websiteSchema(),
    organizationSchema(settingsForSchema),
    medicalClinicSchema(settingsForSchema, reviews),
    faqSchema(faqs),
    ...physicianSchemas(serialize(finalDoctors))
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <MainHome
        settings={settingsForSchema}
        doctors={serialize(finalDoctors)}
        services={serialize(finalServices)}
        reviews={serialize(reviews)}
        faqs={serialize(faqs)}
        blogs={serialize(blogs)}
        gallery={serialize(gallery)}
      />
    </>
  );
}
