import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Patient from "@/models/Patient";
import { sendEmail } from "@/lib/email";
import { renderEmail, esc, nl2br } from "@/lib/emailTemplate";
import { requireAdmin } from "@/lib/api/auth";
import { handleApiError, NotFound } from "@/lib/api/errors";
import { assertValidObjectId, parseBody } from "@/lib/api/validation";
import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();

    const { id } = await params;
    assertValidObjectId(id, "patient id");

    await connectToDatabase();
    
    const body = await req.json();
    const { subject, message } = parseBody(emailSchema, body);

    const patient = await Patient.findById(id);
    if (!patient) throw NotFound("Patient not found");

    if (!patient.email || !EMAIL_RE.test(patient.email)) {
      return NextResponse.json(
        { error: "This patient does not have a valid email address." },
        { status: 400 }
      );
    }

    const adminName = (session.user as any).name || (session.user as any).email || "Admin";

    const html = renderEmail({
      title: "Message from Sugam Physiotherapy Clinic",
      previewText: subject,
      bodyHtml: `
        <p style="margin:0 0 12px;">Dear ${esc(patient.name)},</p>
        <div>${nl2br(message)}</div>
        <p style="margin:16px 0 0;">Warm regards,<br/><strong>${esc(adminName)}</strong><br/>Sugam Physiotherapy Clinic</p>
      `,
    });

    const result = await sendEmail({
      to: patient.email,
      subject: subject,
      html,
    });

    if (!result || result.success === false) {
      return NextResponse.json(
        { error: "Failed to send the email." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "POST /api/patients/[id]/email");
  }
}
