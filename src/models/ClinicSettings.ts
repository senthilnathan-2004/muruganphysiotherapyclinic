import mongoose, { Schema } from "mongoose";

const ClinicSettingsSchema = new Schema(
  {
    clinicName: { type: String, default: "Murugan Physiotherapy Clinic" },
    tagline: { type: String, default: "Restore Mobility • Relieve Pain • Revive Life" },
    logo: { type: String, default: "/logo.jpg" },
    favicon: { type: String, default: "/logo.jpg" },
    heroImage: { type: String, default: "/herobanner.jpg" },
    heroMobileImages: {
      type: [
        {
          imageUrl: { type: String, default: "" },
          caption: { type: String, default: "" },
        },
      ],
      default: [
        {
          imageUrl:
            "https://ik.imagekit.io/senra6374/mvp-physio-clinic/Physiotherapy_image_color_backgr__2K_20261003205215_cSeEtgTQH.jpg",
          caption: "Manual Therapy",
        },
        {
          imageUrl:
            "https://ik.imagekit.io/senra6374/mvp-physio-clinic/Editing_doctor_position_and_back__2K_20261003211001_YY_f3I2I14.jpg",
          caption: "Doctor Consultation",
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
      ],
    },
    address: { type: String, default: "No. 343, Badhur Road, Opposite to Sendamizh Matriculation School, Mangalam Mamandur, Kilkodungalur - 604 403, Tiruvannamalai District, Tamil Nadu" },
    phone: { type: String, default: "+91 97863 14138" },
    email: { type: String, default: "senthilragunathan2004@gmail.com" },
    whatsapp: { type: String, default: "+91 97863 14138" },
    mapsUrl: { type: String, default: "https://maps.google.com/?q=Murugan+Physiotherapy+Clinic+Kilkodungalur+Tamil+Nadu+604403" },
    workingHours: { type: String, default: "Mon - Sat: 5:30 PM - 8:30 PM (Sunday Holiday) | Home Visit Care Available" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    seoTitle: { type: String, default: "Murugan Physiotherapy Clinic - Dr. G. Murugan BPT, MPT (Ortho) | Kilkodungalur" },
    seoDescription: { type: String, default: "Murugan Physiotherapy Clinic in Kilkodungalur offers expert orthopaedic physiotherapy, stroke rehab, paralysis care, neck & back pain treatment, and home visits by Dr. G. Murugan." },
    seoKeywords: { type: String, default: "Murugan Physiotherapy Clinic, Dr G Murugan, physiotherapist Kilkodungalur, physiotherapy Vandavasi, home visit physiotherapy, neck pain, back pain, stroke rehab" },
    ogImage: { type: String, default: "" },

    // About section content. Blank = fall back to the per-language defaults in
    // lib/translations.ts. A non-empty value here overrides ALL languages.
    aboutBadge: { type: String, default: "" },
    aboutTitle: { type: String, default: "" },
    aboutDesc1: { type: String, default: "" },
    aboutDesc2: { type: String, default: "" },
    aboutMission: { type: String, default: "" },
    aboutMissionDesc: { type: String, default: "" },
    aboutVision: { type: String, default: "" },
    aboutVisionDesc: { type: String, default: "" },
    aboutPremium: { type: String, default: "" },
    aboutPremiumDesc: { type: String, default: "" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development" && mongoose.models.ClinicSettings) {
  delete (mongoose.models as any).ClinicSettings;
}

export default mongoose.models.ClinicSettings || mongoose.model("ClinicSettings", ClinicSettingsSchema);
