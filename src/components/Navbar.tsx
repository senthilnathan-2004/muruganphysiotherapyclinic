"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Calendar, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { translations, Language } from "@/lib/translations";

interface NavbarProps {
  settings: any;
  lang?: Language;
  setLang?: (l: Language) => void;
}

const CustomBurger = ({ className, strokeWidth = 2.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="5" x2="21" y2="5" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="19" x2="13" y2="19" />
  </svg>
);

export default function Navbar({ settings, lang = "en" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t.navHome || "Home", href: "/#home" },
    { name: t.navAbout || "About Us", href: "/#about" },
    { name: t.navDoctors || "Doctors", href: "/#doctors" },
    { name: t.navServices || "Services", href: "/#services" },
    { name: t.navGallery || "Gallery", href: "/#gallery" },
    { name: t.navBlog || "Health Tips", href: "/#blog" },
    { name: t.navFaq || "FAQs", href: "/faqs" },
    { name: t.navContact || "Contact", href: "/contact" },
  ];

  const clinicName = settings?.clinicName || "Murugan Physio Clinic";
  const logoUrl = settings?.logo;
  const phone = settings?.phone || "+91 97863 14138";
  const phoneTel = phone.replace(/[^0-9+]/g, "");

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-brand-border/60 transition-all duration-300 ${
        scrolled ? "shadow-md py-2" : "shadow-sm py-2.5 sm:py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          
          {/* Logo / Title */}
          <Link href="/#home" className="flex items-center gap-2.5 shrink-0 my-auto">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-teal shrink-0 bg-white shadow-xs flex items-center justify-center my-auto">
              <Image
                src={logoUrl || "/logo.jpg"}
                alt="Murugan Physio Clinic Logo"
                fill
                sizes="40px"
                unoptimized
                className="object-cover"
              />
            </div>
            <span className="font-heading font-bold text-base sm:text-lg md:text-xl text-brand-ink tracking-tight truncate max-w-none lg:max-w-[180px] flex items-center leading-tight my-auto">
              {clinicName}
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6 my-auto">
            <div className="flex items-center gap-4 xl:gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-semibold text-xs xl:text-sm text-brand-ink hover:text-teal transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-teal transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Redesigned Call Button & Book CTA (No translator, No Admin button) */}
            <div className="flex items-center gap-3 border-l border-brand-border/60 pl-4 xl:pl-5">
              {/* Modern Styled Call Button */}
              <a
                href={`tel:${phoneTel}`}
                className="flex items-center gap-2 bg-teal-tint/70 hover:bg-teal hover:text-white border border-teal/20 text-teal-dark px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-xs xl:text-sm font-bold transition-all shadow-2xs group shrink-0"
              >
                <div className="w-5 h-5 rounded-full bg-teal/15 group-hover:bg-white/25 flex items-center justify-center text-teal group-hover:text-white transition-colors shrink-0">
                  <PhoneCall className="w-3 h-3" />
                </div>
                <span className="truncate">{phone}</span>
              </a>

              {/* Desktop Booking Pill Button */}
              <Link
                href="/#booking"
                className="bg-teal hover:bg-teal-dark text-white px-4 py-2 xl:px-5 xl:py-2 rounded-xl font-bold text-xs xl:text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.heroBtnBook || "Book Appointment"}</span>
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center justify-center shrink-0 my-auto">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="p-2 rounded-lg text-brand-ink hover:text-teal focus:outline-none shrink-0 flex items-center justify-center my-auto"
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <CustomBurger className="w-6 h-6 text-brand-ink" strokeWidth={2.5} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="lg:hidden bg-white/95 border-b border-brand-border py-4 px-4 sm:px-6 absolute top-full left-0 w-full shadow-lg overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: idx * 0.055, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-base font-semibold text-brand-ink hover:text-teal py-2.5 border-b border-brand-border/30 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                <a
                  href={`tel:${phoneTel}`}
                  className="flex items-center justify-center gap-2 bg-teal-tint text-teal-dark border border-teal/20 py-3 rounded-xl font-bold text-sm"
                >
                  <PhoneCall className="w-4 h-4 text-teal" />
                  <span>Call {phone}</span>
                </a>

                <Link
                  href="/#booking"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-teal text-white py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t.heroBtnBook || "Book Appointment"}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
