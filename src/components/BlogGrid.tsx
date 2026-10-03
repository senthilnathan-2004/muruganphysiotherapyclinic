"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calendar, User, Tag, ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { translations, Language } from "@/lib/translations";

import ClientDate from "@/components/ClientDate";
import { useFocusTrap } from "@/lib/useFocusTrap";

interface BlogGridProps {
  posts: any[];
  lang: Language;
}

export default function BlogGrid({ posts, lang }: BlogGridProps) {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => setMounted(true), []);
  const trapRef = useFocusTrap<HTMLDivElement>(!!selectedPost);

  const totalPosts = posts?.length || 0;

  // Auto rotate carousel every 4 seconds
  useEffect(() => {
    if (isPaused || totalPosts <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % totalPosts);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, totalPosts]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + totalPosts) % totalPosts);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % totalPosts);
  };

  // Modal a11y: close on Esc, lock background scroll while open.
  useEffect(() => {
    if (!selectedPost) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPost(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selectedPost]);

  const t = translations[lang];

  return (
    <section id="blog" className="py-20 sm:py-24 bg-brand-blush/10 border-b border-brand-border/40 relative overflow-hidden">
      {/* Desktop-only minimal background decoration */}
      <div className="absolute inset-0 z-0 hidden lg:block pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[30%] h-full opacity-[0.04]"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              #12284C,
              #12284C 1.5px,
              transparent 1.5px,
              transparent 28px
            )`,
          }}
        />
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full border border-pink/10" />
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
            <BookOpen className="w-4 h-4 text-teal" />
            <span>{t.blogBadge}</span>
          </div>
          <h2 className="font-heading font-bold text-2xl xs:text-3xl sm:text-4xl text-brand-ink mb-4">
            <span className="sm:hidden">
              {lang === "en"
                ? "Health & Recovery Tips"
                : lang === "ta"
                ? "மருத்துவக் குறிப்புகள்"
                : t.blogTitle}
            </span>
            <span className="hidden sm:inline">{t.blogTitle}</span>
          </h2>
          <p className="text-brand-muted text-sm sm:text-base">{t.blogDesc}</p>
        </motion.div>

        {/* Blogs Auto-Rotating Sliding Carousel Slider */}
        {posts.length === 0 ? (
          <div className="text-center text-sm text-brand-muted py-8">
            No health tips articles published yet.
          </div>
        ) : (
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
              {posts.map((post, idx) => {
                return (
                  <div
                    key={post._id || idx}
                    className="w-full sm:w-[360px] lg:w-[400px] shrink-0"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-3xl border border-brand-border/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group"
                    >
                      <div>
                        {/* Top Image — Corrected Aspect Ratio for Crisp Rendering */}
                        <div className="relative w-full aspect-[16/10] bg-teal-tint/20 overflow-hidden shrink-0">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 400px"
                              loading="lazy"
                              quality={85}
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-teal-tint text-teal/50 font-heading font-bold text-lg">
                              Murugan Physio Clinic
                            </div>
                          )}

                          {/* Pill Category Badge */}
                          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[10px] font-bold px-3 py-1.5 rounded-full border border-brand-border/60 text-teal-dark uppercase tracking-wider shadow-sm">
                            {post.category || "Health Tips"}
                          </span>
                        </div>

                        {/* Body Details */}
                        <div className="p-5 sm:p-4 sm:p-6">
                          <div className="flex items-center gap-3 text-[10px] text-brand-muted font-bold uppercase mb-2.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-teal shrink-0" />
                              <ClientDate date={post.createdAt} />
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-teal shrink-0" />
                              {post.author}
                            </span>
                          </div>

                          <h3 className="font-heading font-bold text-base sm:text-lg text-brand-ink mb-2 leading-snug line-clamp-2 group-hover:text-teal transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-3 mb-4">
                            {post.content}
                          </p>
                        </div>
                      </div>

                      {/* Footer Link */}
                      <div className="px-5 pb-5 sm:px-4 sm:px-6 sm:pb-6 pt-0 border-t border-brand-border/40 mt-auto flex items-center justify-between pt-4">
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="flex items-center gap-1.5 text-teal font-semibold text-xs hover:text-teal-dark transition-colors group/btn cursor-pointer"
                        >
                          <span>Read Article</span>
                          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>

            {/* Single Row Controls + See All Link across all views */}
            <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-3 mt-8 w-full px-1">
              {/* Carousel Controls */}
              {totalPosts > 1 ? (
                <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous Article"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-brand-border/80 shadow-xs flex items-center justify-center text-brand-ink hover:text-teal hover:border-teal transition-all cursor-pointer shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {posts.map((_, idx) => (
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
                    aria-label="Next Article"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-brand-border/80 shadow-xs flex items-center justify-center text-brand-ink hover:text-teal hover:border-teal transition-all cursor-pointer shrink-0"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ) : <div />}

              {/* See All Button */}
              <Link
                href="/blogs"
                className="px-4 py-2 sm:px-4 sm:px-6 sm:py-2.5 rounded-full border border-teal text-teal hover:bg-teal hover:text-white font-bold text-[11px] sm:text-xs transition-all duration-300 shadow-xs active:scale-95 flex items-center gap-1.5 shrink-0 ml-auto cursor-pointer"
              >
                <span>{lang === "en" ? "See All Health Tips" : "அனைத்து கட்டுரைகளும் காண்க"}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Article Reader Lightbox */}
        {mounted && createPortal(
        <AnimatePresence>
        {selectedPost && (
          <motion.div
            ref={trapRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-md"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-brand-border shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative p-6 sm:p-5 sm:p-8"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-brand-cream hover:bg-gray-200 flex items-center justify-center text-brand-ink transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {selectedPost.image && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 bg-teal-tint/20">
                  <Image
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 text-xs text-brand-muted font-semibold uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal shrink-0" />
                  <ClientDate date={selectedPost.createdAt} />
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-teal shrink-0" />
                  {selectedPost.author}
                </span>
              </div>

              <h2 className="font-heading font-bold text-2xl text-brand-ink mb-4 leading-snug">
                {selectedPost.title}
              </h2>

              <div className="prose prose-sm max-w-none text-brand-muted leading-relaxed whitespace-pre-line">
                {selectedPost.content}
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
        )}

      </div>
    </section>
  );
}
