"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  Plus,
  Minus,
  MessageSquare,
  Phone,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Language, translations } from "@/lib/translations";

interface FaqsClientProps {
  initialFaqs: any[];
  settings: any;
}

export default function FaqsClient({ initialFaqs, settings }: FaqsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const phone = settings?.phone || "+91 97863 14138";
  const whatsapp = settings?.whatsapp || "+919786314138";

  // Comprehensive fallback FAQs if DB is empty
  const defaultFaqs = [
    {
      _id: "faq-1",
      category: "Appointments",
      question: "How do I book an appointment at Murugan Physiotherapy Clinic?",
      answer:
        "You can easily book an appointment online using our booking form, calling Dr. G. Murugan directly at +91 97863 14138, or sending us a message on WhatsApp.",
    },
    {
      _id: "faq-2",
      category: "Timings & Visit",
      question: "What are the clinic consulting hours?",
      answer:
        "Murugan Physiotherapy Clinic is open Monday through Saturday, Evening 5:30 PM to 8:30 PM. We are closed on Sundays. Dedicated home visit treatments are provided upon request.",
    },
    {
      _id: "faq-3",
      category: "Home Care",
      question: "Do you provide home visit physiotherapy treatments?",
      answer:
        "Yes! As highlighted in our services ('உங்கள் வீட்டிற்கு வந்து இயன்முறை சிகிச்சை அளிக்கப்படும்'), Dr. G. Murugan visits patients at their homes for stroke rehab, paralysis recovery, post-fracture mobility, and elderly care.",
    },
    {
      _id: "faq-4",
      category: "Treatments",
      question: "What conditions do you treat at Murugan Physiotherapy Clinic?",
      answer:
        "Dr. G. Murugan (B.P.T., M.P.T. Ortho) specializes in neck pain, back pain, sciatica, shoulder pain (frozen shoulder), knee arthritis, muscle spasms, sprains, paralysis / stroke rehabilitation, facial palsy (Bell's palsy), heel pain, and post-fracture recovery.",
    },
    {
      _id: "faq-5",
      category: "Treatments",
      question: "What is Dry Needling and is it painful?",
      answer:
        "Dry needling is a therapeutic technique using fine needles to target muscular trigger points and relieve deep muscle tightness. Most patients experience minimal discomfort followed by rapid pain relief.",
    },
    {
      _id: "faq-5",
      category: "Appointments",
      question: "Do I need a doctor's referral to visit the clinic?",
      answer:
        "No referral is required. You can walk in or book a direct consultation with our senior physiotherapist for thorough clinical evaluation and treatment planning.",
    },
    {
      _id: "faq-6",
      category: "General",
      question: "How many sessions of physiotherapy will I need?",
      answer:
        "The number of sessions depends on your specific condition, severity, and personal goals. After your initial assessment, your physiotherapist will outline a personalized treatment plan.",
    },
    {
      _id: "faq-7",
      category: "Treatments",
      question: "What is Manual Therapy and Chiropractic Adjustment?",
      answer:
        "Manual therapy and joint adjustments involve skilled hands-on techniques to mobilize stiff joints, realign spinal structures, and restore natural movement patterns without drugs.",
    },
    {
      _id: "faq-8",
      category: "Timings & Visit",
      question: "Where is Murugan Physiotherapy Clinic located?",
      answer:
        "We are located at No. 343, Badhur Road, Opposite to Sendamizh Matriculation School, Mangalam Mamandur, Kilkodungalur - 604 403, Tiruvannamalai District, Tamil Nadu. Find us easily on Google Maps or call +91 97863 14138.",
    },
  ];

  const faqsList = initialFaqs && initialFaqs.length > 0 ? initialFaqs : defaultFaqs;

  // Filter FAQs by search query and selected category
  const filteredFaqs = faqsList.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (faq.category && faq.category.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "Appointments", label: "Appointments" },
    { id: "Treatments", label: "Treatments & Therapy" },
    { id: "Timings & Visit", label: "Timings & Visit" },
    { id: "General", label: "General" },
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      {/* Hero Header Section */}
      <section className="bg-white py-10 sm:py-14 border-b border-brand-border/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Back to Home Button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-border/80 text-brand-ink hover:text-teal hover:border-teal text-xs font-bold transition-all shadow-xs active:scale-95 group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-teal group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-tint text-teal-dark text-xs font-bold mb-4 shadow-2xs">
              <HelpCircle className="w-4 h-4 text-teal" />
              <span>Help Center & Knowledge Base</span>
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-5xl text-brand-ink mb-4 leading-tight">
              Frequently Asked Questions
            </h1>

            <p className="text-brand-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Find instant answers to common questions about our physiotherapy consultations, specialized manual therapy treatments, appointment bookings, and clinic policies.
            </p>

            {/* Search Input Box */}
            <div className="mt-8 max-w-xl mx-auto relative">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-brand-muted absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions (e.g. appointment, dry needling, timings)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-brand-border bg-white shadow-sm focus:outline-none focus:border-teal text-sm text-brand-ink transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 text-xs font-semibold text-brand-muted hover:text-brand-ink cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Pills Filter */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setOpenIndex(0);
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-teal text-white shadow-md"
                  : "bg-slate-100 text-brand-muted hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Accordion List (8/12) */}
          <div className="lg:col-span-8 bg-white border border-brand-border/80 p-5 sm:p-8 rounded-3xl shadow-sm">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 text-brand-muted">
                <p className="font-semibold text-base">No questions found matching your search.</p>
                <p className="text-xs mt-1">Try searching with different keywords or browse by category.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq: any, index: number) => {
                  const isOpen = openIndex === index;
                  return (
                    <div
                      key={faq._id || index}
                      className="border border-brand-border/60 rounded-2xl overflow-hidden bg-slate-50/40 transition-all duration-200"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
                      >
                        <span className="font-heading font-bold text-sm sm:text-base text-brand-ink pr-4 leading-snug">
                          {faq.question}
                        </span>
                        <span className="shrink-0 p-1.5 rounded-full bg-white border border-brand-border text-teal">
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 border-t border-brand-border/30 text-xs sm:text-sm text-brand-muted leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Contact & Helpline Card (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-brand-blush/80 via-white to-teal-tint/30 border border-brand-border p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-tint text-teal flex items-center justify-center border border-teal/10">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-ink">
                  Still Have Questions?
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Can't find the answer you are looking for? Contact our clinical team directly for personalized medical inquiry or booking help.
                </p>

                <div className="pt-4 space-y-3">
                  <Link
                    href="/#booking"
                    className="w-full bg-teal hover:bg-teal-dark text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </Link>

                  <a
                    href={`tel:${phone}`}
                    className="w-full bg-white hover:bg-slate-50 text-brand-ink border border-brand-border font-bold py-3 px-4 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-teal" />
                    <span>Call {phone}</span>
                  </a>

                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>WhatsApp Direct Message</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-brand-border/40 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink">
                  Prompt Medical Response
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
