"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import ServiceIcon from "@/components/ServiceIcon";
import Link from "next/link";
import { motion } from "framer-motion";
import { translations, Language } from "@/lib/translations";

interface ServicesProps {
  services: any[];
  lang: Language;
}

export default function Services({ services, lang }: ServicesProps) {
  const t = translations[lang];

  const renderIcon = (iconName: string) => (
    <ServiceIcon name={iconName} className="w-8 h-8 text-teal" />
  );

  const displayServices = services.slice(0, 6);

  return (
    <section id="services" className="py-14 sm:py-24 bg-white border-b border-brand-border/40 relative overflow-hidden">
      {/* Desktop-only minimal background decoration */}
      <div className="absolute inset-0 z-0 hidden lg:block pointer-events-none">
        {/* 1. Dot Grid Overlay */}
        <div
          className="absolute top-0 left-0 w-[25%] h-full opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(18,40,76,0.2) 1.5px, transparent 1.5px)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* 2. Top-right subtle glow */}
        <div className="absolute top-10 right-[-10%] w-[30vw] h-[30vw] rounded-full bg-teal-tint/15 blur-[80px]" />
        {/* 3. Plus marker */}
        <div className="absolute bottom-[20%] right-[6%] flex flex-col items-center opacity-40">
          <div className="w-[2px] h-6 bg-teal/30 rounded-full" />
          <div className="w-6 h-[2px] bg-teal/30 rounded-full -mt-[13px]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-8 w-full relative z-10">

        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-tint text-teal-dark text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-teal" />
            <span>{t.servicesBadge}</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-ink mb-4">{t.servicesTitle}</h2>
          <p className="text-brand-muted text-sm sm:text-base">{t.servicesDesc}</p>
        </motion.div>

        {/* Mobile View: Apple/Amazon Style 2-Row Dual Fast Glitch-Free Seamless Marquee */}
        <div className="block md:hidden space-y-4 relative overflow-hidden -mx-4 sm:-mx-6 px-0 select-none">
          {/* Left & Right Gradient Fade Overlays */}
          <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none" />

          {/* Row 1: Fast Seamless Infinite Scroll Left */}
          <div className="flex gap-3.5 whitespace-nowrap animate-marquee-fast hover:[animation-play-state:paused] active:[animation-play-state:paused] py-1 will-change-transform">
            {[...displayServices.slice(0, 3), ...displayServices.slice(0, 3), ...displayServices.slice(0, 3), ...displayServices.slice(0, 3)].map((service: any, idx: number) => (
              <div
                key={`r1-${service._id || idx}-${idx}`}
                className="bg-white p-5 rounded-3xl border border-brand-border/80 shadow-xs shrink-0 w-[240px] flex flex-col justify-between whitespace-normal transition-transform active:scale-95"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-tint flex items-center justify-center mb-3 text-teal shadow-xs">
                    {renderIcon(service.icon)}
                  </div>
                  <h3 className="font-heading font-bold text-base text-brand-ink mb-1.5 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Fast Seamless Infinite Scroll Right */}
          <div className="flex gap-3.5 whitespace-nowrap animate-marquee-fast-reverse hover:[animation-play-state:paused] active:[animation-play-state:paused] py-1 will-change-transform">
            {[...(displayServices.length > 3 ? displayServices.slice(3, 6) : displayServices.slice(0, 3)), ...(displayServices.length > 3 ? displayServices.slice(3, 6) : displayServices.slice(0, 3)), ...(displayServices.length > 3 ? displayServices.slice(3, 6) : displayServices.slice(0, 3)), ...(displayServices.length > 3 ? displayServices.slice(3, 6) : displayServices.slice(0, 3))].map((service: any, idx: number) => (
              <div
                key={`r2-${service._id || idx}-${idx}`}
                className="bg-white p-5 rounded-3xl border border-brand-border/80 shadow-xs shrink-0 w-[240px] flex flex-col justify-between whitespace-normal transition-transform active:scale-95"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-tint flex items-center justify-center mb-3 text-teal shadow-xs">
                    {renderIcon(service.icon)}
                  </div>
                  <h3 className="font-heading font-bold text-base text-brand-ink mb-1.5 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View: Standard Grid Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayServices.map((service: any, idx: number) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className={`bg-white p-5 sm:p-8 rounded-3xl border border-brand-border hover:border-teal/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${idx >= 4 ? "hidden lg:flex" : ""
                  }`}
              >
                <div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-teal-tint flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    {renderIcon(service.icon)}
                  </div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-ink mb-2 sm:mb-3 group-hover:text-teal transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-2 sm:mb-6">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {services.length > (services.length > 5 ? 5 : services.length) && (
          <motion.div
            className="flex justify-center mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link
              href="/services"
              className="px-8 py-3.5 rounded-full border border-teal text-teal hover:bg-teal hover:text-white font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === "en" ? "See All Services" : "அனைத்து சேவைகளும் காண்க"}</span>
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
}
