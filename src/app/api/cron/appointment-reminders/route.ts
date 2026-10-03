import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Appointment from "@/models/Appointment";
import { sendEmail } from "@/lib/email";
import { renderEmail, infoTable, infoRow, esc } from "@/lib/emailTemplate";
import { todayInClinicTZ, addDaysToDateString } from "@/lib/slots";
import { handleApiError, Unauthorized } from "@/lib/api/errors";

// Daily reminder sweep for Confirmed appointments, triggered by Vercel Cron
// (see vercel.json). Sends an upcoming-visit email once when an appointment
// first comes within 10 days of its date, and again once within 2 days —
// each gated by its own `reminderXSentAt` flag so a re-run (retry, missed day,
// manual trigger) never double-sends. Only ever looks at appointments still
// in the future (`date >= today`), so deploying this doesn't retroactively
// email patients about old, already-past confirmed visits.
async function sendWindowReminders(
  windowDays: number,
  field: "reminder10SentAt" | "reminder2SentAt",
  today: string
) {
  const cutoff = addDaysToDateString(today, windowDays);
  const due = await Appointment.find({
    status: "Confirmed",
    date: { $gte: today, $lte: cutoff },
    [field]: null,
  })
    .populate("doctor", "name")
    .lean();

  const results = await Promise.allSettled(
    due.map(async (appt: any) => {
      await sendEmail({
        to: appt.email,
        subject: `Murugan Physio Clinic - Upcoming Appointment Reminder`,
        html: renderEmail({
          title: "Your appointment is coming up",
          previewText: `Reminder: appointment on ${appt.date}`,
          bodyHtml: `
            <p style="margin:0 0 12px;">Dear ${esc(appt.name)},</p>
            <p style="margin:0 0 8px;">This is a friendly reminder about your upcoming physiotherapy appointment.</p>
            ${infoTable(
              infoRow("Doctor", appt.doctor ? appt.doctor.name : "Clinic Doctor") +
              infoRow("Date", appt.date) +
              infoRow("Time", appt.time)
            )}
            <p style="margin:12px 0 0;">If you need to reschedule, please contact the clinic.</p>
          `,
        }),
      });
      await Appointment.updateOne({ _id: appt._id }, { [field]: new Date() });
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - sent;
  if (failed > 0) {
    console.error(`Appointment reminder sweep (${windowDays}d): ${failed} email(s) failed to send.`);
  }
  return { sent, failed };
}

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret && process.env.NODE_ENV === "production") {
      console.warn(
        "[cron/appointment-reminders] CRON_SECRET not set — this endpoint is unauthenticated. " +
          "Set CRON_SECRET in the Vercel environment to lock it down."
      );
    }
    if (cronSecret && req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
      throw Unauthorized();
    }

    await connectToDatabase();
    const today = todayInClinicTZ();

    const [tenDay, twoDay] = await Promise.all([
      sendWindowReminders(10, "reminder10SentAt", today),
      sendWindowReminders(2, "reminder2SentAt", today),
    ]);

    return NextResponse.json({ tenDayReminders: tenDay, twoDayReminders: twoDay });
  } catch (error) {
    return handleApiError(error, "GET /api/cron/appointment-reminders");
  }
}
