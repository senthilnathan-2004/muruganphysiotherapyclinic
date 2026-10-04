"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import SectionTicker from "@/components/SectionTicker";

import { Language } from "@/lib/translations";

const About = dynamic(() => import("@/components/About"));
const Doctors = dynamic(() => import("@/components/Doctors"));
const Services = dynamic(() => import("@/components/Services"));
const InteractiveBodyMap = dynamic(() => import("@/components/InteractiveBodyMap"));
const BookingForm = dynamic(() => import("@/components/BookingForm"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const GalleryGrid = dynamic(() => import("@/components/GalleryGrid"));
const FAQList = dynamic(() => import("@/components/FAQList"));
const BlogGrid = dynamic(() => import("@/components/BlogGrid"));
const Contact = dynamic(() => import("@/components/Contact"));
const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

interface MainHomeProps {
  settings: any;
  doctors: any[];
  services: any[];
  reviews: any[];
  faqs: any[];
  blogs: any[];
  gallery: any[];
}

export default function MainHome({
  settings,
  doctors,
  services,
  reviews,
  faqs,
  blogs,
  gallery,
}: MainHomeProps) {
  const [lang] = useState<Language>("en");

  return (
    <>
      {/* Sections render inside PublicLayoutWrapper's <main> (Navbar/Footer/
          FloatingActions live there), so this component emits only content —
          no extra <main>/wrapper div, which would nest mains and break a11y. */}
      <Hero settings={settings} lang={lang} />
        
        <About settings={settings} lang={lang} />
        
        <SectionTicker
          words={["Orthopaedic Physiotherapy", "Expert Rehabilitation", "Pain Relief Programs", "Sports Injury Care"]}
          bgColor="bg-teal-tint/20"
          textColor="text-teal-dark"
        />

        <Doctors doctors={doctors} lang={lang} />

        <Services services={services} lang={lang} />

        <InteractiveBodyMap lang={lang} />

        <SectionTicker
          words={["Quick Scheduling", "WhatsApp Bookings", "Instant Confirmation", "Easy Online Booking"]}
          reverse={true}
          bgColor="bg-brand-blush/20"
          textColor="text-pink-safe"
        />

        <BookingForm doctors={doctors} lang={lang} />

        <SectionTicker
          words={["Verified Patient Feedback", "Aesthetic Clinical Experience", "Premium Physiotherapy", "Murugan Patient Stories"]}
          bgColor="bg-teal-tint/20"
          textColor="text-teal-dark"
        />

        <Testimonials reviews={reviews} lang={lang} />

        <SectionTicker
          words={["Modern Treatment Rooms", "Rehabilitation Exercise Area", "State of the Art Operations", "Virtual Tour"]}
          reverse={true}
          bgColor="bg-brand-blush/20"
          textColor="text-pink-safe"
        />

        <GalleryGrid gallery={gallery} lang={lang} />

        <SectionTicker
          words={["Doctor Health Advice", "Recovery Tips", "Clinical FAQs answered", "Murugan Physio Blogs"]}
          bgColor="bg-teal-tint/20"
          textColor="text-teal-dark"
        />

        <BlogGrid posts={blogs} lang={lang} />

      {/* Chatbot Assistant */}
      <Chatbot settings={settings} doctors={doctors} />
    </>
  );
}
