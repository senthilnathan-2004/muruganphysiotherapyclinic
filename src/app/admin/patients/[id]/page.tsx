"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Phone,
  Mail,
  Cake,
  User,
  CalendarDays,
  Activity,
  Edit2,
  Save,
  X,
  Send,
  Stethoscope,
  Clock,
  Check,
} from "lucide-react";
import { classifyPatient } from "@/lib/visitReasons";
import { useAdminFeedback } from "@/components/AdminFeedback";
import CustomDropdown from "@/components/CustomDropdown";
import CustomDatePicker from "@/components/CustomDatePicker";

type Patient = {
  _id: string;
  patientId: string;
  name: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  totalVisits: number;
  lastVisitDate?: string;
  lastVisitReason?: string;
};

type Appt = {
  _id: string;
  date: string;
  time: string;
  doctor?: { name: string; specialization?: string } | null;
  visitReason?: string;
  status: string;
};

const statusClass = (status: string) =>
  status === "Pending"
    ? "bg-amber-50 text-amber-600 border-amber-200"
    : status === "Confirmed"
    ? "bg-blue-50 text-blue-600 border-blue-200"
    : status === "Completed"
    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
    : "bg-rose-50 text-rose-600 border-rose-200";

export default function PatientDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const { notify } = useAdminFeedback();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailForm, setEmailForm] = useState({ subject: "", message: "" });
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/patients/${id}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.patient) {
          setPatient(data.patient);
          setAppointments(Array.isArray(data.appointments) ? data.appointments : []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleUpdateStatus = async (
    appointmentId: string,
    newStatus: string,
    reason?: "reject" | "not_complete"
  ) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appointmentId, status: newStatus, reason }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setAppointments((prev) => 
        prev.map((appt) => 
          appt._id === appointmentId ? { ...appt, status: newStatus } : appt
        )
      );
      notify("success", `Appointment marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      notify("error", "Failed to update appointment status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
      </div>
    );
  }

  if (notFound || !patient) {
    return (
      <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/patients" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal hover:underline transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </Link>
        <div className="w-px h-4 bg-slate-200"></div>
        <Link href="/admin/appointments" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal hover:underline transition-colors">
          <CalendarDays className="w-4 h-4" /> Back to Appointments
        </Link>
      </div>
        <p className="text-slate-500">Patient not found.</p>
      </div>
    );
  }

  const tier = classifyPatient(patient.totalVisits);
  const latestVisitReason = patient.lastVisitReason || appointments[0]?.visitReason || "—";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/patients" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal hover:underline transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </Link>
        <div className="w-px h-4 bg-slate-200"></div>
        <Link href="/admin/appointments" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal hover:underline transition-colors">
          <CalendarDays className="w-4 h-4" /> Back to Appointments
        </Link>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading font-bold text-3xl text-slate-800">{patient.name}</h1>
          <span className="font-mono text-sm font-bold text-teal bg-teal-tint/50 px-2.5 py-1 rounded-lg">{patient.patientId}</span>
          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${tier.badgeClass}`}>
            {tier.label}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {patient.phone && (
            <a href={`tel:${patient.phone}`} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">
              <Phone className="w-4 h-4" /> Call
            </a>
          )}
          {patient.email && (
            <button onClick={() => setIsEmailModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal-dark text-white font-bold text-sm rounded-xl transition-colors shadow-sm shadow-teal/20">
              <Mail className="w-4 h-4" /> Email
            </button>
          )}
        </div>
      </div>

      {/* Patient Information */}
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-4 sm:p-4 sm:p-6 relative">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-teal" /> Patient Information
          </h2>
          {!isEditing ? (
            <button
              onClick={() => {
                setEditForm({
                  name: patient.name || "",
                  phone: patient.phone || "",
                  email: patient.email || "",
                  dateOfBirth: patient.dateOfBirth || "",
                  gender: patient.gender || "",
                });
                setIsEditing(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal bg-teal-tint/50 rounded-lg hover:bg-teal-tint transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={async () => {
                  setSaving(true);
                  try {
                    const res = await fetch(`/api/patients/${patient._id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(editForm),
                    });
                    if (!res.ok) throw new Error("Failed to update patient");
                    const data = await res.json();
                    setPatient((prev) => prev ? { ...prev, ...data.patient } : prev);
                    notify("success", "Patient details updated successfully");
                    setIsEditing(false);
                  } catch (err) {
                    console.error(err);
                    notify("error", "Failed to update patient details");
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-70"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal/40 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal/40 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal/40 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
              <CustomDatePicker
                value={editForm.dateOfBirth}
                onChange={(v) => setEditForm({ ...editForm, dateOfBirth: v })}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
              <CustomDropdown
                value={editForm.gender}
                onChange={(v) => setEditForm({ ...editForm, gender: v })}
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" }
                ]}
                placeholder="Select gender..."
                icon={User}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <Info label="Patient ID" value={patient.patientId} icon={<User className="w-4 h-4 text-teal" />} />
            <Info label="Phone" value={patient.phone} icon={<Phone className="w-4 h-4 text-teal" />} />
            <Info label="Email" value={patient.email || "—"} icon={<Mail className="w-4 h-4 text-teal" />} />
            <Info label="Date of Birth" value={patient.dateOfBirth || "—"} icon={<Cake className="w-4 h-4 text-teal" />} />
            <Info label="Gender" value={patient.gender || "—"} icon={<User className="w-4 h-4 text-teal" />} />
          </div>
        )}
      </section>

      {/* Visit Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Visits" value={String(patient.totalVisits)} icon={Activity} color="text-blue-600 bg-blue-50" />
        <SummaryCard label="Last Visit Date" value={patient.lastVisitDate || "—"} icon={CalendarDays} color="text-emerald-600 bg-emerald-50" />
        <SummaryCard label="Latest Visit Reason" value={latestVisitReason} icon={Stethoscope} color="text-pink-safe bg-pink/5" />
      </section>

      {/* Appointment History */}
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-4 sm:p-6 border-b border-slate-100">
          <h2 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-teal" /> Appointment History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase">
                <th className="p-3 sm:p-5 font-semibold">Date</th>
                <th className="p-3 sm:p-5 font-semibold">Time</th>
                <th className="p-3 sm:p-5 font-semibold">Doctor</th>
                <th className="p-3 sm:p-5 font-semibold">Visit Reason</th>
                <th className="p-3 sm:p-5 font-semibold">Status</th>
                <th className="p-3 sm:p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400 text-sm">No appointments on record.</td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 sm:p-5 font-semibold text-slate-700">{a.date}</td>
                    <td className="p-3 sm:p-5">
                      <span className="flex items-center gap-1 text-slate-500"><Clock className="w-3.5 h-3.5" /> {a.time}</span>
                    </td>
                    <td className="p-3 sm:p-5 text-slate-700">{a.doctor ? a.doctor.name : "—"}</td>
                    <td className="p-3 sm:p-5">{a.visitReason || "—"}</td>
                    <td className="p-3 sm:p-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusClass(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 sm:p-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {a.status === "Pending" && (
                          <button
                            onClick={() => handleUpdateStatus(a._id, "Confirmed")}
                            className="p-2 bg-teal/10 hover:bg-teal text-teal hover:text-white rounded-lg transition-all border border-teal/20"
                            title="Confirm Appointment"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {a.status === "Confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(a._id, "Completed")}
                            className="p-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-lg transition-all border border-emerald-200"
                            title="Mark Completed"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {a.status === "Pending" && (
                          <button
                            onClick={() => handleUpdateStatus(a._id, "Cancelled", "reject")}
                            className="p-2 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-all border border-rose-200"
                            title="Reject Appointment"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {a.status === "Confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(a._id, "Cancelled", "not_complete")}
                            className="p-2 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-all border border-rose-200"
                            title="Mark Not Complete"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-heading font-bold text-xl text-slate-800 flex items-center gap-2">
                <Mail className="w-5 h-5 text-teal" /> Send Email to {patient.name}
              </h2>
              <button onClick={() => setIsEmailModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 sm:p-6 space-y-4 bg-slate-50/50">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  placeholder="E.g. Your Upcoming Appointment"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  placeholder="Type your message here..."
                  rows={6}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all text-sm resize-none"
                />
              </div>
            </div>
            <div className="p-3 sm:p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                disabled={sendingEmail}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!emailForm.subject.trim() || !emailForm.message.trim()) {
                    notify("error", "Subject and message are required.");
                    return;
                  }
                  setSendingEmail(true);
                  try {
                    const res = await fetch(`/api/patients/${patient._id}/email`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(emailForm),
                    });
                    if (!res.ok) throw new Error("Failed to send email");
                    notify("success", "Email sent successfully!");
                    setIsEmailModalOpen(false);
                    setEmailForm({ subject: "", message: "" });
                  } catch (err) {
                    console.error(err);
                    notify("error", "Failed to send email. Please try again.");
                  } finally {
                    setSendingEmail(false);
                  }
                }}
                disabled={sendingEmail}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-teal hover:bg-teal-dark rounded-xl transition-colors shadow-sm shadow-teal/20 disabled:opacity-70"
              >
                {sendingEmail ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {sendingEmail ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-white p-4 sm:p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-xl ${color} shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="font-heading font-bold text-xl text-slate-800 mt-1 truncate">{value}</p>
      </div>
    </div>
  );
}
