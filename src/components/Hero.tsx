"use client";

import React from "react";
import Link from "next/link";
import { Award, Calendar, Star, ShieldCheck, Stethoscope, Activity, ArrowRight, Sparkles } from "lucide-react";
import { translations, Language } from "@/lib/translations";

interface HeroProps {
  settings: any;
  lang: Language;
}

const DEFAULT_MOBILE_IMAGES = [
  {
    imageUrl:
      "https://ik.imagekit.io/senra6374/mvp-physio-clinic/Physiotherapy_image_color_backgr__2K_20261003205215_cSeEtgTQH.jpg",
    caption: "Manual Therapy",
  },
  {
    imageUrl:
      "https://ik.imagekit.io/senra6374/mvp-physio-clinic/Editing_doctor_position_and_back__2K_20261003211001_YY_f3I2I14.jpg",
    caption: "Doctor Consult",
  },
  {
    imageUrl:
      "https://ik.imagekit.io/senra6374/mvp-physio-clinic/usman-yousaf-pTrhfmj2jDA-unsplash_AD6lJwu-2.jpg",
    caption: "Electrotherapy Unit",
  },
  {
    imageUrl:
      "https://ik.imagekit.io/senra6374/mvp-physio-clinic/usman-yousaf-pTrhfmj2jDA-unsplash_Nr8vmtsL0x.jpg",
    caption: "Rehab Studio",
  },
  {
    imageUrl: "/herobanner.jpg",
    caption: "Orthopaedic Care",
  },
];

export default function Hero({ settings, lang }: HeroProps) {
  const t = translations[lang];
  const heroImage = settings?.heroImage || "/herobanner.jpg";

  const rawMobileImages =
    Array.isArray(settings?.heroMobileImages) && settings.heroMobileImages.length > 0
      ? settings.heroMobileImages
      : DEFAULT_MOBILE_IMAGES;

  const mobileImages = rawMobileImages.map((item: any) =>
    typeof item === "string" ? { imageUrl: item, caption: "" } : item
  );

  // Duplicate for smooth seamless 360 infinite scrolling
  const scrollItems = [...mobileImages, ...mobileImages, ...mobileImages];

  const featurePills = [
    { icon: Star, label: lang === "en" ? "5.0 ★ Google Rating (32 Reviews)" : "5.0 ★ கூகிள் மதிப்பீடு (32 மதிப்புரைகள்)" },
    { icon: ShieldCheck, label: lang === "en" ? "Home Visit Care Available" : "வீட்டிற்கே வந்து சிகிச்சை" },
    { icon: Stethoscope, label: lang === "en" ? "Dr. G. Murugan, M.P.T. (Ortho)" : "டாக்டர் G. முருகன், M.P.T. (Ortho)" },
    { icon: Activity, label: lang === "en" ? "Mon - Sat: 5:30 - 8:30 PM" : "திங்கள் - சனி: மாலை 5:30 - 8:30" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-[71vh] sm:min-h-0 lg:min-h-[calc(100vh-3.5rem)] flex flex-col justify-between pt-10 sm:pt-14 lg:pt-16 mt-14 sm:mt-16 overflow-hidden pb-10 sm:pb-14 lg:pb-12 scroll-mt-14 sm:scroll-mt-16"
    >
      {/* Background Image — plain <img> bypasses Next.js optimizer → zero quality loss */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt="Murugan Physio Clinic background"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-left lg:object-center"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
        
        {/* Main Text Content - Desktop max width constrained to left side */}
        <div className="w-full max-w-2xl sm:max-w-3xl lg:max-w-lg xl:max-w-xl mt-1 sm:mt-3">
          {/* Main Heading in white - Slightly increased for mobile/tab readability */}
          <h1 className="font-heading font-extrabold text-[34px] xs:text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.15] tracking-tight mb-3.5 sm:mb-6 drop-shadow-xs">
            {lang === "en" && settings?.tagline ? (
              settings.tagline
            ) : (
              <>
                {t.heroTitlePrefix}
                <span className="text-white underline decoration-skyblue decoration-4 underline-offset-8">
                  {t.heroTitleHighlight}
                </span>
                {t.heroTitleSuffix}
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/95 leading-relaxed mb-5 sm:mb-8 font-medium drop-shadow-xs lg:max-w-md xl:max-w-lg">
            {t.heroDesc || "Streamlined clinical recovery programs, manual therapy, and advanced orthopaedic physiotherapy care."}
          </p>

          {/* Primary Action Button */}
          <div className="mb-4 sm:mb-8">
            <Link
              href="#booking"
              className="inline-flex items-center gap-2.5 bg-teal hover:bg-teal-dark text-white px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer"
            >
              <span>{t.heroBtnBook || "Explore more"}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile View Half-Round Infinite Scrolling Showcase (Visible ONLY on mobile/tablet < lg) */}
        <div className="lg:hidden w-full my-4 xs:my-5 select-none overflow-hidden">
          {/* Subtle header hint */}
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-white drop-shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>{lang === "en" ? "Clinic & Therapy Care" : "சிறப்பு சிகிச்சைகள்"}</span>
            </div>
            <span className="text-[10px] font-semibold text-white/90 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/30 shadow-xs">
              {lang === "en" ? "Live Stream" : "தானியங்கி உலாவி"}
            </span>
          </div>

          {/* Full-bleed edge-to-edge container with side gradient fade masks */}
          <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            <div className="flex gap-3.5 w-max animate-hero-scroll hover:[animation-play-state:paused] active:[animation-play-state:paused]">
              {scrollItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative shrink-0 w-[138px] xs:w-[155px] h-[195px] xs:h-[220px] rounded-t-[68px] rounded-b-[20px] overflow-hidden border-2 border-white/90 shadow-2xl bg-white group transition-transform active:scale-95"
                >
                  {/* Ambient backdrop */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl || "/herobanner.jpg"}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover blur-md opacity-25 scale-110"
                    />
                  </div>

                  {/* Centered Main Image — scaled comfortably so nothing hides below text */}
                  <div className="absolute inset-x-0 top-0 bottom-8 xs:bottom-9 flex items-center justify-center p-2.5 pt-3.5 z-10 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl || "/herobanner.jpg"}
                      alt={item.caption || "Clinic Highlight"}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/herobanner.jpg";
                      }}
                      className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-xs"
                      loading="lazy"
                    />
                  </div>

                  {/* Half-Round Arch Top Glass Highlight */}
                  <div className="absolute inset-x-0 top-0 h-10 rounded-t-[68px] bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none z-20" />

                  {/* Bottom Dark Vignette Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none z-20" />

                  {/* Caption Pill at bottom */}
                  {item.caption && (
                    <div className="absolute bottom-2 inset-x-1.5 text-center pointer-events-none z-30">
                      <span className="inline-block max-w-full px-2.5 py-0.5 rounded-full text-[10px] xs:text-[11px] font-bold text-white bg-slate-950/85 backdrop-blur-md border border-white/30 truncate shadow-xs">
                        {item.caption}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Bottom Feature Badges Bar (Heltro style 4 white pills) */}
        <div className="mt-4 sm:mt-8 pt-2">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3">
            {featurePills.map((pill, idx) => {
              const Icon = pill.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/95 backdrop-blur-md text-teal font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-white/60 shadow-sm flex items-center gap-2 truncate"
                >
                  <Icon className="w-4 h-4 text-teal shrink-0" />
                  <span className="truncate">{pill.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
