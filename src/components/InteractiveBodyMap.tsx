"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Zap,
} from "lucide-react";
import { Language } from "@/lib/translations";

export type BodyPartId = "neck" | "shoulder" | "back" | "elbow" | "hip" | "knee" | "ankle";

interface BodyPartData {
  id: BodyPartId;
  name: Partial<Record<Language, string>> & { en: string };
  tagline: Partial<Record<Language, string>> & { en: string };
  pinX: number; // Percentage
  pinY: number; // Percentage
  side?: "left" | "right" | "center";
  symptoms: Partial<Record<Language, string[]>> & { en: string[] };
  conditions: Partial<Record<Language, string[]>> & { en: string[] };
  treatments: Partial<Record<Language, string[]>> & { en: string[] };
  timeline: Partial<Record<Language, string>> & { en: string };
  visitReason: string;
}

const BODY_PARTS: BodyPartData[] = [
  {
    id: "neck",
    name: {
      en: "Neck & Cervical",
      ta: "கழுத்து பகுதி",
      ml: "കഴുത്ത് ഭാഗം",
      kn: "ಕುತ್ತಿಗೆ ಭಾಗ",
      te: "మెడ భాగం",
      hi: "गर्दन और सर्वाइकल",
    },
    tagline: {
      en: "Relief for neck stiffness, nerve pain, and desk posture strains",
      ta: "கழுத்து வலி, நரம்பு அழுத்தம் மற்றும் நாள்பட்ட சோர்வுக்கு உடனடி தீர்வு",
    },
    pinX: 50,
    pinY: 19,
    side: "center",
    visitReason: "Neck Pain / Cervical Pain",
    symptoms: {
      en: [
        "Stiffness when turning head",
        "Shooting pain into arms or fingers",
        "Tension headaches & shoulder tension",
        "Numbness or tingling sensation",
      ],
      ta: [
        "கழுத்தை திருப்பும்போது கடுமையான வலி",
        "தோள்பட்டை மற்றும் கைகளுக்கு பரவும் வலி",
        "தலைவலி மற்றும் நரம்பு கூச்ச உணர்வு",
      ],
    },
    conditions: {
      en: [
        "Cervical Spondylosis",
        "Tech Neck & Postural Strain",
        "Cervical Radiculopathy (Pinched Nerve)",
        "Whiplash & Muscle Spasm",
      ],
      ta: [
        "செர்விகல் ஸ்பான்டைலோசிஸ்",
        "கழுத்து தசை பிடிப்பு",
        "நரம்பு அழுத்தக் கோளாறுகள்",
      ],
    },
    treatments: {
      en: [
        "Targeted Cervical Traction",
        "Manual Joint Mobilization & Decompression",
        "Interferential Therapy (IFT) & TENS",
        "Ergonomic Posture Correction Programs",
      ],
      ta: [
        "செர்விகல் ட்ராக்ஷன் சிகிச்சை",
        "தசை தளர்த்தும் சிறப்பு பிசியோதெரபி",
        "IFT மற்றும் எலக்ட்ரோதெரபி சிகிச்சை",
      ],
    },
    timeline: {
      en: "Noticeable pain reduction within 2–4 clinical sessions",
      ta: "2 முதல் 4 அமர்வுகளிலேயே வலி கணிசமாக குறையும்",
    },
  },
  {
    id: "shoulder",
    name: {
      en: "Shoulder & Rotator Cuff",
      ta: "தோள்பட்டை பகுதி",
      ml: "തോളെല്ല് ഭാഗം",
      kn: "ಭುಜದ ಭಾಗ",
      te: "భుజం భాగം",
      hi: "कंधा और रोटेटर कफ",
    },
    tagline: {
      en: "Restore overhead movement and relieve frozen shoulder stiffness",
      ta: "தோள்பட்டை அசைவு மற்றும் உறைந்த தோள்பட்டைக்கான சிறப்பு சிகிச்சை",
    },
    pinX: 31,
    pinY: 26,
    side: "left",
    visitReason: "Shoulder Pain / Frozen Shoulder",
    symptoms: {
      en: [
        "Inability to lift arm overhead",
        "Sharp pain when reaching behind back",
        "Night pain disturbing deep sleep",
        "Shoulder joint stiffness & weakness",
      ],
      ta: [
        "கையை மேலே தூக்க முடியாத இறுக்கம்",
        "இரவு நேரங்களில் தோள்பட்டையில் கடுமையான வலி",
        "முதுகிற்கு பின்னால் கையை கொண்டு செல்ல இயலாமை",
      ],
    },
    conditions: {
      en: [
        "Frozen Shoulder (Adhesive Capsulitis)",
        "Rotator Cuff Tendonitis / Partial Tears",
        "Shoulder Impingement Syndrome",
        "Calcific Tendinitis & Bursitis",
      ],
      ta: [
        "உறைந்த தோள்பட்டை (Frozen Shoulder)",
        "ரொடேட்டர் கப் தசைநார் அழற்சி",
        "தோள்பட்டை மூட்டு உராய்வு",
      ],
    },
    treatments: {
      en: [
        "Therapeutic Ultrasound & Deep Heat",
        "Passive & Active Range of Motion Mobilization",
        "Scapular Stabilization Exercises",
        "Kinesiology Taping & Muscle Re-education",
      ],
      ta: [
        "அல்ட்ராசவுண்ட் வெப்ப சிகிச்சை",
        "மூட்டு அசைவு மற்றும் நெகிழ்வுத்தன்மை பயிற்சிகள்",
        "தசைநார் பலப்படுத்தும் உடற்பயிற்சிகள்",
      ],
    },
    timeline: {
      en: "Significant mobility gains within 1–3 weeks of therapy",
      ta: "1 முதல் 3 வாரங்களில் முழு அசைவுத்திறன் மீட்டெடுக்கப்படும்",
    },
  },
  {
    id: "back",
    name: {
      en: "Spine & Lower Back",
      ta: "முதுகு & இடுப்பு பகுதி",
      ml: "നട്ടെല്ല് & പുറം ഭാഗം",
      kn: "ಬೆನ್ನು & ಸೊಂಟದ ಭಾಗ",
      te: "వెన్ను & నడుము భాగం",
      hi: "रीढ़ और निचली पीठ",
    },
    tagline: {
      en: "Evidence-based spinal decompression, disc rehab, and core recovery",
      ta: "டிஸ்க் பிரச்னைகள், சியாட்டிகா மற்றும் நாள்பட்ட முதுகு வலிக்கு அறுவை சிகிச்சையற்ற தீர்வு",
    },
    pinX: 50,
    pinY: 41,
    side: "center",
    visitReason: "Back Pain / Spine Pain",
    symptoms: {
      en: [
        "Aching or sharp pain while sitting or standing",
        "Electric shooting pain down legs (Sciatica)",
        "Stiffness after getting up from bed",
        "Difficulty bending forward or lifting loads",
      ],
      ta: [
        "அமரும்போதும் நடக்கும்போதும் இடுப்பில் வலி",
        "கால்களில் பாயும் மின்னல் போன்ற சியாட்டிகா வலி",
        "முதுகை வளைக்க முடியாத இறுக்கம்",
      ],
    },
    conditions: {
      en: [
        "Lumbar Disc Bulge / Herniation",
        "Sciatica Nerve Compression",
        "Lumbar Spondylosis",
        "Postural Muscle Deconditioning & Facet Pain",
      ],
      ta: [
        "டிஸ்க் விலகல் (Disc Prolapse)",
        "சியாட்டிகா நரம்பு வலி (Sciatica)",
        "லும்பார் ஸ்பான்டைலோசிஸ்",
      ],
    },
    treatments: {
      en: [
        "Computerized Lumbar Traction",
        "McKenzie Method Spinal Extension Protocol",
        "Deep Core & Multifidus Strengthening",
        "Advanced Electrotherapy (IFT) & Heat Modalities",
      ],
      ta: [
        "கம்ப்யூட்டரைஸ் தண்டுவட டிராக்ஷன்",
        "மேக்கென்சி சிறப்பு முதுகெலும்பு உடற்பயிற்சி",
        "நவீன எலக்ட்ரோதெரபி & மைய தசை பயிற்சி",
      ],
    },
    timeline: {
      en: "85%+ patients experience major relief in 7–14 days without surgery",
      ta: "85% நோயாளிகள் 7-14 நாட்களில் அறுவை சிகிச்சையின்றி குணமடைகின்றனர்",
    },
  },
  {
    id: "elbow",
    name: {
      en: "Elbow & Wrist",
      ta: "முழங்கை & மணிக்கட்டு",
      ml: "കൈമുട്ട് & മണികണ്ഠം",
      kn: "ಮೊಣಕೈ & ಮಣಿಕಟ್ಟು",
      te: "మోచేయి & మణికట్టు",
      hi: "कोहनी और कलाई",
    },
    tagline: {
      en: "Focused care for repetitive strain, tennis elbow, and typing stiffness",
      ta: "டென்னிஸ் எல்போ, மணிக்கட்டு வலி மற்றும் தசை இறுக்கத்திற்கான விரைவு நிவாரணம்",
    },
    pinX: 20,
    pinY: 44,
    side: "left",
    visitReason: "Elbow & Wrist Pain",
    symptoms: {
      en: [
        "Burning ache on outer or inner elbow",
        "Weak grip strength holding a cup or shaking hands",
        "Wrist numbness or wrist click while typing",
        "Morning stiffness along forearm muscles",
      ],
      ta: [
        "முழங்கையின் வெளிப்புறத்தில் கடுமையான வலி",
        "பொருட்களை பிடிக்க முடியாத பலவீனம்",
        "மணிக்கட்டில் கூச்சம் மற்றும் தசை இறுக்கம்",
      ],
    },
    conditions: {
      en: [
        "Tennis Elbow (Lateral Epicondylitis)",
        "Golfer's Elbow (Medial Epicondylitis)",
        "Carpal Tunnel Syndrome (CTS)",
        "De Quervain’s Tenosynovitis",
      ],
      ta: [
        "டென்னிஸ் எல்போ (Tennis Elbow)",
        "கார்பல் டன்னல் சிண்ட்ரோம்",
        "மணிக்கட்டு தசைநார் அழற்சி",
      ],
    },
    treatments: {
      en: [
        "Ultrasound Phonophoresis Therapy",
        "Eccentric Forearm Strengthening Protocols",
        "Myofascial Soft Tissue Release",
        "Custom Splinting & Ergonomic Guidance",
      ],
      ta: [
        "அல்ட்ராசவுண்ட் சிகிச்சை",
        "முழங்கை தசைநார் மசாஜ் மற்றும் பயிற்சி",
        "சரியான பணிச்சூழல் ஆலோசனை",
      ],
    },
    timeline: {
      en: "Pain reduction & functional grip restored in 10–14 days",
      ta: "10 முதல் 14 நாட்களில் பிடிமான வலிமை முழுமையாக மீளும்",
    },
  },
  {
    id: "hip",
    name: {
      en: "Hip & Pelvis",
      ta: "இடுப்பு மூட்டு பகுதி",
      ml: "ഇടുപ്പ് ഭാഗം",
      kn: "ಸೊಂಟ & ತೊಡೆ ಮೂಳೆ",
      te: "తుంటి భాగం",
      hi: "कूल्हे और पेल्विस",
    },
    tagline: {
      en: "Relieve groin ache, bursitis, and deep gluteal tightness",
      ta: "இடுப்பு மூட்டு தேய்மானம் மற்றும் நடக்கும் போது ஏற்படும் வலிக்கு தீர்வு",
    },
    pinX: 50,
    pinY: 53,
    side: "center",
    visitReason: "Hip Pain",
    symptoms: {
      en: [
        "Pain deep in the groin while walking or climbing stairs",
        "Sharp side hip ache when lying on that side",
        "Stiffness after sitting for prolonged periods",
        "Limping or uneven weight-bearing gait",
      ],
      ta: [
        "படி ஏறும்போதும் நடக்கும்போதும் இடுப்பில் வலி",
        "படுக்கும் போது பக்கவாட்டில் ஏற்படும் குத்தல்",
        "நடையில் தள்ளாட்டம் மற்றும் சமநிலையின்மை",
      ],
    },
    conditions: {
      en: [
        "Hip Osteoarthritis (Joint Degeneration)",
        "Trochanteric Bursitis",
        "Piriformis Syndrome (Deep Buttock Nerve Pain)",
        "Sacroiliac (SI) Joint Dysfunction",
      ],
      ta: [
        "இடுப்பு மூட்டு தேய்மானம் (Hip Arthritis)",
        "பிரிபார்மிஸ் சிண்ட்ரோம்",
        "எஸ்.ஐ மூட்டு வீக்கம் (SI Joint)",
      ],
    },
    treatments: {
      en: [
        "Pelvic Alignment & Joint Mobilization",
        "Gluteal & Abductor Muscle Strengthening",
        "Gait & Biomechanical Re-education",
        "Anti-inflammatory Ultrasound & Heat Therapy",
      ],
      ta: [
        "இடுப்பு எலும்பு சீரமைப்பு சிகிச்சை",
        "தசை பலப்படுத்தும் நவீன இயன்முறை மருத்துவம்",
        "நடை பயிற்சி மற்றும் வீக்க நிவாரணம்",
      ],
    },
    timeline: {
      en: "Smoother, pain-free walking within 2–3 weeks of care",
      ta: "2 முதல் 3 வாரங்களில் வலியற்ற நடை மீளப்பெறப்படும்",
    },
  },
  {
    id: "knee",
    name: {
      en: "Knee Joint",
      ta: "மூட்டு பகுதி (முழங்கால்)",
      ml: "മുട്ട് ഭാഗം",
      kn: "ಮೊಣಕಾಲು ಭಾಗ",
      te: "మోకాలు భాగం",
      hi: "घुटने का जोड़",
    },
    tagline: {
      en: "Non-surgical knee preservation, osteoarthritis care, and sports recovery",
      ta: "மூட்டு தேய்மானம் மற்றும் தசைநார் காயங்களுக்கு அறுவை சிகிச்சையற்ற பராமரிப்பு",
    },
    pinX: 42,
    pinY: 72,
    side: "center",
    visitReason: "Knee Pain / Knee Injury",
    symptoms: {
      en: [
        "Creaking or grinding sensation (Crepitus)",
        "Pain while bending knees or getting up from floor",
        "Morning stiffness lasting 15–30 minutes",
        "Instability or 'giving way' sensation",
      ],
      ta: [
        "முழங்கால் மடிக்கும் போது 'மடக்' சத்தம்",
        "தரையில் இருந்து எழும்போது கடுமையான வலி",
        "காலை நேரங்களில் மூட்டு இறுக்கம்",
      ],
    },
    conditions: {
      en: [
        "Knee Osteoarthritis (Grade 1 to 4)",
        "Ligament Sprains (ACL / MCL / PCL)",
        "Meniscus Cartilage Tears",
        "Patellofemoral Pain Syndrome (Runner's Knee)",
      ],
      ta: [
        "மூட்டு தேய்மானம் (Osteoarthritis)",
        "தசைநார் கிழிவு மற்றும் சுளுக்கு (ACL/MCL)",
        "ஜவ்வு கிழிவு (Meniscus Tear)",
      ],
    },
    treatments: {
      en: [
        "Quadriceps & Hamstrings Targeted Strengthening",
        "Continuous Passive Motion (CPM) & Mobilization",
        "High-Frequency Laser / Ultrasound Modalities",
        "Weight-Transfer Balance & Gait Retraining",
      ],
      ta: [
        "தொடைகளின் தசைகளை பலப்படுத்தும் பயிற்சிகள்",
        "நவீன இயன்முறை சிகிச்சை மற்றும் லேசர் சிகிச்சை",
        "மூட்டு அழுத்தத்தை குறைக்கும் நடை பயிற்சி",
      ],
    },
    timeline: {
      en: "Significant mobility restoration & joint stability in 2–4 weeks",
      ta: "2 முதல் 4 வாரங்களில் தன்னம்பிக்கையுடன் எளிதாக நடக்கலாம்",
    },
  },
  {
    id: "ankle",
    name: {
      en: "Ankle & Foot",
      ta: "கணுக்கால் & பாதம்",
      ml: "കണങ്കാൽ ഭാഗം",
      kn: "ಹಿಮ್ಮಡಿ & ಪಾದ",
      te: "చీలమండ & పాదం",
      hi: "टखना और पैर",
    },
    tagline: {
      en: "Rapid relief for morning heel pain, ankle twists, and flat foot strain",
      ta: "காலை குதிகால் வலி, சுளுக்கு மற்றும் பாதம் எரிச்சலுக்கு உடனடி சிகிச்சை",
    },
    pinX: 43,
    pinY: 90,
    side: "center",
    visitReason: "Ankle & Foot Pain",
    symptoms: {
      en: [
        "Sharp stabbing heel pain during first steps in morning",
        "Swelling and bruising after twisting ankle",
        "Arch ache after long periods of standing",
        "Stiffness in Achilles tendon area",
      ],
      ta: [
        "காலையில் எழுந்தவுடன் முதலடி வைக்கும் போது குதிகால் வலி",
        "கணுக்கால் சுளுக்கு மற்றும் வீக்கம்",
        "நீண்ட நேரம் நிற்கும்போது பாத வலி",
      ],
    },
    conditions: {
      en: [
        "Plantar Fasciitis (Heel Spur Pain)",
        "Ankle Ligament Sprain (Inversion Sprains)",
        "Achilles Tendinopathy / Tendinitis",
        "Flat Feet (Pes Planus) Arch Fatigue",
      ],
      ta: [
        "குதிகால் வாதம் (Plantar Fasciitis)",
        "கணுக்கால் சுளுக்கு (Ankle Sprain)",
        "அகில்லீஸ் தசைநார் வீக்கம்",
      ],
    },
    treatments: {
      en: [
        "Plantar Fascia & Calf Manual Soft Tissue Mobilization",
        "Cryo-compression & Contrast Bath Guidance",
        "Wobble Board Proprioceptive Retraining",
        "Customized Orthotic Arch Support Consultation",
      ],
      ta: [
        "பாத தசை தளர்வு சிகிச்சை",
        "ஐஸ் ஒத்தடம் & சுளுக்கு நிவாரண முறைகள்",
        "சரியான செருப்பு மற்றும் காலணி ஆலோசனை",
      ],
    },
    timeline: {
      en: "Heel tenderness & ankle swelling reduced within 7–10 days",
      ta: "7 முதல் 10 நாட்களில் குதிகால் வலி பெருமளவு குறையும்",
    },
  },
];

interface InteractiveBodyMapProps {
  lang?: Language;
}

export default function InteractiveBodyMap({ lang = "en" }: InteractiveBodyMapProps) {
  const [selectedPartId, setSelectedPartId] = useState<BodyPartId>("back");
  const [hoveredPartId, setHoveredPartId] = useState<BodyPartId | null>(null);

  const activePart = BODY_PARTS.find((p) => p.id === selectedPartId) || BODY_PARTS[2];

  const localizedName = (part: BodyPartData) => part.name[lang] || part.name.en;
  const localizedTagline = (part: BodyPartData) => part.tagline[lang] || part.tagline.en;
  const localizedSymptoms = (part: BodyPartData) => part.symptoms[lang] || part.symptoms.en;
  const localizedConditions = (part: BodyPartData) => part.conditions[lang] || part.conditions.en;
  const localizedTreatments = (part: BodyPartData) => part.treatments[lang] || part.treatments.en;
  const localizedTimeline = (part: BodyPartData) => part.timeline[lang] || part.timeline.en;

  // Reliable smooth navigation to the booking form + prefilling reason
  const handleBookPart = (visitReason: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("prefill-booking-reason", { detail: { reason: visitReason } })
      );
      const bookingEl = document.getElementById("booking");
      if (bookingEl) {
        bookingEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.hash = "#booking";
      }
    }
  };

  const headerBadge =
    lang === "ta" ? "ஊடாடும் உடல் வலி வழிகாட்டி" : "Interactive Symptom & Body Map";
  const headerTitle =
    lang === "ta" ? "எங்கு வலிக்கிறது?" : "Where Does It Hurt?";
  const headerTitleSub =
    lang === "ta"
      ? "சரியான மருத்துவ சிகிச்சையைக் கண்டறியவும்"
      : "Explore Symptoms & Clinical Treatments";
  const headerDesc =
    lang === "ta"
      ? "உங்களுக்கு வலியுள்ள பகுதியை கிளிக் செய்யுங்கள். டாக்டர் முருகன் பிசியோ கிளினிக்கின் சிறப்பு சிகிச்சை முறைகளை அறியலாம்."
      : "Tap or click any joint on the anatomy model to see conditions treated and recovery plans.";

  return (
    <section
      id="bodymap"
      className="py-8 sm:py-16 lg:py-24 bg-gradient-to-b from-white via-brand-blush/25 to-white relative overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-tint/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-blush/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header (Compact on mobile) */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-teal-tint border border-teal/20 text-teal text-[10px] sm:text-xs font-bold tracking-wide uppercase shadow-2xs mb-2 sm:mb-4">
            <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal" />
            <span>{headerBadge}</span>
          </div>

          <h2 className="font-heading font-extrabold text-xl sm:text-3xl lg:text-4xl xl:text-5xl text-brand-ink tracking-tight mb-1 sm:mb-3 leading-tight">
            {headerTitle}{" "}
            <span className="block text-teal text-base sm:text-2xl lg:text-3xl xl:text-4xl mt-0.5 sm:mt-1 font-bold">
              {headerTitleSub}
            </span>
          </h2>

          <p className="text-brand-muted text-[11px] sm:text-sm sm:leading-relaxed max-w-2xl mx-auto line-clamp-2 sm:line-clamp-none">
            {headerDesc}
          </p>

          {/* Quick-select anatomical pills (Horizontal swipe on mobile, wrapped & centered on desktop) */}
          <div className="flex items-center overflow-x-auto no-scrollbar sm:flex-wrap justify-start sm:justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-6 pb-2 sm:pb-0 px-1 sm:px-0 -mx-4 sm:mx-0 px-4 sm:px-0">
            {BODY_PARTS.map((part) => {
              const isSelected = part.id === selectedPartId;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => setSelectedPartId(part.id)}
                  className={`shrink-0 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap
                    ${
                      isSelected
                        ? "bg-teal text-white shadow-md shadow-teal/25 scale-[1.02]"
                        : "bg-white/90 border border-brand-border text-brand-ink hover:border-teal/50 hover:bg-teal-tint/30"
                    }
                  `}
                >
                  <span
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      isSelected ? "bg-white animate-pulse" : "bg-teal/40"
                    }`}
                  />
                  <span>{localizedName(part)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Stage: Body Map (Left) + Detail Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-10 items-center">
          {/* ─────────────────────────────────────────────────────────────
              LEFT: Interactive Human Anatomy Silhouette
              Height is reduced on mobile (h-[280px]), keeping full height on desktop (lg:h-[560px])
          ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div className="relative w-full sm:max-w-[380px] lg:max-w-none h-[280px] xs:h-[310px] sm:h-[440px] lg:h-[560px] bg-gradient-to-b from-white/95 via-slate-50/70 to-teal-tint/20 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-md sm:shadow-lg p-2 sm:p-4 flex flex-col items-center justify-center overflow-hidden">
              {/* Subtle background radar circles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 sm:opacity-40">
                <div className="w-56 sm:w-80 h-56 sm:h-80 rounded-full border border-teal/15" />
                <div className="w-40 sm:w-56 h-40 sm:h-56 rounded-full border border-teal/20" />
                <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full border border-teal/25" />
              </div>

              {/* Anatomy SVG Graphic & Pin Container (Aspect locked so pins precisely track silhouette) */}
              <div className="relative h-full aspect-[1/2] max-h-[250px] xs:max-h-[280px] sm:max-h-[390px] lg:max-h-[480px] flex items-center justify-center mx-auto">
                <svg
                  viewBox="0 0 200 400"
                  className="w-full h-full select-none filter drop-shadow-xs"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle Grid guide */}
                  <line x1="100" y1="20" x2="100" y2="380" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3" />
                  
                  {/* Head */}
                  <circle cx="100" cy="40" r="18" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
                  
                  {/* Neck */}
                  <path d="M94 58 L94 72 L106 72 L106 58 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.8" />
                  
                  {/* Torso & Shoulders */}
                  <path
                    d="M60 84 C72 74, 128 74, 140 84 C148 94, 144 140, 134 190 C126 210, 74 210, 66 190 C56 140, 52 94, 60 84 Z"
                    fill="#F8FAFC"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />

                  {/* Spine line */}
                  <path d="M100 76 L100 190" stroke="#0A1830" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35" />

                  {/* Arms */}
                  <path
                    d="M58 86 C48 100, 36 140, 32 180 C30 196, 26 215, 22 230 C20 238, 26 242, 30 236 C36 220, 42 195, 46 175 C50 145, 62 105, 66 94"
                    fill="#F1F5F9"
                    stroke="#94A3B8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M142 86 C152 100, 164 140, 168 180 C170 196, 174 215, 178 230 C180 238, 174 242, 170 236 C164 220, 158 195, 154 175 C150 145, 138 105, 134 94"
                    fill="#F1F5F9"
                    stroke="#94A3B8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  {/* Pelvis & Hips */}
                  <path
                    d="M70 190 C78 185, 122 185, 130 190 C136 215, 125 235, 100 238 C75 235, 64 215, 70 190 Z"
                    fill="#E2E8F0"
                    stroke="#94A3B8"
                    strokeWidth="1.8"
                  />

                  {/* Legs */}
                  <path
                    d="M74 230 C76 250, 78 280, 80 300 C82 315, 78 350, 82 376 C83 382, 74 386, 70 384 C66 380, 70 350, 72 315 C72 295, 68 265, 68 230"
                    fill="#F8FAFC"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M126 230 C124 250, 122 280, 120 300 C118 315, 122 350, 118 376 C117 382, 126 386, 130 384 C134 380, 130 350, 128 315 C128 295, 132 265, 132 230"
                    fill="#F8FAFC"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />

                  {/* Joint Circles */}
                  <circle cx="100" cy="65" r="4" fill="#CBD5E1" />
                  <circle cx="62" cy="88" r="5" fill="#CBD5E1" />
                  <circle cx="138" cy="88" r="5" fill="#CBD5E1" />
                  <circle cx="100" cy="155" r="5" fill="#CBD5E1" />
                  <circle cx="38" cy="165" r="4" fill="#CBD5E1" />
                  <circle cx="162" cy="165" r="4" fill="#CBD5E1" />
                  <circle cx="82" cy="208" r="5" fill="#CBD5E1" />
                  <circle cx="118" cy="208" r="5" fill="#CBD5E1" />
                  <circle cx="76" cy="298" r="6" fill="#CBD5E1" />
                  <circle cx="124" cy="298" r="6" fill="#CBD5E1" />
                  <circle cx="78" cy="370" r="5" fill="#CBD5E1" />
                  <circle cx="122" cy="370" r="5" fill="#CBD5E1" />
                </svg>

                {/* Hotspot Buttons (Compact on mobile) */}
                {BODY_PARTS.map((part) => {
                  const isSelected = part.id === selectedPartId;
                  const isHovered = part.id === hoveredPartId;

                  return (
                    <div
                      key={part.id}
                      style={{
                        position: "absolute",
                        left: `${part.pinX}%`,
                        top: `${part.pinY}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      className="z-30"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPartId(part.id)}
                        onMouseEnter={() => setHoveredPartId(part.id)}
                        onMouseLeave={() => setHoveredPartId(null)}
                        aria-label={`Select ${localizedName(part)}`}
                        className={`group relative flex items-center justify-center transition-transform duration-200 cursor-pointer ${
                          isSelected ? "scale-110 sm:scale-125" : "hover:scale-110"
                        }`}
                      >
                        {/* Outer Pulsing Halo */}
                        {isSelected && (
                          <span className="absolute -inset-2 sm:-inset-2.5 rounded-full bg-teal/30 animate-ping opacity-75" />
                        )}

                        {/* Middle Accent Ring */}
                        <span
                          className={`w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-xs sm:shadow-md ${
                            isSelected
                              ? "bg-teal text-white ring-2 sm:ring-4 ring-teal/20 shadow-teal/40"
                              : isHovered
                              ? "bg-teal-tint text-teal border border-teal"
                              : "bg-white/95 text-brand-ink border border-slate-300"
                          }`}
                        >
                          <Zap
                            className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-colors ${
                              isSelected ? "fill-white text-white" : "text-teal"
                            }`}
                          />
                        </span>

                        {/* Floating Tooltip Label */}
                        {(isSelected || isHovered) && (
                          <span
                            className={`absolute pointer-events-none whitespace-nowrap text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 rounded-md shadow-md z-40 transition-all ${
                              isSelected
                                ? "bg-brand-ink text-white"
                                : "bg-white text-brand-ink border border-slate-200"
                            } ${
                              part.side === "left"
                                ? "right-full mr-1.5 sm:mr-2"
                                : part.side === "right"
                                ? "left-full ml-1.5 sm:ml-2"
                                : "bottom-full mb-1.5 sm:mb-2"
                            }`}
                          >
                            {localizedName(part)}
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Interactive Legend */}
              <div className="w-full pt-1.5 sm:pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] sm:text-[11px] text-brand-muted">
                <span className="flex items-center gap-1 font-medium truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                  <span>Tap joint pin</span>
                </span>
                <span className="text-teal font-semibold truncate ml-2">
                  {localizedName(activePart)}
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT: Glass Condition & Treatment Detail Card
              Compact padding & layout on mobile (p-4 sm:p-6 lg:p-9)
          ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePart.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white/95 backdrop-blur-xl border border-brand-border/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-9 shadow-md sm:shadow-lg relative overflow-hidden"
              >
                {/* Ambient glow */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-tint/50 rounded-full blur-3xl pointer-events-none" />

                {/* Card Header with Badges */}
                <div className="flex items-center justify-between gap-2 pb-3 sm:pb-5 border-b border-brand-border/60">
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-teal text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide">
                        {activePart.id.toUpperCase()} CARE
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-teal flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Evidence-Based</span>
                      </span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg xs:text-xl sm:text-2xl lg:text-3xl text-brand-ink leading-tight">
                      {localizedName(activePart)}
                    </h3>
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs lg:text-sm text-brand-muted leading-normal sm:leading-relaxed my-2.5 sm:my-4">
                  {localizedTagline(activePart)}
                </p>

                {/* 2-Column Grid: Conditions & Treatments (1-col on mobile, 2-col on sm/md/lg) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 my-2.5 sm:my-5">
                  {/* Conditions Treated */}
                  <div className="bg-slate-50/70 border border-brand-border/70 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <h4 className="font-heading font-bold text-[11px] sm:text-xs uppercase tracking-wider text-brand-ink flex items-center gap-1.5 mb-2 sm:mb-3">
                      <Stethoscope className="w-3.5 h-3.5 text-teal shrink-0" />
                      <span>Conditions We Treat</span>
                    </h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {localizedConditions(activePart).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-brand-ink font-medium leading-tight">
                          <CheckCircle2 className="w-3 h-3 text-teal shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Clinical Treatments */}
                  <div className="bg-teal-tint/40 border border-teal/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <h4 className="font-heading font-bold text-[11px] sm:text-xs uppercase tracking-wider text-teal-dark flex items-center gap-1.5 mb-2 sm:mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-teal shrink-0" />
                      <span>Our Clinical Treatments</span>
                    </h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {localizedTreatments(activePart).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-brand-ink font-medium leading-tight">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Common Symptoms Pill Tag Cloud */}
                <div className="pt-1 sm:pt-2 pb-2.5 sm:pb-4">
                  <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                    Common Symptoms:
                  </span>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {localizedSymptoms(activePart).map((sym, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-brand-border/80 text-brand-muted text-[10px] sm:text-[11px] font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg"
                      >
                        • {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action CTA with Reliable Smooth Scroll to Booking */}
                <div className="pt-3 sm:pt-4 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
                  <div className="text-left w-full sm:w-auto">
                    <span className="block text-[10px] sm:text-[11px] text-brand-muted">
                      Unsure about your exact condition?
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-brand-ink">
                      Get a comprehensive physical diagnosis
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookPart(activePart.visitReason)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-dark text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
                  >
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Book {localizedName(activePart)} Consult</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
