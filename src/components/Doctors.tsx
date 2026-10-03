"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Clock, Award, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { translations, Language } from "@/lib/translations";

interface DoctorsProps {
  doctors: any[];
  lang: Language;
}

export default function Doctors({ doctors, lang }: DoctorsProps) {
  const t = translations[lang];
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalDoctors = doctors?.length || 0;

  // Auto rotate carousel every 4 seconds
  useEffect(() => {
    if (isPaused || totalDoctors <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % totalDoctors);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, totalDoctors]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + totalDoctors) % totalDoctors);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % totalDoctors);
  };

  return (
    <section id="doctors" className="py-20 sm:py-24 bg-brand-blush/20 border-b border-brand-border/40 relative overflow-hidden">
      {/* Desktop-only minimal background decoration */}
      <div className="absolute inset-0 z-0 hidden lg:block pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[40%] h-full opacity-[0.05]"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              #12284C,
              #12284C 1.5px,
              transparent 1.5px,
              transparent 24px
            )`,
          }}
        />
        <div className="absolute bottom-[-60px] left-[-60px] w-52 h-52 rounded-full border border-pink/10" />
        <div className="absolute top-[20%] right-[8%] w-6 h-6 rotate-45 border border-teal/15" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-8 w-full relative z-10">

        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-tint text-teal-dark text-xs font-semibold mb-4">
            <Shield className="w-4 h-4 text-teal" />
            <span>{t.doctorsBadge}</span>
          </div>
          <h2 className="font-heading font-bold text-2xl xs:text-3xl sm:text-4xl text-brand-ink mb-4">
            <span className="sm:hidden">
              {lang === "en"
                ? "Physiotherapy Specialists"
                : lang === "ta"
                ? "ஃபிசியோதெரபி நிபுணர்கள்"
                : t.doctorsTitle}
            </span>
            <span className="hidden sm:inline">{t.doctorsTitle}</span>
          </h2>
          <p className="text-brand-muted text-sm sm:text-base">{t.doctorsDesc}</p>
        </motion.div>

        {/* Doctors Auto-Rotating Sliding Carousel Container */}
        <div
          className="relative max-w-6xl mx-auto overflow-hidden [--card-size:100%] [--card-gap:16px] sm:[--card-size:360px] sm:[--card-gap:24px] lg:[--card-size:400px] lg:[--card-gap:32px] px-1 py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Sliding Motion Track */}
          <motion.div
            className="flex gap-4 sm:gap-6 lg:gap-8 items-stretch"
            animate={{ x: `calc(-${activeIdx} * (var(--card-size) + var(--card-gap)))` }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
          >
            {doctors.map((doc: any, idx: number) => {
              return (
                <div
                  key={doc._id || idx}
                  className="w-full sm:w-[360px] lg:w-[400px] shrink-0"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl border border-brand-border/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
                  >
                    {/* Doctor Photo Container (4:3 Aspect Ratio Across All Views) */}
                    <div className="relative w-full aspect-[4/3] bg-teal-tint/20 overflow-hidden shrink-0">
                      {doc.photo ? (
                        <Image
                          src={doc.photo}
                          alt={doc.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          loading="lazy"
                          quality={85}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-tint text-teal font-heading font-bold text-5xl">
                          {doc.name?.charAt(4) || "D"}
                        </div>
                      )}

                      {/* Pill Badge Overlay */}
                      <span className="absolute top-3 left-3 z-10 text-[10px] font-bold px-3 py-1.5 rounded-full border bg-white/95 backdrop-blur-xs flex items-center gap-1.5 shadow-sm uppercase tracking-wider text-brand-ink">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          doc.availability === "Available Today" ? "bg-emerald-500" : doc.availability === "Fully Booked" ? "bg-amber-500" : "bg-rose-500"
                        }`} />
                        {doc.availability || "Available Today"}
                      </span>
                    </div>

                    {/* Card Body Details */}
                    <div className="p-5 sm:p-4 sm:p-6 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-ink mb-1 group-hover:text-teal transition-colors">
                          {doc.name}
                        </h3>
                        <p className="text-teal font-semibold text-xs sm:text-sm mb-2">{doc.specialization}</p>

                        <div className="flex items-center gap-1.5 text-[11px] text-brand-muted mb-3 font-semibold uppercase tracking-wider">
                          <Award className="w-3.5 h-3.5 text-teal shrink-0" />
                          <span>{doc.qualification}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-4 line-clamp-3">
                          {doc.description}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="pt-3 border-t border-brand-border/50 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-brand-ink font-semibold">
                          <Clock className="w-3.5 h-3.5 text-teal shrink-0" />
                          <span>{doc.consultingTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-brand-ink font-semibold">
                          <Phone className="w-3.5 h-3.5 text-teal shrink-0" />
                          <a href={`tel:${doc.phone}`} className="hover:text-teal transition-colors">{doc.phone}</a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Single Row Controls + CTA Button across all views */}
        <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-3 mt-8 w-full px-1">
          {/* Carousel Controls */}
          {totalDoctors > 1 ? (
            <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
              <button
                onClick={handlePrev}
                aria-label="Previous Doctor"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-brand-border/80 shadow-xs flex items-center justify-center text-brand-ink hover:text-teal hover:border-teal transition-all cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {doctors.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 cursor-pointer ${
                      idx === activeIdx
                        ? "w-4 sm:w-6 h-2 sm:h-2.5 bg-brand-ink rounded-full"
                        : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gray-300 hover:bg-gray-400 rounded-full"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                aria-label="Next Doctor"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-brand-border/80 shadow-xs flex items-center justify-center text-brand-ink hover:text-teal hover:border-teal transition-all cursor-pointer shrink-0"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          ) : <div />}

          {/* Action CTA Button */}
          <a
            href="#booking"
            className="px-4 py-2 sm:px-4 sm:px-6 sm:py-2.5 rounded-full border border-teal text-teal hover:bg-teal hover:text-white font-bold text-[11px] sm:text-xs transition-all duration-300 shadow-xs active:scale-95 flex items-center gap-1.5 shrink-0 ml-auto cursor-pointer"
          >
            <span>{t.heroBtnBook}</span>
          </a>
        </div>

      </div>

      {/* Ticker marquee at bottom */}
      <div className="w-full overflow-hidden bg-brand-blush/35 border-t border-brand-border/40 py-2.5 mt-16 select-none">
        <div className="flex gap-8 whitespace-nowrap animate-marquee-reverse">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex gap-8 text-[10px] font-bold text-pink-safe uppercase tracking-widest">
              <span>✦ Orthopaedic Physiotherapy Care</span>
              <span>✦ Stroke & Paralysis Rehabilitation</span>
              <span>✦ Dedicated Home Visit Physiotherapy</span>
              <span>✦ Neck, Back & Joint Pain Relief</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
