import { connectDB } from "../config/db";
import { User } from "../models/User";
import { Department } from "../models/Department";
import { Doctor } from "../models/Doctor";
import { Testimonial } from "../models/Testimonial";
import { InsurancePartner, Accreditation, Award } from "../models/Misc";
import { UserRole, Gender } from "../types/enums";
import mongoose from "mongoose";

const departmentSeed = [
  {
    name: "Cardiology",
    slug: "cardiology",
    shortDescription:
      "Comprehensive heart care spanning preventive cardiology to advanced interventional and surgical procedures.",
    overview:
      "The Cardiology unit at Devaki Speciality Hospital brings together interventional cardiologists, cardiac surgeons, and a dedicated cath lab team to diagnose and treat conditions ranging from hypertension to complex coronary artery disease. Our care pathway is built around early detection, minimally invasive intervention where possible, and structured rehabilitation.",
    treatments: [
      "Angioplasty & Stenting",
      "Bypass Surgery (CABG)",
      "Pacemaker Implantation",
      "Electrophysiology Studies",
      "Heart Failure Management",
      "Preventive Cardiology Screening",
    ],
    facilities: ["24/7 Cath Lab", "Cardiac ICU", "Non-Invasive Cardiology Lab", "Cardiac Rehabilitation Centre"],
    technology: ["Biplane Cath Lab", "3D Echocardiography", "TMT & Holter Monitoring", "Coronary CT Angiography"],
    faqs: [
      {
        question: "How soon can I get an appointment with a cardiologist?",
        answer:
          "Most patients are seen within 24-48 hours; emergency chest pain cases are triaged immediately through our Emergency department.",
      },
      {
        question: "Do you offer painless angioplasty?",
        answer:
          "Yes, our cath lab uses radial-access techniques that significantly reduce discomfort and recovery time for most patients.",
      },
    ],
    contactPhone: "+91-44-6000-2101",
    contactEmail: "cardiology@devakihospital.com",
    order: 1,
  },
  {
    name: "Neurology",
    slug: "neurology",
    shortDescription:
      "Advanced diagnosis and management of brain, spine, and nervous system disorders by a multidisciplinary neuro team.",
    overview:
      "Our Neurology department manages the full spectrum of neurological conditions, from stroke and epilepsy to movement disorders and neuromuscular disease, supported by a dedicated stroke unit and neuro-rehabilitation program.",
    treatments: ["Stroke Management", "Epilepsy Care", "Movement Disorder Treatment", "Neuro-rehabilitation"],
    facilities: ["Stroke Unit", "EEG & EMG Lab", "Neuro ICU"],
    technology: ["3T MRI Neuro Imaging", "Digital EEG", "Nerve Conduction Studies"],
    faqs: [
      {
        question: "What should I do if I notice sudden stroke symptoms?",
        answer: "Call our emergency line immediately — early treatment within the first hours greatly improves outcomes.",
      },
    ],
    contactPhone: "+91-44-6000-2102",
    contactEmail: "neurology@devakihospital.com",
    order: 2,
  },
  {
    name: "Orthopaedics",
    slug: "orthopaedics",
    shortDescription: "Joint replacement, sports injury, and trauma care delivered with precision surgical technique.",
    overview:
      "The Orthopaedics team specialises in joint replacement, arthroscopic sports medicine, spine care, and trauma reconstruction, supported by a dedicated physiotherapy unit for faster recovery.",
    treatments: ["Total Knee & Hip Replacement", "Arthroscopy", "Spine Surgery", "Fracture Management"],
    facilities: ["Modular Operation Theatres", "Physiotherapy & Rehab Centre"],
    technology: ["Computer-Assisted Navigation Surgery", "C-Arm Imaging"],
    faqs: [],
    contactPhone: "+91-44-6000-2103",
    contactEmail: "orthopaedics@devakihospital.com",
    order: 3,
  },
];

const doctorSeed = [
  {
    name: "Dr. Anjali Krishnan",
    slug: "dr-anjali-krishnan",
    gender: Gender.FEMALE,
    departmentSlug: "cardiology",
    designation: "Senior Consultant Interventional Cardiologist",
    qualifications: ["MBBS", "MD (Internal Medicine)", "DM (Cardiology)"],
    experienceYears: 16,
    languages: ["English", "Tamil", "Hindi"],
    specializations: ["Interventional Cardiology", "Structural Heart Disease"],
    biography:
      "Dr. Anjali Krishnan has led over 4,000 catheterisation procedures and specialises in complex coronary interventions and structural heart disease.",
    featured: true,
  },
  {
    name: "Dr. Rahul Menon",
    slug: "dr-rahul-menon",
    gender: Gender.MALE,
    departmentSlug: "neurology",
    designation: "Consultant Neurologist",
    qualifications: ["MBBS", "MD (Neurology)"],
    experienceYears: 12,
    languages: ["English", "Malayalam", "Tamil"],
    specializations: ["Stroke Medicine", "Epilepsy"],
    biography:
      "Dr. Rahul Menon heads the stroke unit and has been instrumental in reducing door-to-needle time for acute stroke care.",
    featured: true,
  },
  {
    name: "Dr. Priya Sundaram",
    slug: "dr-priya-sundaram",
    gender: Gender.FEMALE,
    departmentSlug: "orthopaedics",
    designation: "Senior Consultant Orthopaedic Surgeon",
    qualifications: ["MBBS", "MS (Orthopaedics)", "Fellowship in Joint Replacement"],
    experienceYears: 14,
    languages: ["English", "Tamil"],
    specializations: ["Joint Replacement", "Sports Medicine"],
    biography:
      "Dr. Priya Sundaram has performed over 2,500 joint replacement surgeries with a strong focus on rapid-recovery protocols.",
    featured: true,
  },
];

async function seed() {
  await connectDB();
  console.log("[seed] Connected. Seeding data...");

  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Doctor.deleteMany({}),
    Testimonial.deleteMany({}),
    InsurancePartner.deleteMany({}),
    Accreditation.deleteMany({}),
    Award.deleteMany({}),
  ]);

  await User.create({
    name: "Devaki Admin",
    email: "admin@devakihospital.com",
    password: "ChangeMe123!",
    role: UserRole.ADMIN,
  });

  const departments = await Department.insertMany(departmentSeed);
  const deptBySlug = new Map(departments.map((d) => [d.slug, d._id]));

  for (const doc of doctorSeed) {
    const { departmentSlug, ...rest } = doc;
    const departmentId = deptBySlug.get(departmentSlug);
    const doctor = await Doctor.create({ ...rest, departments: [departmentId] });
    await Department.findByIdAndUpdate(departmentId, { $push: { doctors: doctor._id } });
  }

  await Testimonial.insertMany([
    {
      patientName: "S. Ramachandran",
      rating: 5,
      message:
        "The cardiac team at Devaki gave my father a second chance at life. The care from admission to recovery was exceptional.",
      featured: true,
    },
    {
      patientName: "Meena Iyer",
      rating: 5,
      message: "Every staff member, from the nurses to the consultants, treated us with warmth and honesty.",
      featured: true,
    },
  ]);

  await InsurancePartner.insertMany([
    { name: "Star Health", logo: "/placeholders/insurance-star.svg", order: 1 },
    { name: "HDFC Ergo", logo: "/placeholders/insurance-hdfc.svg", order: 2 },
    { name: "ICICI Lombard", logo: "/placeholders/insurance-icici.svg", order: 3 },
  ]);

  await Accreditation.insertMany([
    { name: "NABH Accredited", logo: "/placeholders/accreditation-nabh.svg", order: 1 },
    { name: "ISO 9001:2015", logo: "/placeholders/accreditation-iso.svg", order: 2 },
  ]);

  await Award.insertMany([
    { title: "Best Multi-Speciality Hospital", year: 2025, description: "Regional Healthcare Excellence Awards" },
  ]);

  console.log("[seed] Done. Admin login: admin@devakihospital.com / ChangeMe123!");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
