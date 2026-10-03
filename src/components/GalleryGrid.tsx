"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ZoomIn,
  Eye,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { translations, Language } from "@/lib/translations";
import { useFocusTrap } from "@/lib/useFocusTrap";

interface GalleryGridProps {
  gallery: any[];
  lang: Language;
}

// Fallback high quality items matching Dr. Murugan's authentic clinic services
const FALLBACK_ITEMS = [
  {
    _id: "fb-1",
    imageUrl:
      "https://ik.imagekit.io/senra6374/mvp-physio-clinic/Physiotherapy_image_color_backgr__2K_20261003205215_cSeEtgTQH.jpg",
    caption: "Orthopaedic Rehabilitation & Manual Therapy",
    categoryLabel: "MANUAL THERAPY",
    rating: "5.0",
    location: "Murugan Physio Clinic • Kilkodungalur",
  },
  {
    _id: "fb-2",
    imageUrl:
      "https://ik.imagekit.io/senra6374/mvp-physio-clinic/Editing_doctor_position_and_back__2K_20261003211001_YY_f3I2I14.jpg",
    caption: "Doctor Consultation & Clinical Assessment",
    categoryLabel: "DOCTOR CONSULT",
    rating: "4.9",
    location: "Dr. G. Murugan, M.P.T. (Ortho) Suite",
  },
  {
    _id: "fb-3",
    imageUrl:
      "https://ik.imagekit.io/senra6374/mvp-physio-clinic/usman-yousaf-pTrhfmj2jDA-unsplash_AD6lJwu-2.jpg",
    caption: "Specialized Therapy & Treatment Room",
    categoryLabel: "TREATMENT SUITE",
    rating: "5.0",
    location: "Advanced Electrotherapy Unit",
  },
  {
    _id: "fb-4",
    imageUrl:
      "https://ik.imagekit.io/senra6374/mvp-physio-clinic/usman-yousaf-pTrhfmj2jDA-unsplash_Nr8vmtsL0x.jpg",
    caption: "Exercise & Mobility Rehabilitation Area",
    categoryLabel: "REHAB STUDIO",
    rating: "4.9",
    location: "Gait Retraining & Movement Space",
  },
];

const CATEGORY_TAGS = [
  "CLINICAL CARE",
  "SPECIALIST CONSULT",
  "TREATMENT SUITE",
  "REHAB STUDIO",
  "ORTHOPAEDIC CARE",
];

export default function GalleryGrid({ gallery, lang }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);

  const t = translations[lang];
  const trapRef = useFocusTrap<HTMLDivElement>(!!selectedImg);

  // Responsive width tracking
  useEffect(() => {
    setMounted(true);
    const updateSize = () => setWindowWidth(window.innerWidth);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Format incoming gallery or use rich fallbacks
  const rawItems = gallery && gallery.length > 0 ? gallery : FALLBACK_ITEMS;
  const items = rawItems.map((item, idx) => ({
    _id: item._id || `item-${idx}`,
    imageUrl: item.imageUrl || "/herobanner.jpg",
    caption: item.caption || "Murugan Physiotherapy Clinic",
    categoryLabel:
      item.categoryLabel ||
      CATEGORY_TAGS[idx % CATEGORY_TAGS.length] ||
      "CLINICAL CARE",
    rating: item.rating || (idx % 2 === 0 ? "5.0" : "4.9"),
    location:
      item.location || "Murugan Physio Clinic • Kilkodungalur",
  }));

  const count = items.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  // Keyboard navigation & Esc key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImg) {
        if (e.key === "Escape") setSelectedImg(null);
        return;
      }
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg, handlePrev, handleNext]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (!selectedImg) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedImg]);

  // Sizing definitions based on responsive breakpoints (wider, cinematic cards)
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isLargeDesktop = windowWidth >= 1280;

  const cardWidth = isMobile
    ? Math.min(Math.max(windowWidth - 54, 295), 335)
    : isTablet
    ? 370
    : isLargeDesktop
    ? 440
    : 410;

  const cardHeight = isMobile
    ? 425
    : isTablet
    ? 465
    : isLargeDesktop
    ? 515
    : 490;

  const xStep = isMobile
    ? 105
    : isTablet
    ? 185
    : isLargeDesktop
    ? 280
    : 255;

  return (
    <section
      id="gallery"
      className="py-14 sm:py-24 bg-gradient-to-b from-brand-blush/20 via-white to-brand-blush/10 border-b border-brand-border/40 relative overflow-hidden"
    >
      {/* Background Decorative Accents */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal/5 rounded-full blur-3xl"
        />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Header Section */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-tint text-teal-dark text-xs font-semibold mb-3.5 shadow-xs">
            <Eye className="w-3.5 h-3.5 text-teal" />
            <span>{t.galleryBadge}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl xs:text-3xl sm:text-4xl text-brand-ink mb-3 tracking-tight">
            <span className="sm:hidden">
              {lang === "en"
                ? "Our Clinic & Facilities"
                : lang === "ta"
                ? "மருத்துவமனை ஒரு பார்வை"
                : t.galleryTitle}
            </span>
            <span className="hidden sm:inline">{t.galleryTitle}</span>
          </h2>
          <p className="text-brand-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {t.galleryDesc}
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 text-teal text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === "en"
                ? "Swipe, drag, or click any card to focus"
                : "படங்களை கிளிக் செய்து அல்லது நகர்த்திப் பார்க்கவும்"}
            </span>
          </div>
        </motion.div>

        {/* 3D Coverflow Perspective Stage */}
        <div className="relative w-full flex items-center justify-center">
          
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-1 sm:left-3 lg:left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-brand-ink shadow-xl border border-slate-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-1 sm:right-3 lg:right-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-brand-ink shadow-xl border border-slate-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
          </button>

          {/* Perspective Container */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.x > 40 || velocity.x > 400) {
                handlePrev();
              } else if (offset.x < -40 || velocity.x < -400) {
                handleNext();
              }
            }}
            className="relative w-full flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing"
            style={{
              perspective: "1200px",
              height: `${cardHeight + 30}px`,
            }}
          >
            {items.map((item, idx) => {
              let diff = idx - activeIndex;

              // Wrap-around calculation for circular coverflow
              if (diff > count / 2) diff -= count;
              if (diff < -count / 2) diff += count;

              const isCenter = diff === 0;

              // Calculate 3D transformation values
              let x = 0;
              let scale = 1;
              let rotateY = 0;
              let zIndex = 30;
              let opacity = 1;
              let brightness = 1;

              if (diff === 0) {
                x = 0;
                scale = 1.05;
                rotateY = 0;
                zIndex = 35;
                opacity = 1;
                brightness = 1;
              } else if (diff === -1) {
                x = -xStep;
                scale = isMobile ? 0.86 : 0.88;
                rotateY = isMobile ? 18 : 22;
                zIndex = 25;
                opacity = isMobile ? 0.7 : 0.85;
                brightness = 0.82;
              } else if (diff === 1) {
                x = xStep;
                scale = isMobile ? 0.86 : 0.88;
                rotateY = isMobile ? -18 : -22;
                zIndex = 25;
                opacity = isMobile ? 0.7 : 0.85;
                brightness = 0.82;
              } else if (diff === -2 || (diff < -1 && diff >= -count / 2)) {
                x = -xStep * (isMobile ? 1.45 : 1.75);
                scale = isMobile ? 0.72 : 0.76;
                rotateY = isMobile ? 26 : 32;
                zIndex = 15;
                opacity = isMobile ? 0 : 0.55;
                brightness = 0.68;
              } else if (diff === 2 || (diff > 1 && diff <= count / 2)) {
                x = xStep * (isMobile ? 1.45 : 1.75);
                scale = isMobile ? 0.72 : 0.76;
                rotateY = isMobile ? -26 : -32;
                zIndex = 15;
                opacity = isMobile ? 0 : 0.55;
                brightness = 0.68;
              } else {
                x = Math.sign(diff) * xStep * 2.2;
                scale = 0.6;
                rotateY = Math.sign(diff) * -35;
                zIndex = 5;
                opacity = 0;
                brightness = 0.5;
              }

              return (
                <div
                  key={item._id || idx}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    zIndex,
                    pointerEvents: opacity === 0 ? "none" : "auto",
                  }}
                >
                  <motion.div
                    animate={{
                      x,
                      scale,
                      rotateY,
                      opacity,
                      filter: `brightness(${brightness})`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 26,
                    }}
                    style={{
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      transformStyle: "preserve-3d",
                    }}
                    onClick={() => {
                      if (isCenter) {
                        setSelectedImg(item.imageUrl);
                      } else {
                        setActiveIndex(idx);
                      }
                    }}
                    className={`relative rounded-3xl overflow-hidden border border-white/40 shadow-2xl transition-shadow duration-300 group cursor-pointer ${
                      isCenter
                        ? "ring-2 ring-teal/50 shadow-teal/15 shadow-2xl"
                        : "hover:border-teal/50"
                    }`}
                  >
                    {/* Background Image */}
                    <img
                      src={item.imageUrl}
                      alt={item.caption}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/herobanner.jpg";
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />


                    {/* Top Left Zoom affordance on hover */}
                    {isCenter && (
                      <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-teal shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                    )}

                    {/* Bottom Dark Vignette Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent z-10 pointer-events-none" />

                    {/* Card Information Overlay */}
                    <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5 z-20 text-left">
                      {/* Subtitle / Category Badge */}
                      <span className="text-teal-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider block mb-1 drop-shadow-xs">
                        {item.categoryLabel}
                      </span>

                      {/* Main Title */}
                      <h3 className="text-white font-extrabold text-sm sm:text-base md:text-lg uppercase tracking-tight leading-snug drop-shadow-sm line-clamp-2">
                        {item.caption}
                      </h3>

                      {/* Location Note */}
                      <div className="flex items-center gap-1.5 text-slate-300 text-[11px] sm:text-xs mt-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 cursor-pointer ${
                activeIndex === i
                  ? "w-7 h-2.5 bg-teal rounded-full shadow-sm"
                  : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400 rounded-full"
              }`}
            />
          ))}
        </div>

        {/* View All Media Link */}
        <div className="flex justify-center mt-8">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 rounded-full border border-teal bg-white px-7 py-3 text-sm font-bold text-teal shadow-sm transition-all duration-300 hover:bg-teal hover:text-white active:scale-95 cursor-pointer"
          >
            <span>
              {lang === "en" ? "View Full Media Library" : "முழு புகைப்படங்களை காண்க"}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>

      {/* Lightbox Modal */}
      {mounted &&
        selectedImg &&
        createPortal(
          <div
            ref={trapRef}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedImg(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Gallery lightbox modal"
          >
            <button
              type="button"
              onClick={() => setSelectedImg(null)}
              className="absolute top-5 right-5 z-[110] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="relative w-full max-w-4xl max-h-[85vh] aspect-video rounded-3xl overflow-hidden flex items-center justify-center bg-black/50 shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImg}
                alt="Clinic Lightbox View"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/herobanner.jpg";
                }}
                className="w-full h-full object-contain"
              />
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
