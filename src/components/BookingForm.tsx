"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calendar, Clock, User, Phone, Mail, MessageSquare,
  CheckCircle2, Loader2, Heart, Stethoscope, ClipboardList,
  ChevronDown, ChevronLeft, ChevronRight, Check,
} from "lucide-react";
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



// ─── Custom Slot Grid ────────────────────────────────────────────────
function SlotPicker({ slots, allSlots, slotsReady, slotsLoading, value, onChange, error }: {
  slots: SlotInfo[];
  allSlots: readonly string[];
  slotsReady: boolean;
  slotsLoading: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const displaySlots: SlotInfo[] = slotsReady && slots.length > 0
    ? slots
    : allSlots.map(time => ({ time, available: true, past: false, full: false }));

  if (!slotsReady) {
    return (
      <div className="rounded-xl border border-brand-border/50 bg-slate-50 py-5 px-4 text-center text-xs text-brand-muted/60 font-medium">
        Select doctor &amp; date first to see available slots
      </div>
    );
  }

  if (slotsLoading) {
    return (
      <div className="rounded-xl border border-brand-border/50 bg-slate-50 py-5 px-4 flex items-center justify-center gap-2 text-xs text-brand-muted/60">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking availability…</span>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-0.5">
        {displaySlots.map((s) => {
          const selected = s.time === value;
          const unavailable = slotsReady && !s.available;
          return (
            <button
              key={s.time}
              type="button"
              disabled={unavailable}
              onClick={() => !unavailable && onChange(s.time)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150
                ${selected
                  ? "bg-teal text-white border-teal shadow-md shadow-teal/20"
                  : unavailable
                  ? "bg-slate-50 text-brand-muted/30 border-brand-border/40 cursor-not-allowed line-through"
                  : "bg-white border-brand-border text-brand-ink hover:border-teal hover:bg-teal-tint/40 cursor-pointer"
                }
              `}
            >
              <Clock className={`w-3.5 h-3.5 shrink-0 ${selected ? "text-white" : unavailable ? "text-brand-muted/30" : "text-teal"}`} />
              <span className="truncate">{s.time}</span>
              {slotsReady && s.full && !selected && (
                <span className="ml-auto text-[9px] font-bold text-rose-400 shrink-0">Full</span>
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const t = translations[lang];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
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

  // Progressive disclosure: show optional fields only when all core required fields are filled
  const coreFieldsFilled = Boolean(
    watchedName?.length >= 2 &&
    watchedPhone?.length >= 10 &&
    watchedEmail?.includes("@") &&
    selectedDoctor &&
    selectedDate &&
    selectedReason &&
    selectedTime
  );
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

  const slotsReady = Boolean(selectedDoctor && selectedDate);
  const noSlotsFree = slotsReady && !slotsLoading && slots.length > 0 && slots.every((s) => !s.available);

  const doctorOptions: DropdownOption[] = [
    ...doctors.map((doc) => ({ value: doc._id, label: doc.name, sub: doc.specialization || "" })),
  ];

  const visitReasonOptions: DropdownOption[] = VISIT_REASONS.map((r) => ({ value: r, label: r }));

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
      setSlots([]);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      if (selectedDoctor && selectedDate) loadAvailability(selectedDoctor, selectedDate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="py-14 sm:py-24 bg-gradient-to-tr from-teal-tint/50 via-white to-brand-blush/30 border-b border-brand-border/40 relative overflow-hidden">
      <div className="absolute inset-0 z-0 hidden lg:block pointer-events-none">
        <div className="absolute top-[-50px] left-[-50px] w-48 h-48 rounded-full border border-teal/10" />
        <div className="absolute bottom-[15%] right-[5%] w-8 h-8 rotate-12 border border-pink/15" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-stretch">

          {/* Left Column */}
          <div className="lg:col-span-5 h-full flex flex-col">
            <div className="bg-brand-cream/80 border border-brand-border/80 p-5 sm:p-10 rounded-3xl flex-1 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink/10 text-pink-safe text-xs font-semibold mb-4 sm:mb-6 w-fit">
                  <Calendar className="w-4 h-4 text-pink-safe" />
                  <span>{t.bookingBadge}</span>
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-ink mb-4 sm:mb-6">{t.bookingTitle}</h2>
                <p className="text-brand-muted text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">{t.bookingDesc}</p>
                <div className="space-y-3 sm:space-y-4">
                  {[t.bookingBullet1, t.bookingBullet2, t.bookingBullet3].map((b, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4.5 h-4.5 text-teal shrink-0" />
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

          {/* Right Column: Form */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="bg-white pt-0 px-5 pb-5 sm:p-10 rounded-3xl border border-brand-border shadow-md h-full flex flex-col justify-center flex-1">

              {success ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-teal-tint text-teal flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-brand-ink mb-3">{t.bookingSuccessTitle}</h3>
                  <p className="text-brand-muted text-sm max-w-sm mb-8 leading-relaxed">{t.bookingSuccessDesc}</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-teal text-white hover:bg-teal-dark px-4 sm:px-6 py-2.5 rounded-full font-semibold transition-all shadow-md cursor-pointer"
                  >
                    {t.bookingSuccessBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Honeypot */}
                  <div className="absolute left-[-9999px] top-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
                    <label>Website<input type="text" tabIndex={-1} autoComplete="off" {...register("website")} /></label>
                  </div>

                  {errorMsg && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl">{errorMsg}</div>
                  )}

                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-brand-ink mb-2">{t.bookingFormName}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-brand-muted/70" />
                        <input type="text" placeholder="Name" {...register("name")}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-border focus:border-teal focus:outline-none transition-colors text-sm text-brand-ink" />
                      </div>
                      {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-brand-ink mb-2">{t.bookingFormPhone}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-brand-muted/70" />
                        <input type="tel" placeholder="+91 98765 43210" {...register("phone")}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-border focus:border-teal focus:outline-none transition-colors text-sm text-brand-ink" />
                      </div>
                      {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Email + Doctor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-brand-ink mb-2">{t.bookingFormEmail}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-brand-muted/70" />
                        <input type="email" placeholder="email@example.com" {...register("email")}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-border focus:border-teal focus:outline-none transition-colors text-sm text-brand-ink" />
                      </div>
                      {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Custom Doctor Dropdown */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-brand-ink mb-2">{t.bookingFormDoctor}</label>
                      <CustomDropdown
                        options={doctorOptions}
                        value={selectedDoctor || ""}
                        onChange={(v) => setValue("doctor", v, { shouldValidate: true })}
                        placeholder={t.bookingFormDoctorPlaceholder}
                        icon={User}
                        error={errors.doctor?.message}
                      />
                    </div>
                  </div>

                  {/* Custom Date + Visit Reason */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-brand-ink mb-2">{t.bookingFormDate}</label>
                      <CustomDatePicker
                        value={selectedDate || ""}
                        onChange={(v) => setValue("date", v, { shouldValidate: true })}
                        min={today}
                        error={errors.date?.message}
                      />
                    </div>

                    {/* Custom Visit Reason Dropdown */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-brand-ink mb-2">{t.bookingFormVisitReason}</label>
                      <CustomDropdown
                        options={visitReasonOptions}
                        value={selectedReason || ""}
                        onChange={(v) => setValue("visitReason", v, { shouldValidate: true })}
                        placeholder={t.bookingFormVisitReasonPlaceholder}
                        icon={Stethoscope}
                        error={errors.visitReason?.message}
                      />
                    </div>
                  </div>

                  {/* Custom Slot Picker (full width) */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-brand-ink mb-2">{t.bookingFormTime}</label>
                    <SlotPicker
                      slots={slots}
                      allSlots={TIME_SLOTS}
                      slotsReady={slotsReady}
                      slotsLoading={slotsLoading}
                      value={selectedTime || ""}
                      onChange={(v) => setValue("time", v, { shouldValidate: true })}
                      error={errors.time?.message}
                    />
                    {noSlotsFree && (
                      <p className="text-xs text-amber-600 mt-1">No slots left for this doctor on this date. Please pick another date.</p>
                    )}
                  </div>

                  {/* Reveal hint */}
                  {!coreFieldsFilled && (
                    <p className="hidden sm:block text-xs text-brand-muted/60 text-center italic pt-2 pb-1">
                      Fill the details above to unlock additional options
                    </p>
                  )}

                  {/* Optional fields — revealed after core fields filled */}
                  <div className={`space-y-6 transition-all duration-500 overflow-hidden ${
                    coreFieldsFilled ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}>

                    {/* Symptoms */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-brand-ink mb-2">{t.bookingFormSymptoms}</label>
                      <div className="relative">
                        <ClipboardList className="absolute left-4 top-3.5 w-5 h-5 text-brand-muted/70" />
                        <input type="text" placeholder="..." {...register("symptoms")}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-border focus:border-teal focus:outline-none transition-colors text-sm text-brand-ink" />
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-brand-ink mb-2">{t.bookingFormNotes}</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-brand-muted/70" />
                        <textarea rows={2} placeholder="..." {...register("additionalNotes")}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-border focus:border-teal focus:outline-none transition-colors text-sm text-brand-ink" />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-brand-ink mb-2">{t.bookingFormMessage}</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-brand-muted/70" />
                        <textarea rows={2} placeholder="..." {...register("message")}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-border focus:border-teal focus:outline-none transition-colors text-sm text-brand-ink" />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal text-white hover:bg-teal-dark py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /><span>{t.bookingFormSubmitting}</span></>
                    ) : (
                      <span>{t.bookingFormSubmit}</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
