"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  MessageSquare,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  subject: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
  website: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactClientProps {
  settings: any;
}

export default function ContactClient({ settings }: ContactClientProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to send message");
      }

      setSuccess(true);
      reset();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const address = settings?.address || "No. 343, Badhur Road, Opposite to Sendamizh Matriculation School, Mangalam Mamandur, Kilkodungalur - 604 403, Tiruvannamalai District, Tamil Nadu";
  const phone = settings?.phone || "+91 97863 14138";
  const email = settings?.email || "senthilragunathan2004@gmail.com";
  const workingHours = settings?.workingHours || "Mon - Sat: 5:30 PM - 8:30 PM (Sunday Holiday) | Home Visit Care Available";
  let mapsUrl = settings?.mapsUrl || "";
  let embedMapsSrc = "";
  if (mapsUrl.includes("<iframe")) {
    const srcMatch = mapsUrl.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      embedMapsSrc = srcMatch[1];
    }
  } else if (mapsUrl.startsWith("http")) {
    embedMapsSrc = mapsUrl;
  }

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
              <MessageSquare className="w-4 h-4 text-teal" />
              <span>Direct Communication Channel</span>
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-5xl text-brand-ink mb-4 leading-tight">
              Contact Murugan Physiotherapy Clinic
            </h1>

            <p className="text-brand-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              We are here to assist with your recovery, treatment inquiries, and scheduling consultations. Reach out via phone, email, or send us a direct message below.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Details + Message Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 h-full flex flex-col">
            <div className="bg-gradient-to-br from-brand-blush/60 via-white to-teal-tint/25 border border-brand-border p-6 sm:p-10 rounded-3xl flex-1 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="relative space-y-6 sm:space-y-8">
                <div>
                  <h2 className="font-heading font-bold text-2xl text-brand-ink mb-1.5">Clinic Premises & Reach</h2>
                  <p className="text-xs text-brand-muted">Get in touch directly or visit our medical facility in Kilkodungalur.</p>
                </div>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-tint text-teal flex items-center justify-center shrink-0 border border-teal/10">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-ink uppercase tracking-wider mb-1">Clinic Address</h4>
                      <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">{address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-tint text-teal flex items-center justify-center shrink-0 border border-teal/10">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-ink uppercase tracking-wider mb-1">Phone Line</h4>
                      <a href={`tel:${phone}`} className="text-xs sm:text-sm text-teal-dark font-bold hover:underline block">{phone}</a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-pink/10 text-pink-safe flex items-center justify-center shrink-0 border border-pink/10">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-ink uppercase tracking-wider mb-1">Email Address</h4>
                      <a href={`mailto:${email}`} className="text-xs sm:text-sm text-pink-safe font-bold hover:underline block">{email}</a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-tint text-teal flex items-center justify-center shrink-0 border border-teal/10">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-ink uppercase tracking-wider mb-1">Working Hours</h4>
                      <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">{workingHours}</p>
                    </div>
                  </div>

                  {/* Google Maps Button */}
                  <a
                    href={
                      mapsUrl && !mapsUrl.includes("<iframe")
                        ? mapsUrl
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 bg-teal hover:bg-teal-dark text-white font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer w-full text-xs sm:text-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Open Location in Google Maps</span>
                  </a>
                </div>
              </div>

              <div className="relative mt-8 pt-4 border-t border-brand-border/40 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink">
                  Professional Healthcare & Physiotherapy
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-border shadow-md h-full flex flex-col justify-center flex-1">
              {success ? (
                <div className="text-center py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-teal-tint text-teal flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-brand-ink">Message Sent Successfully!</h3>
                  <p className="text-brand-muted text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting Murugan Physiotherapy Clinic. Our team will review your inquiry and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-teal text-white hover:bg-teal-dark px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-brand-ink mb-1">Send Us a Direct Message</h3>
                    <p className="text-xs text-brand-muted">Fill out the form below and we will respond promptly.</p>
                  </div>

                  {/* Honeypot field for spam prevention */}
                  <div className="absolute left-[-9999px] top-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
                    <label>
                      Website
                      <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-brand-ink mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        {...register("name")}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border focus:border-teal focus:outline-none text-sm text-brand-ink"
                      />
                      {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-brand-ink mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border focus:border-teal focus:outline-none text-sm text-brand-ink"
                      />
                      {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-brand-ink mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border focus:border-teal focus:outline-none text-sm text-brand-ink"
                      />
                      {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-brand-ink mb-1.5">Subject</label>
                      <input
                        type="text"
                        {...register("subject")}
                        placeholder="e.g. Treatment Inquiry"
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border focus:border-teal focus:outline-none text-sm text-brand-ink"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-brand-ink mb-1.5">Message / Inquiry *</label>
                    <textarea
                      rows={4}
                      {...register("message")}
                      placeholder="Please describe your injury, pain condition, or question..."
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-border focus:border-teal focus:outline-none text-sm text-brand-ink resize-none"
                    />
                    {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal hover:bg-teal-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
