import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";
import Doctor from "@/models/Doctor";
import Service from "@/models/Service";
import Review from "@/models/Review";
import FAQ from "@/models/FAQ";
import BlogPost from "@/models/BlogPost";
import Gallery from "@/models/Gallery";

export async function seedDatabase() {
  await connectToDatabase();

  // 1. Settings Seeding
  let settings = await ClinicSettings.findOne();
  if (!settings) {
    settings = await ClinicSettings.create({
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
      facebook: "",
      instagram: "",
      youtube: "",
      linkedin: "",
      seoTitle: "Murugan Physiotherapy Clinic - Dr. G. Murugan BPT, MPT (Ortho) | Kilkodungalur",
      seoDescription: "Murugan Physiotherapy Clinic in Kilkodungalur offers expert orthopaedic physiotherapy, stroke rehab, paralysis care, neck & back pain treatment, and home visits by Dr. G. Murugan.",
      seoKeywords: "Murugan Physiotherapy Clinic, Dr G Murugan, physiotherapist Kilkodungalur, physiotherapy Vandavasi, home visit physiotherapy, neck pain, back pain, stroke rehab",
    });
  }

  // 2. Doctors Seeding
  const doctorCount = await Doctor.countDocuments();
  if (doctorCount === 0) {
    await Doctor.create([
      {
        name: "Dr. G. Murugan",
        qualification: "B.P.T., M.P.T. (Ortho)",
        specialization: "Consultant Orthopaedic Physiotherapist",
        experience: 8,
        description: "Dr. G. Murugan specializes in Orthopaedic Physiotherapy (B.P.T., M.P.T. Ortho), delivering expert clinical care for neck pain, lumbar spine & back pain, shoulder stiffness, knee arthritis, paralysis / stroke rehabilitation, facial palsy, and post-fracture recovery, along with personalized home visit therapy.",
        consultingTime: "Mon - Sat: 5:30 PM - 8:30 PM (Home Visits by Appointment)",
        phone: "+91 97863 14138",
        availability: "Available Today",
      }
    ]);
  }

  // 3. Services Seeding
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.create([
      {
        title: "Neck Pain & Cervical Care (கழுத்து வலி)",
        description: "Comprehensive therapy for cervical spondylosis, neck muscle spasms, and radiating nerve pain.",
        icon: "Bone",
      },
      {
        title: "Back Pain & Sciatica Relief (முதுகு வலி)",
        description: "Advanced spinal mobilization, disc decompression, and core strengthening for lasting lower back relief.",
        icon: "Shield",
      },
      {
        title: "Shoulder Pain & Frozen Shoulder (தோள்பட்டை வலி)",
        description: "Specialized capsular stretching, mobilization, and exercises to restore complete shoulder range of motion.",
        icon: "Hand",
      },
      {
        title: "Knee Pain & Arthritis Care (மூட்டு வலி)",
        description: "Targeted joint mobility, quadriceps re-education, and pain-relief therapy for knee osteoarthritis.",
        icon: "Activity",
      },
      {
        title: "Muscle Spasm & Strain Treatment (தசை பிடிப்பு)",
        description: "Deep tissue release, electrotherapy, and myofascial relaxation for painful muscle spasms.",
        icon: "Zap",
      },
      {
        title: "Sprain & Ligament Injury Care (சுளுக்கு)",
        description: "Prompt rehabilitative care and functional stabilization for ligament tears and ankle/wrist sprains.",
        icon: "HeartPulse",
      },
      {
        title: "Stroke & Paralysis Rehabilitation (பக்கவாதம்)",
        description: "Neuro-developmental rehabilitation, motor retraining, and gait training for hemiplegia and stroke recovery.",
        icon: "Sparkles",
      },
      {
        title: "Facial Palsy Care (முகவாதம்)",
        description: "Neuromuscular stimulation and targeted facial muscle re-education for Bell's palsy recovery.",
        icon: "Smile",
      },
      {
        title: "Heel Pain & Plantar Fasciitis (குதிகால் வலி)",
        description: "Customized stretching, calcaneal spur relief, and gait balance correction to eliminate heel pain.",
        icon: "PersonStanding",
      },
      {
        title: "Post-Fracture Rehabilitation (எலும்பு முறிவு பாதிப்புகள்)",
        description: "Progressive mobilization and strengthening to eliminate post-fracture joint stiffness and restore limb function.",
        icon: "Dumbbell",
      },
      {
        title: "Home Visit Physiotherapy (வீட்டு சிகிச்சை)",
        description: "Dedicated doorstep physiotherapy care for elderly, post-operative, and bedridden patients in their homes.",
        icon: "Home",
      }
    ]);
  }

  // 4. Testimonials Seeding
  const reviewCount = await Review.countDocuments();
  if (reviewCount === 0) {
    await Review.create([
      {
        name: "S. K. Venkatesan",
        rating: 5,
        reviewText: "Dr. G. Murugan is exceptionally skilled in orthopaedic physiotherapy. My chronic neck pain and shoulder stiffness improved drastically within just a few sessions. Very polite and caring approach.",
        approved: true,
      },
      {
        name: "Anandharaj M.",
        rating: 5,
        reviewText: "Best physiotherapy clinic in the Kilkodungalur / Vandavasi area. The home visit care for my father's stroke rehabilitation was phenomenal. Highly recommended!",
        approved: true,
      },
      {
        name: "Kavitha R.",
        rating: 5,
        reviewText: "I had severe heel pain and knee pain. Dr. Murugan's exercise regimen and therapy provided complete relief. 5-star treatment!",
        approved: true,
      }
    ]);
  }

  // 5. FAQs Seeding
  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    await FAQ.create([
      {
        question: "What are the clinic timings?",
        answer: "The clinic consulting hours are Monday to Saturday, 5:30 PM to 8:30 PM. Sundays are holidays. Home visits are available by appointment.",
      },
      {
        question: "Do you offer home visit physiotherapy treatments?",
        answer: "Yes! As highlighted in our clinic services ('உங்கள் வீட்டிற்கு வந்து இயன்முறை சிகிச்சை அளிக்கப்படும்'), Dr. G. Murugan provides dedicated home visit physiotherapy care for patients who cannot travel.",
      },
      {
        question: "Where is the clinic located?",
        answer: "Murugan Physiotherapy Clinic is located at No. 343, Badhur Road, Opposite to Sendamizh Matriculation School, Mangalam Mamandur, Kilkodungalur - 604 403, Tiruvannamalai District, Tamil Nadu.",
      },
      {
        question: "How do I book an appointment?",
        answer: "You can book directly using the online booking form on our website, click the WhatsApp button for direct booking, or call Dr. G. Murugan at +91 97863 14138.",
      },
      {
        question: "What conditions do you treat?",
        answer: "We treat neck pain, back pain, shoulder pain (frozen shoulder), knee pain, muscle spasms, sprains, paralysis / stroke rehabilitation, facial palsy (Bell's palsy), heel pain, and post-fracture stiffness.",
      }
    ]);
  }

  // 6. Blogs Seeding
  const blogCount = await BlogPost.countDocuments();
  if (blogCount === 0) {
    await BlogPost.create([
      {
        title: "5 Tips to Prevent Back Pain at Your Desk Job",
        content: "Sitting for long hours puts constant strain on your lower back and neck. Keep your screen at eye level, sit with your back fully supported, take a short standing/stretching break every 30-45 minutes, strengthen your core with simple exercises, and avoid slouching forward. If pain persists beyond a few days, a physiotherapy assessment can identify the underlying posture or muscular issue.",
        category: "Back Pain",
        author: "Dr. G. Murugan, M.P.T. (Ortho)",
        tags: ["Back Pain", "Posture", "Ergonomics"],
      },
      {
        title: "Understanding Dry Needling: What to Expect in Your First Session",
        content: "Dry needling uses thin filament needles to release tight muscle trigger points that cause pain and restrict movement. Most patients feel a brief muscle twitch or ache during insertion, followed by reduced tension in the area over the next day or two. It is commonly used alongside manual therapy and exercise for conditions like neck pain, shoulder pain, and sports injuries.",
        category: "Treatments",
        author: "Dr. G. Murugan, M.P.T. (Ortho)",
        tags: ["Dry Needling", "Pain Relief", "Physiotherapy"],
      }
    ]);
  }

  // 7. Gallery Seeding — placeholder captions; upload real clinic photos via the admin Gallery panel.
  const galleryCount = await Gallery.countDocuments({ category: "gallery" });
  if (galleryCount === 0) {
    await Gallery.create([
      {
        imageUrl: "https://ik.imagekit.io/senra6374/waiting-area.jpg",
        category: "gallery",
        caption: "Reception & Waiting Area",
        order: 1,
      },
      {
        imageUrl: "https://ik.imagekit.io/senra6374/treatment-room.jpg",
        category: "gallery",
        caption: "Physiotherapy Treatment Room",
        order: 2,
      },
      {
        imageUrl: "https://ik.imagekit.io/senra6374/exercise-area.jpg",
        category: "gallery",
        caption: "Exercise & Rehabilitation Area",
        order: 3,
      }
    ]);
  }
}
