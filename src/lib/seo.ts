// Centralized SEO constants + Schema.org JSON-LD builders.
// Schemas are emitted server-side (in the initial HTML) so search engines and
// AI crawlers read them without executing JS. All builders return plain objects
// that get serialized by the <JsonLd> component.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const SITE_NAME = "Murugan Physiotherapy Clinic";

export const SITE_DESCRIPTION =
  "Murugan Physiotherapy Clinic in Kilkodungalur, Tamil Nadu — expert orthopaedic physiotherapy, stroke & paralysis rehabilitation, neck & back pain treatment, facial palsy care, and dedicated home visits under Dr. G. Murugan (B.P.T., M.P.T. Ortho).";

export const DEFAULT_OG_IMAGE = "/logo.jpg";

// Real clinic location — used in PostalAddress schema + as the default address
// when the DB settings record is sparse. Drives local "near me" / city ranking.
export const CLINIC_LOCATION = {
  locality: "Kilkodungalur",
  region: "Tamil Nadu",
  postalCode: "604403",
  country: "IN",
  areaServed: [
    "Kilkodungalur",
    "Mangalam Mamandur",
    "Vandavasi",
    "Melmaruvathur",
    "Tiruvannamalai District",
  ],
};

// Master keyword groups.
export const KEYWORDS = {
  brandLocal: [
    "Murugan Physiotherapy Clinic Kilkodungalur",
    "physiotherapist in Kilkodungalur",
    "physiotherapy clinic Vandavasi",
    "best physiotherapist Vandavasi",
    "Dr G Murugan physiotherapist",
    "orthopaedic physiotherapist Kilkodungalur",
    "home visit physiotherapy Vandavasi",
    "physiotherapy near Sendamizh Matriculation school",
    "Murugan Physio Clinic Mamandur",
  ],
  services: [
    "neck pain physiotherapy Kilkodungalur",
    "cervical spondylosis treatment",
    "back pain treatment Vandavasi",
    "sciatica relief physiotherapy",
    "frozen shoulder physiotherapy",
    "knee pain arthritis therapy",
    "stroke paralysis rehabilitation",
    "facial palsy bells palsy physiotherapy",
    "heel pain plantar fasciitis treatment",
    "post fracture stiffness rehabilitation",
    "home visit physiotherapy care",
  ],
  blog: [
    "physiotherapy exercises for back pain",
    "how to relieve neck pain at home",
    "stroke rehabilitation physiotherapy tips",
    "exercises for frozen shoulder",
    "posture correction exercises",
    "knee pain relief exercises",
    "facial palsy recovery physiotherapy",
    "post surgery and fracture rehabilitation",
  ],
  gallery: [
    "Murugan Physiotherapy Clinic Kilkodungalur",
    "physiotherapy clinic photos Vandavasi",
    "Dr G Murugan clinic photos",
    "physio treatment room Kilkodungalur",
    "clinic consultation Kilkodungalur",
  ],
};

// Absolute URL helper — Schema.org wants fully-qualified URLs.
export const abs = (path = "/") =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

type Settings = Record<string, any> | null | undefined;

/** Organization node — identity shared across the site (referenced by @id). */
export function organizationSchema(settings: Settings) {
  const sameAs = [
    settings?.facebook,
    settings?.instagram,
    settings?.youtube,
    settings?.linkedin,
  ].filter(Boolean);

  return {
    "@type": ["Organization", "MedicalOrganization"],
    "@id": `${SITE_URL}/#organization`,
    name: settings?.clinicName || SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: abs(settings?.logo || DEFAULT_OG_IMAGE),
    },
    image: abs(settings?.heroImage || DEFAULT_OG_IMAGE),
    description: settings?.tagline || SITE_DESCRIPTION,
    ...(settings?.email && { email: settings.email }),
    ...(settings?.phone && { telephone: settings.phone }),
    ...(sameAs.length && { sameAs }),
  };
}

/**
 * MedicalClinic node — the primary LocalBusiness entity. Combines MedicalClinic
 * + LocalBusiness so it surfaces in Google local/maps results AND medical rich
 * results.
 */
export function medicalClinicSchema(
  settings: Settings,
  reviews?: Array<{ rating?: number }>
) {
  // Only emit AggregateRating from real Review documents — a hardcoded rating
  // would be a fabricated claim in indexed structured data.
  const ratings = (reviews || []).map((r) => r?.rating).filter((r): r is number => typeof r === "number");
  const avgRating =
    ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : null;

  return {
    "@type": ["MedicalClinic", "LocalBusiness"],
    "@id": `${SITE_URL}/#clinic`,
    name: settings?.clinicName || SITE_NAME,
    url: SITE_URL,
    description: settings?.tagline || SITE_DESCRIPTION,
    image: abs(settings?.heroImage || DEFAULT_OG_IMAGE),
    logo: abs(settings?.logo || DEFAULT_OG_IMAGE),
    ...(settings?.phone && { telephone: settings.phone }),
    ...(settings?.email && { email: settings.email }),
    priceRange: "₹₹",
    medicalSpecialty: ["Physiotherapy", "Orthopedic"],
    areaServed: CLINIC_LOCATION.areaServed.map((name) => ({
      "@type": "Place",
      name,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.address || CLINIC_LOCATION.locality,
      addressLocality: CLINIC_LOCATION.locality,
      addressRegion: CLINIC_LOCATION.region,
      ...(CLINIC_LOCATION.postalCode && { postalCode: CLINIC_LOCATION.postalCode }),
      addressCountry: CLINIC_LOCATION.country,
    },
    ...(settings?.workingHours && {
      openingHours: settings.workingHours,
    }),
    ...(avgRating !== null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: String(ratings.length),
        bestRating: "5",
      },
    }),
    availableService: [
      { "@type": "MedicalProcedure", name: "Neck Pain & Cervical Care" },
      { "@type": "MedicalProcedure", name: "Back Pain & Sciatica Relief" },
      { "@type": "MedicalProcedure", name: "Shoulder Pain & Frozen Shoulder" },
      { "@type": "MedicalProcedure", name: "Knee Pain & Arthritis Care" },
      { "@type": "MedicalProcedure", name: "Muscle Spasm & Strain Treatment" },
      { "@type": "MedicalProcedure", name: "Sprain & Ligament Injury Care" },
      { "@type": "MedicalProcedure", name: "Stroke & Paralysis Rehabilitation" },
      { "@type": "MedicalProcedure", name: "Facial Palsy Care" },
      { "@type": "MedicalProcedure", name: "Heel Pain & Plantar Fasciitis" },
      { "@type": "MedicalProcedure", name: "Post-Fracture Rehabilitation" },
      { "@type": "MedicalProcedure", name: "Home Visit Physiotherapy Treatment" },
    ],
  };
}

/**
 * Physician nodes from the clinic's real doctor records. Satisfies the
 * "Person schema target" keywords (e.g. brand-doctor searches) using live DB
 * names rather than hardcoded ones, and links each doctor to the clinic.
 */
export function physicianSchemas(
  doctors: Array<{
    name?: string;
    specialization?: string;
    qualification?: string;
    description?: string;
    photo?: string;
    phone?: string;
  }>
) {
  return (doctors || [])
    .filter((d) => d?.name)
    .map((d) => ({
      "@type": "Physician",
      name: d.name,
      ...(d.specialization && { medicalSpecialty: d.specialization }),
      ...(d.qualification && { hasCredential: d.qualification }),
      ...(d.description && { description: d.description }),
      ...(d.photo && { image: abs(d.photo) }),
      ...(d.phone && { telephone: d.phone }),
      worksFor: { "@id": `${SITE_URL}/#clinic`, name: SITE_NAME },
      address: {
        "@type": "PostalAddress",
        addressLocality: CLINIC_LOCATION.locality,
        addressRegion: CLINIC_LOCATION.region,
        addressCountry: CLINIC_LOCATION.country,
      },
    }));
}

/** WebSite node with a SearchAction so engines can show a sitelinks searchbox. */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** FAQPage built from clinic FAQ documents. */
export function faqSchema(faqs: Array<{ question?: string; answer?: string }>) {
  const entities = (faqs || [])
    .filter((f) => f?.question && f?.answer)
    .map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    }));

  if (!entities.length) return null;

  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: entities,
  };
}

/** BreadcrumbList for a sub-page. `items` = [{name, path}] ordered root→current. */
export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/** ItemList of services (used on /services). */
export function serviceListSchema(
  services: Array<{ title?: string; description?: string }>
) {
  const elements = (services || [])
    .filter((s) => s?.title)
    .map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalProcedure",
        name: s.title,
        ...(s.description && { description: s.description }),
      },
    }));

  if (!elements.length) return null;

  return {
    "@type": "ItemList",
    name: "Medical Services",
    itemListElement: elements,
  };
}

/** Blog + posts schema (used on /blogs). */
export function blogListSchema(
  posts: Array<{
    title?: string;
    content?: string;
    author?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
  }>
) {
  const blogPosts = (posts || [])
    .filter((p) => p?.title)
    .map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      ...(p.content && {
        description: String(p.content).replace(/<[^>]+>/g, "").slice(0, 200),
      }),
      ...(p.author && { author: { "@type": "Person", name: p.author } }),
      ...(p.image && { image: abs(p.image) }),
      ...(p.createdAt && { datePublished: p.createdAt }),
      ...(p.updatedAt && { dateModified: p.updatedAt }),
      publisher: { "@id": `${SITE_URL}/#organization` },
    }));

  return {
    "@type": "Blog",
    "@id": `${SITE_URL}/blogs#blog`,
    name: `${SITE_NAME} — Health Blog`,
    url: abs("/blogs"),
    ...(blogPosts.length && { blogPost: blogPosts }),
  };
}

/** Wrap nodes in a single @graph document. */
export function graph(...nodes: Array<object | null | undefined>) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
