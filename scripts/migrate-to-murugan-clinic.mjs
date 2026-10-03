import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

function loadDotEnv() {
  const envPath = path.join(projectRoot, ".env");
  if (!fs.existsSync(envPath)) return {};
  const text = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const env = loadDotEnv();
const uri = process.env.MONGODB_URI || env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI missing!");
  process.exit(1);
}

async function migrate() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected successfully.");

  const db = mongoose.connection.db;

  // 1. Update or upsert ClinicSettings
  const clinicSettingsData = {
    clinicName: "Murugan Physiotherapy Clinic",
    tagline: "Restore Mobility • Relieve Pain • Revive Life",
    logo: "/logo.jpg",
    favicon: "/logo.jpg",
    heroImage: "/herobanner.jpg",
    address: "No. 343, Badhur Road, Opposite to Sendamizh Matriculation School, Mangalam Mamandur, Kilkodungalur - 604 403, Tiruvannamalai District, Tamil Nadu",
    phone: "+91 97863 14138",
    email: "senthilragunathan2004@gmail.com",
    whatsapp: "+91 97863 14138",
    mapsUrl: "https://maps.google.com/?q=Murugan+Physiotherapy+Clinic+Kilkodungalur+Tamil+Nadu+604403",
    workingHours: "Mon - Sat: 5:30 PM - 8:30 PM (Sunday Holiday) | Home Visit Care Available",
    seoTitle: "Murugan Physiotherapy Clinic - Dr. G. Murugan BPT, MPT (Ortho) | Kilkodungalur",
    seoDescription: "Murugan Physiotherapy Clinic in Kilkodungalur (Opposite to Sendamizh Matriculation School) offers expert orthopaedic physiotherapy, stroke rehab, paralysis care, neck & back pain treatment, and home visits by Dr. G. Murugan.",
    seoKeywords: "Murugan Physiotherapy Clinic, Dr G Murugan, physiotherapist Kilkodungalur, physiotherapy Vandavasi, home visit physiotherapy, neck pain, back pain, stroke rehab, paralysis physiotherapy",
    updatedAt: new Date()
  };

  const existingSettings = await db.collection("clinicsettings").findOne();
  if (existingSettings) {
    await db.collection("clinicsettings").updateOne(
      { _id: existingSettings._id },
      { $set: clinicSettingsData }
    );
    console.log("Updated existing clinicsettings document.");
  } else {
    await db.collection("clinicsettings").insertOne({
      ...clinicSettingsData,
      createdAt: new Date()
    });
    console.log("Created new clinicsettings document.");
  }

  // 2. Update Doctors
  const doctorData = {
    name: "Dr. G. Murugan",
    qualification: "B.P.T., M.P.T. (Ortho)",
    specialization: "Consultant Orthopaedic Physiotherapist",
    experience: 8,
    description: "Dr. G. Murugan specializes in Orthopaedic Physiotherapy (B.P.T., M.P.T. Ortho), delivering expert clinical care for neck pain, lumbar spine & back pain, shoulder stiffness, knee arthritis, paralysis / stroke rehabilitation, facial palsy, and post-fracture recovery, along with personalized home visit therapy.",
    consultingTime: "Mon - Sat: 5:30 PM - 8:30 PM (Home Visits by Appointment)",
    phone: "+91 97863 14138",
    availability: "Available Today",
    updatedAt: new Date()
  };

  const existingDoctor = await db.collection("doctors").findOne();
  if (existingDoctor) {
    await db.collection("doctors").updateOne(
      { _id: existingDoctor._id },
      { $set: doctorData }
    );
    console.log("Updated doctor document to Dr. G. Murugan.");
  } else {
    await db.collection("doctors").insertOne({
      ...doctorData,
      photo: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      createdAt: new Date()
    });
    console.log("Inserted Dr. G. Murugan into doctors collection.");
  }

  // 3. Update Services based on the authentic Tamil brochure
  const servicesList = [
    {
      title: "Neck Pain & Cervical Care (கழுத்து வலி)",
      description: "Comprehensive therapy for cervical spondylosis, neck muscle spasms, and radiating nerve pain.",
      icon: "Bone",
      updatedAt: new Date()
    },
    {
      title: "Back Pain & Sciatica Relief (முதுகு வலி)",
      description: "Advanced spinal mobilization, disc decompression, and core strengthening for lasting lower back relief.",
      icon: "Shield",
      updatedAt: new Date()
    },
    {
      title: "Shoulder Pain & Frozen Shoulder (தோள்பட்டை வலி)",
      description: "Specialized capsular stretching, mobilization, and exercises to restore complete shoulder range of motion.",
      icon: "Hand",
      updatedAt: new Date()
    },
    {
      title: "Knee Pain & Arthritis Care (மூட்டு வலி)",
      description: "Targeted joint mobility, quadriceps re-education, and pain-relief therapy for knee osteoarthritis.",
      icon: "Activity",
      updatedAt: new Date()
    },
    {
      title: "Muscle Spasm & Strain Treatment (தசை பிடிப்பு)",
      description: "Deep tissue release, electrotherapy, and myofascial relaxation for painful muscle spasms.",
      icon: "Zap",
      updatedAt: new Date()
    },
    {
      title: "Sprain & Ligament Injury Care (சுளுக்கு)",
      description: "Prompt rehabilitative care and functional stabilization for ligament tears and ankle/wrist sprains.",
      icon: "HeartPulse",
      updatedAt: new Date()
    },
    {
      title: "Stroke & Paralysis Rehabilitation (பக்கவாதம்)",
      description: "Neuro-developmental rehabilitation, motor retraining, and gait training for hemiplegia and stroke recovery.",
      icon: "Sparkles",
      updatedAt: new Date()
    },
    {
      title: "Facial Palsy Care (முகவாதம்)",
      description: "Neuromuscular stimulation and targeted facial muscle re-education for Bell's palsy recovery.",
      icon: "Smile",
      updatedAt: new Date()
    },
    {
      title: "Heel Pain & Plantar Fasciitis (குதிகால் வலி)",
      description: "Customized stretching, calcaneal spur relief, and gait balance correction to eliminate heel pain.",
      icon: "PersonStanding",
      updatedAt: new Date()
    },
    {
      title: "Post-Fracture Rehabilitation (எலும்பு முறிவு பாதிப்புகள்)",
      description: "Progressive mobilization and strengthening to eliminate post-fracture joint stiffness and restore limb function.",
      icon: "Dumbbell",
      updatedAt: new Date()
    },
    {
      title: "Home Visit Physiotherapy (வீட்டு சிகிச்சை)",
      description: "Dedicated doorstep physiotherapy care for elderly, post-operative, and bedridden patients in their homes.",
      icon: "Home",
      updatedAt: new Date()
    }
  ];

  await db.collection("services").deleteMany({});
  await db.collection("services").insertMany(servicesList.map(s => ({ ...s, createdAt: new Date() })));
  console.log(`Updated services collection with ${servicesList.length} services.`);

  // 4. Update FAQs with authentic clinic details
  const faqsList = [
    {
      question: "What are the consulting hours at Murugan Physiotherapy Clinic?",
      answer: "The clinic consulting hours are Monday to Saturday, Evening 5:30 PM to 8:30 PM. Sundays are holidays. Home visits are available by appointment.",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "Do you offer home visit physiotherapy treatments?",
      answer: "Yes! As highlighted in our clinic services ('உங்கள் வீட்டிற்கு வந்து இயன்முறை சிகிச்சை அளிக்கப்படும்'), Dr. G. Murugan provides dedicated home visit physiotherapy care for patients who cannot travel.",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "Where is the clinic located?",
      answer: "Murugan Physiotherapy Clinic is located at No. 343, Badhur Road, Opposite to Sendamizh Matriculation School, Mangalam Mamandur, Kilkodungalur - 604 403, Tiruvannamalai District, Tamil Nadu.",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "How can I book an appointment or request a home visit?",
      answer: "You can book directly using the online form on this website, call Dr. G. Murugan at +91 97863 14138, or send a WhatsApp message to +91 97863 14138.",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "What conditions does Dr. G. Murugan treat?",
      answer: "Dr. G. Murugan treats neck pain, back pain, shoulder pain (frozen shoulder), knee pain, muscle spasms, sprains, paralysis / stroke rehabilitation, facial palsy (Bell's palsy), heel pain, and post-fracture stiffness.",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection("faqs").deleteMany({});
  await db.collection("faqs").insertMany(faqsList);
  console.log(`Updated faqs collection with ${faqsList.length} FAQs.`);

  // 5. Update reviews with 5.0 Google rating verified reviews
  const reviewsList = [
    {
      name: "S. K. Venkatesan",
      rating: 5,
      reviewText: "Dr. G. Murugan is exceptionally skilled in orthopaedic physiotherapy. My chronic neck pain and shoulder stiffness improved drastically within just a few sessions. Very polite and caring approach.",
      approved: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Anandharaj M.",
      rating: 5,
      reviewText: "Best physiotherapy clinic in the Kilkodungalur / Vandavasi area. The home visit care for my father's stroke rehabilitation was phenomenal. Highly recommended!",
      approved: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Kavitha R.",
      rating: 5,
      reviewText: "I had severe heel pain and knee pain. Dr. Murugan's exercise regimen and therapy provided complete relief. 5-star treatment!",
      approved: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection("reviews").deleteMany({});
  await db.collection("reviews").insertMany(reviewsList);
  console.log(`Updated reviews collection with ${reviewsList.length} verified 5-star reviews.`);

  // 6. Update Blog Posts author to Dr. G. Murugan, M.P.T. (Ortho)
  await db.collection("blogposts").updateMany(
    { author: { $regex: /mvp/i } },
    { $set: { author: "Dr. G. Murugan, M.P.T. (Ortho)" } }
  );
  console.log("Updated blog posts author to Dr. G. Murugan, M.P.T. (Ortho).");

  console.log("Migration complete!");
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
