// Single source of truth for the chief-complaint / visit-reason taxonomy and
// the patient-frequency classification. Shared by the booking form, the booking
// validator, the admin patient views and the dashboard so they never drift.

// Canonical visit reasons offered in the booking form. Order matters (rendered
// top-to-bottom). Kept in English clinical terms (standard at the clinic);
// only the surrounding UI labels are translated.
export const VISIT_REASONS = [
  // Pain & Musculoskeletal
  "Back Pain / Spine Pain",
  "Neck Pain / Cervical Pain",
  "Shoulder Pain / Frozen Shoulder",
  "Knee Pain / Knee Injury",
  "Hip Pain",
  "Ankle & Foot Pain",
  "Elbow & Wrist Pain",
  // Conditions & Disorders
  "Sciatica / Radiculopathy",
  "Disc Herniation / Slip Disc",
  "Arthritis / Joint Stiffness",
  "Sports Injury / Muscle Strain",
  "Post-Fracture Rehabilitation",
  "Post-Surgery Rehabilitation",
  "Stroke Rehabilitation",
  "Paralysis / Neurological Condition",
  // Therapy Types
  "Dry Needling",
  "Manual Therapy / Manipulation",
  "Posture Correction",
  "Gait Training / Balance Disorder",
  // General
  "General Assessment / Evaluation",
  "Follow-Up Visit",
  "Other",
] as const;

export type VisitReason = (typeof VISIT_REASONS)[number];

// Patient frequency tier from total visit count. Pure function — no I/O — so it
// is safe to call in both server and client components.
export type PatientTier = {
  label: "New Patient" | "Returning Patient" | "Frequent Patient";
  // Tailwind utility classes for a badge (matches the admin palette).
  badgeClass: string;
};

export function classifyPatient(totalVisits: number): PatientTier {
  if (totalVisits >= 6) {
    return { label: "Frequent Patient", badgeClass: "bg-pink/10 text-pink-safe border-pink/20" };
  }
  if (totalVisits >= 2) {
    return { label: "Returning Patient", badgeClass: "bg-blue-50 text-blue-600 border-blue-200" };
  }
  return { label: "New Patient", badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-200" };
}
