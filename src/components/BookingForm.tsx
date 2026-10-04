"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calendar, Clock, User, Phone, Mail, MessageSquare,
  CheckCircle2, Loader2, Heart, Stethoscope, ClipboardList,
  ChevronDown, ChevronLeft, ChevronRight, Check, ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { translations, Language } from "@/lib/translations";
import { TIME_SLOTS, todayInClinicTZ } from "@/lib/slots";
import { VISIT_REASONS } from "@/lib/visitReasons";
import CustomDropdown, { DropdownOption } from "@/components/CustomDropdown";
import CustomDatePicker from "@/components/CustomDatePicker";

type SlotInfo = { time: string; available: boolean; past: boolean; full: boolean };

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a preferred slot"),
  doctor: z.string().min(1, "Please select a doctor"),
  visitReason: z.string().min(1, "Please select a reason for the visit"),
  symptoms: z.string().optional(),
  additionalNotes: z.string().optional(),
  message: z.string().optional(),
  isChild: z.boolean().default(false),
  childName: z.string().optional(),
  childDob: z.string().optional(),
  vaccinationReminderEnabled: z.boolean().default(false),
  website: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  doctors: any[];
  lang: Language;
}

const stepTranslations: Record<string, {
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step1Badge: string;
  step2Badge: string;
  step3Badge: string;
  toStep2Btn: string;
  toStep3Btn: string;
  backBtn: string;
  editBtn: string;
  trustBadge: string;
  optionalToggle: string;
  doctorAndDateNotice: string;
}> = {
  en: {
    step1Title: "Patient Details",
    step2Title: "Doctor & Date",
    step3Title: "Time Slot & Confirm",
    step1Badge: "Step 1 of 3",
    step2Badge: "Step 2 of 3",
    step3Badge: "Step 3 of 3",
    toStep2Btn: "Next: Doctor & Date",
    toStep3Btn: "Next: Select Time Slot",
    backBtn: "Back",
    editBtn: "Change",
    trustBadge: "100% Confidential & Secure Booking",
    optionalToggle: "Add Symptoms or Notes (Optional)",
    doctorAndDateNotice: "Select doctor & date in Step 2 to see available slots",
  },
  ta: {
    step1Title: "நோயாளி விவரங்கள்",
    step2Title: "மருத்துவர் மற்றும் தேதி",
    step3Title: "நேரம் மற்றும் உறுதிப்படுத்தல்",
    step1Badge: "படி 1 / 3",
    step2Badge: "படி 2 / 3",
    step3Badge: "படி 3 / 3",
    toStep2Btn: "அடுத்த படி: மருத்துவர் & தேதி",
    toStep3Btn: "அடுத்த படி: நேரத்தைத் தேர்வுசெய்க",
    backBtn: "முந்தையது",
    editBtn: "மாற்று",
    trustBadge: "100% ரகசியமானது மற்றும் பாதுகாப்பானது",
    optionalToggle: "அறிகுறிகள் அல்லது குறிப்புகளைச் சேர்க்க (விருப்பம்)",
    doctorAndDateNotice: "படி 2-ல் மருத்துவர் மற்றும் தேதியைத் தேர்ந்தெடுக்கவும்",
  },
  ml: {
    step1Title: "രോഗിയുടെ വിവരങ്ങൾ",
    step2Title: "ഡോക്ടറും തീയതിയും",
    step3Title: "സമയവും സ്ഥിരീകരണവും",
    step1Badge: "ഘട്ടം 1 / 3",
    step2Badge: "ഘട്ടം 2 / 3",
    step3Badge: "ഘട്ടം 3 / 3",
    toStep2Btn: "അടുത്തത്: ഡോക്ടറും തീയതിയും",
    toStep3Btn: "അടുത്തത്: സമയം തിരഞ്ഞെടുക്കുക",
    backBtn: "തിരികെ",
    editBtn: "മാറ്റുക",
    trustBadge: "100% സുരക്ഷിതവും രഹസ്യവുമാണ്",
    optionalToggle: "ലക്ഷണങ്ങൾ അല്ലെങ്കിൽ കുറിപ്പുകൾ ചേർക്കുക (ഓപ്ഷണൽ)",
    doctorAndDateNotice: "സ്ലോട്ടുകൾ കാണാൻ ഘട്ടം 2-ൽ ഡോക്ടറെയും തീയതിയും തിരഞ്ഞെടുക്കുക",
  },
  kn: {
    step1Title: "ರೋಗಿಯ ವಿವರಗಳು",
    step2Title: "ವೈದ್ಯರು ಮತ್ತು ದಿನಾಂಕ",
    step3Title: "ಸಮಯ ಮತ್ತು ದೃಢೀಕರಣ",
    step1Badge: "ಹಂತ 1 / 3",
    step2Badge: "ಹಂತ 2 / 3",
    step3Badge: "ಹಂತ 3 / 3",
    toStep2Btn: "ಮುಂದೆ: ವೈದ್ಯರು ಮತ್ತು ದಿನಾಂಕ",
    toStep3Btn: "ಮುಂದೆ: ಸಮಯ ಆಯ್ಕೆಮಾಡಿ",
    backBtn: "ಹಿಂದಕ್ಕೆ",
    editBtn: "ಬದಲಾಯಿಸಿ",
    trustBadge: "100% ಸುರಕ್ಷಿತ ಮತ್ತು ಗೌಪ್ಯ",
    optionalToggle: "ಲಕ್ಷಣಗಳು ಅಥವಾ ಟಿಪ್ಪಣಿಗಳನ್ನು ಸೇರಿಸಿ (ಐಚ್ಛಿಕ)",
    doctorAndDateNotice: "ಹಂತ 2 ರಲ್ಲಿ ವೈದ್ಯರು ಮತ್ತು ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ",
  },
  te: {
    step1Title: "రోగి వివరాలు",
    step2Title: "డాక్టర్ & తేదీ",
    step3Title: "సమయం & నిర్ధారణ",
    step1Badge: "దశ 1 / 3",
    step2Badge: "దశ 2 / 3",
    step3Badge: "దశ 3 / 3",
    toStep2Btn: "తరువాత: డాక్టర్ & తేదీ",
    toStep3Btn: "తరువాత: సమయం ఎంచుకోండి",
    backBtn: "వెనుకకు",
    editBtn: "మార్చు",
    trustBadge: "100% సురక్షితం మరియు గోప్యమైనది",
    optionalToggle: "లక్షణాలు లేదా గమనికలను జోడించండి (ఐచ్ఛికం)",
    doctorAndDateNotice: "దశ 2 లో డాక్టర్ మరియు తేదీని ఎంచుకోండి",
  },
  hi: {
    step1Title: "मरीज़ का विवरण",
    step2Title: "डॉक्टर और तारीख",
    step3Title: "समय स्लॉट और पुष्टि",
    step1Badge: "चरण 1 / 3",
    step2Badge: "चरण 2 / 3",
    step3Badge: "चरण 3 / 3",
    toStep2Btn: "आगे बढ़ें: डॉक्टर और तारीख",
    toStep3Btn: "आगे बढ़ें: समय स्लॉट चुनें",
    backBtn: "पीछे",
    editBtn: "बदलें",
    trustBadge: "100% सुरक्षित और गोपनीय",
    optionalToggle: "लक्षण या अतिरिक्त नोट्स जोड़ें (वैकल्पिक)",
    doctorAndDateNotice: "उपलब्ध स्लॉट देखने के लिए चरण 2 में डॉक्टर और तारीख चुनें",
  },
};

// ─── Custom Slot Grid ────────────────────────────────────────────────
function SlotPicker({ slots, allSlots, slotsReady, slotsLoading, value, onChange, error, noticeText }: {
  slots: SlotInfo[];
  allSlots: readonly string[];
  slotsReady: boolean;
  slotsLoading: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  noticeText: string;
}) {
  const displaySlots: SlotInfo[] = slotsReady && slots.length > 0
    ? slots
    : allSlots.map(time => ({ time, available: true, past: false, full: false }));

  if (!slotsReady) {
    return (
      <div className="rounded-xl border border-brand-border/60 bg-slate-50/70 py-4 px-3 text-center text-xs text-brand-muted/70 font-medium flex items-center justify-center gap-2">
        <Clock className="w-3.5 h-3.5 text-brand-muted/50 shrink-0" />
        <span className="truncate">{noticeText}</span>
      </div>
    );
  }

  if (slotsLoading) {
    return (
      <div className="rounded-xl border border-brand-border/60 bg-slate-50/70 py-4 px-3 flex items-center justify-center gap-2 text-xs text-brand-muted">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-teal shrink-0" />
        <span>Checking real-time slot availability…</span>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-0.5">
        {displaySlots.map((s) => {
          const selected = s.time === value;
          const unavailable = slotsReady && !s.available;
          return (
            <button
              key={s.time}
              type="button"
              disabled={unavailable}
              onClick={() => !unavailable && onChange(s.time)}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-150 cursor-pointer
                ${selected
                  ? "bg-teal text-white border-teal shadow-xs shadow-teal/30 scale-[1.02]"
                  : unavailable
                  ? "bg-slate-50 text-brand-muted/30 border-brand-border/40 cursor-not-allowed line-through"
                  : "bg-white border-brand-border text-brand-ink hover:border-teal hover:bg-teal-tint/40"
                }
              `}
            >
              <Clock className={`w-3 h-3 shrink-0 ${selected ? "text-white" : unavailable ? "text-brand-muted/30" : "text-teal"}`} />
              <span className="truncate">{s.time}</span>
              {slotsReady && s.full && !selected && (
                <span className="ml-1 text-[9px] font-bold text-rose-500 shrink-0">Full</span>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}

// ─── Main BookingForm ────────────────────────────────────────────────
export default function BookingForm({ doctors, lang }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showOptional, setShowOptional] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const t = translations[lang] || translations.en;
  const st = stepTranslations[lang] || stepTranslations.en;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { isChild: false, vaccinationReminderEnabled: false },
  });

  const selectedDoctor = watch("doctor");
  const selectedDate = watch("date");
  const selectedTime = watch("time");
  const selectedReason = watch("visitReason");
  const watchedName = watch("name");
  const watchedPhone = watch("phone");
  const watchedEmail = watch("email");

  const selectedDoctorObj = doctors.find((d) => d._id === selectedDoctor);

  const today = todayInClinicTZ();
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const loadAvailability = React.useCallback(async (doctor: string, date: string) => {
    if (!doctor || !date) { setSlots([]); return; }
    setSlotsLoading(true);
    try {
      const res = await fetch(`/api/appointments/availability?doctor=${doctor}&date=${date}`);
      const data = await res.json();
      setSlots(Array.isArray(data.slots) ? data.slots : []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    setValue("time", "");
    loadAvailability(selectedDoctor, selectedDate);
  }, [selectedDoctor, selectedDate, setValue, loadAvailability]);

  useEffect(() => {
    const handlePrefill = (e: any) => {
      if (e.detail?.reason) {
        setValue("visitReason", e.detail.reason, { shouldValidate: true });
      }
    };
    window.addEventListener("prefill-booking-reason", handlePrefill);
    return () => window.removeEventListener("prefill-booking-reason", handlePrefill);
  }, [setValue]);

  const slotsReady = Boolean(selectedDoctor && selectedDate);
  const noSlotsFree = slotsReady && !slotsLoading && slots.length > 0 && slots.every((s) => !s.available);

  const doctorOptions: DropdownOption[] = [
    ...doctors.map((doc) => ({ value: doc._id, label: doc.name, sub: doc.specialization || "" })),
  ];

  const visitReasonOptions: DropdownOption[] = VISIT_REASONS.map((r) => ({ value: r, label: r }));

  // Step 1 -> Step 2 validation
  const handleToStep2 = async () => {
    const valid = await trigger(["name", "phone", "email"]);
    if (valid) {
      setErrorMsg("");
      setCurrentStep(2);
    }
  };

  // Step 2 -> Step 3 validation
  const handleToStep3 = async () => {
    const valid = await trigger(["doctor", "visitReason", "date"]);
    if (valid) {
      setErrorMsg("");
      setCurrentStep(3);
    }
  };

  const onSubmit = async (data: BookingFormValues) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (!response.ok || !resData.success) throw new Error(resData.error || "Failed to book appointment");
      setSuccess(true);
      reset();
      setCurrentStep(1);
      setShowOptional(false);
      setSlots([]);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      if (selectedDoctor && selectedDate) loadAvailability(selectedDoctor, selectedDate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="py-12 sm:py-20 bg-gradient-to-tr from-teal-tint/50 via-white to-brand-blush/30 border-b border-brand-border/40 relative z-20">
      <div className="absolute inset-0 z-0 hidden lg:block pointer-events-none overflow-hidden">
        <div className="absolute top-[-50px] left-[-50px] w-48 h-48 rounded-full border border-teal/10" />
        <div className="absolute bottom-[15%] right-[5%] w-8 h-8 rotate-12 border border-pink/15" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Equal height container on desktop with items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-stretch">

          {/* Left Column: Clinic Highlights & Trust Badges */}
          <div className="lg:col-span-5 h-full flex flex-col">
            <div className="bg-brand-cream/80 border border-brand-border/80 p-5 sm:p-8 rounded-3xl h-full flex-1 flex flex-col justify-between shadow-xs relative overflow-hidden">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink/10 text-pink-safe text-xs font-semibold mb-3 sm:mb-5 w-fit">
                  <Calendar className="w-3.5 h-3.5 text-pink-safe" />
                  <span>{t.bookingBadge}</span>
                </div>
                <h2 className="font-heading font-bold text-xl xs:text-2xl sm:text-3xl text-brand-ink mb-3 sm:mb-4">
                  <span className="sm:hidden">
                    {lang === "en"
                      ? "Book an Appointment"
                      : lang === "ta"
                      ? "முன்பதிவு செய்க"
                      : t.bookingTitle}
                  </span>
                  <span className="hidden sm:inline">{t.bookingTitle}</span>
                </h2>
                <p className="text-brand-muted text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6">{t.bookingDesc}</p>
                <div className="space-y-3">
                  {[t.bookingBullet1, t.bookingBullet2, t.bookingBullet3].map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-brand-ink">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center gap-2 text-xs text-brand-muted">
                <Heart className="w-4 h-4 text-teal shrink-0" />
                <span>Murugan Physio Clinic Standard Protocol</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3-Step Wizard Form with Identical Matching Height */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="bg-white p-5 sm:p-8 rounded-3xl border border-brand-border shadow-sm relative h-full flex-1 flex flex-col justify-between">

              {success ? (
                <div className="text-center py-10 flex-1 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-teal-tint text-teal flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-brand-ink mb-2">{t.bookingSuccessTitle}</h3>
                  <p className="text-brand-muted text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">{t.bookingSuccessDesc}</p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setCurrentStep(1);
                    }}
                    className="bg-teal text-white hover:bg-teal-dark px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                  >
                    {t.bookingSuccessBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="h-full flex-1 flex flex-col justify-between space-y-4">
                  {/* Honeypot anti-spam */}
                  <div className="absolute left-[-9999px] top-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
                    <label>Website<input type="text" tabIndex={-1} autoComplete="off" {...register("website")} /></label>
                  </div>

                  {/* Top section: Header + Stepper + Form Fields */}
                  <div className="space-y-4">
                    {errorMsg && (
                      <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl">{errorMsg}</div>
                    )}

                    {/* Step Stepper Header (3 steps) */}
                    <div className="pb-3 border-b border-brand-border/60">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold bg-teal text-white shadow-xs">
                            {currentStep}
                          </span>
                          <h3 className="font-heading font-bold text-sm text-brand-ink">
                            {currentStep === 1
                              ? st.step1Title
                              : currentStep === 2
                              ? st.step2Title
                              : st.step3Title}
                          </h3>
                        </div>
                        <span className="text-[11px] font-bold text-teal bg-teal-tint px-2.5 py-0.5 rounded-full border border-teal/20">
                          {currentStep === 1
                            ? st.step1Badge
                            : currentStep === 2
                            ? st.step2Badge
                            : st.step3Badge}
                        </span>
                      </div>

                      {/* 3-Step Progress Indicators */}
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              step === currentStep
                                ? "w-8 bg-teal"
                                : step < currentStep
                                ? "w-4 bg-teal/60"
                                : "w-4 bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {/* ─────────────────────────────────────────────────────────────
                          STAGE 1: Patient Information (3 fields <= 4 max)
                      ───────────────────────────────────────────────────────────── */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-3.5 pt-1"
                        >
                          {/* Field 1: Patient Full Name */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink mb-1.5">
                              {t.bookingFormName} <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-3 w-4 h-4 text-brand-muted/70" />
                              <input
                                type="text"
                                placeholder="e.g. Ramesh Kumar"
                                {...register("name")}
                                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-brand-ink transition-all bg-white
                                  ${errors.name ? "border-rose-400 focus:border-rose-500 ring-1 ring-rose-200" : "border-brand-border focus:border-teal focus:ring-2 focus:ring-teal/10"}
                                `}
                              />
                            </div>
                            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
                          </div>

                          {/* Field 2: Phone Number */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink mb-1.5">
                              {t.bookingFormPhone} <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-brand-muted/70" />
                              <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                {...register("phone")}
                                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-brand-ink transition-all bg-white
                                  ${errors.phone ? "border-rose-400 focus:border-rose-500 ring-1 ring-rose-200" : "border-brand-border focus:border-teal focus:ring-2 focus:ring-teal/10"}
                                `}
                              />
                            </div>
                            {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>}
                          </div>

                          {/* Field 3: Email Address */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink mb-1.5">
                              {t.bookingFormEmail} <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-brand-muted/70" />
                              <input
                                type="email"
                                placeholder="email@example.com"
                                {...register("email")}
                                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-brand-ink transition-all bg-white
                                  ${errors.email ? "border-rose-400 focus:border-rose-500 ring-1 ring-rose-200" : "border-brand-border focus:border-teal focus:ring-2 focus:ring-teal/10"}
                                `}
                              />
                            </div>
                            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
                          </div>
                        </motion.div>
                      )}

                      {/* ─────────────────────────────────────────────────────────────
                          STAGE 2: Doctor, Visit Reason & Date (3 fields <= 4 max)
                      ───────────────────────────────────────────────────────────── */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-3 pt-1"
                        >
                          {/* Mini Patient Summary Badge */}
                          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-teal-tint/70 border border-teal/20 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                                {watchedName ? watchedName.charAt(0).toUpperCase() : "P"}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-brand-ink truncate block text-xs">{watchedName}</span>
                                <span className="text-[10px] text-brand-muted truncate block">{watchedPhone} • {watchedEmail}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCurrentStep(1)}
                              className="text-[11px] font-bold text-teal hover:text-teal-dark bg-white px-2.5 py-1 rounded-lg border border-teal/20 shadow-2xs hover:bg-slate-50 transition-colors shrink-0 ml-2 cursor-pointer"
                            >
                              {st.editBtn}
                            </button>
                          </div>

                          {/* Field 1: Doctor */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink mb-1.5">
                              {t.bookingFormDoctor} <span className="text-rose-500">*</span>
                            </label>
                            <CustomDropdown
                              options={doctorOptions}
                              value={selectedDoctor || ""}
                              onChange={(v) => setValue("doctor", v, { shouldValidate: true })}
                              placeholder={t.bookingFormDoctorPlaceholder}
                              icon={User}
                              error={errors.doctor?.message}
                            />
                          </div>

                          {/* Field 2 & 3: Visit Reason & Date */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink mb-1.5">
                                {t.bookingFormVisitReason} <span className="text-rose-500">*</span>
                              </label>
                              <CustomDropdown
                                options={visitReasonOptions}
                                value={selectedReason || ""}
                                onChange={(v) => setValue("visitReason", v, { shouldValidate: true })}
                                placeholder={t.bookingFormVisitReasonPlaceholder}
                                icon={Stethoscope}
                                error={errors.visitReason?.message}
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink mb-1.5">
                                {t.bookingFormDate} <span className="text-rose-500">*</span>
                              </label>
                              <CustomDatePicker
                                value={selectedDate || ""}
                                onChange={(v) => setValue("date", v, { shouldValidate: true })}
                                min={today}
                                error={errors.date?.message}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ─────────────────────────────────────────────────────────────
                          STAGE 3: Time Slot & Confirmation
                      ───────────────────────────────────────────────────────────── */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step-3"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-3 pt-1"
                        >
                          {/* Overview Chip of Patient & Doctor/Date */}
                          <div className="p-2.5 rounded-2xl bg-teal-tint/60 border border-teal/20 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-bold text-brand-ink truncate">{watchedName}</span>
                                <span className="text-[10px] text-brand-muted truncate">({watchedPhone})</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="text-[10px] font-bold text-teal bg-white px-2 py-0.5 rounded-md border border-teal/20 hover:bg-slate-50 cursor-pointer shrink-0"
                              >
                                {st.editBtn}
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-teal/15">
                              <div className="truncate">
                                <span className="font-semibold text-teal-dark">{selectedDoctorObj?.name || "Doctor"}</span>
                                <span className="text-brand-muted"> • {selectedDate}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="text-[10px] font-bold text-teal bg-white px-2 py-0.5 rounded-md border border-teal/20 hover:bg-slate-50 cursor-pointer shrink-0"
                              >
                                {st.editBtn}
                              </button>
                            </div>
                          </div>

                          {/* Time Slot Picker */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink mb-1.5">
                              {t.bookingFormTime} <span className="text-rose-500">*</span>
                            </label>
                            <SlotPicker
                              slots={slots}
                              allSlots={TIME_SLOTS}
                              slotsReady={slotsReady}
                              slotsLoading={slotsLoading}
                              value={selectedTime || ""}
                              onChange={(v) => setValue("time", v, { shouldValidate: true })}
                              error={errors.time?.message}
                              noticeText={st.doctorAndDateNotice}
                            />
                            {noSlotsFree && (
                              <p className="text-xs text-amber-600 mt-1">
                                No slots left for this doctor on this date. Please pick another date.
                              </p>
                            )}
                          </div>

                          {/* Collapsible Symptoms & Notes */}
                          <div className="pt-0.5">
                            <button
                              type="button"
                              onClick={() => setShowOptional(!showOptional)}
                              className="text-xs font-semibold text-teal hover:text-teal-dark flex items-center gap-1.5 transition-colors cursor-pointer py-0.5"
                            >
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showOptional ? "rotate-180" : ""}`} />
                              <span>{st.optionalToggle}</span>
                            </button>

                            {showOptional && (
                              <div className="mt-2 space-y-2 pt-2 border-t border-brand-border/60">
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-ink mb-1">
                                    {t.bookingFormSymptoms}
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Lower back pain, neck stiffness"
                                    {...register("symptoms")}
                                    className="w-full px-3 py-2 rounded-xl border border-brand-border focus:border-teal focus:outline-none text-xs text-brand-ink bg-slate-50/20"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-ink mb-1">
                                    {t.bookingFormNotes}
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder="Any notes or specific requests for the doctor..."
                                    {...register("additionalNotes")}
                                    className="w-full px-3 py-2 rounded-xl border border-brand-border focus:border-teal focus:outline-none text-xs text-brand-ink bg-slate-50/20"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom section: Navigation Action Buttons (Always pinned to bottom) */}
                  <div className="pt-3 border-t border-brand-border/40 mt-auto">
                    {currentStep === 1 && (
                      <div>
                        <button
                          type="button"
                          onClick={handleToStep2}
                          className="w-full bg-teal text-white hover:bg-teal-dark py-3 px-5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                        >
                          <span>{st.toStep2Btn}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <p className="text-[11px] text-brand-muted/70 text-center mt-2 flex items-center justify-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal shrink-0" />
                          <span>{st.trustBadge}</span>
                        </p>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="px-4 py-3 rounded-xl border border-brand-border text-brand-ink hover:bg-slate-50 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>{st.backBtn}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleToStep3}
                          className="flex-1 bg-teal text-white hover:bg-teal-dark py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                        >
                          <span>{st.toStep3Btn}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="px-4 py-3 rounded-xl border border-brand-border text-brand-ink hover:bg-slate-50 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>{st.backBtn}</span>
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-teal text-white hover:bg-teal-dark py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>{t.bookingFormSubmitting}</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>{t.bookingFormSubmit}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
