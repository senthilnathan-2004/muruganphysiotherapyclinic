/**
 * Shared, brand-consistent email template (Apple & Amazon Inspired Design).
 *
 * Uses email-safe table layouts, fluid full-width container, responsive inline styles,
 * and an embedded <style> media query for 100% edge-to-edge mobile display.
 */

const CLINIC_NAME = "Murugan Physiotherapy Clinic";
const CLINIC_TAGLINE = "Restore Mobility • Relieve Pain • Revive Life";
const CLINIC_PHONE = process.env.ADMIN_PHONE || "+91 97863 14138";
const CLINIC_EMAIL = process.env.EMAIL_FROM || "senthilragunathan2004@gmail.com";

// Brand Palette (Navy & Mint)
const NAVY_PRIMARY = "#12284C";
const ACCENT_TEAL = "#5FD3B0";
const TEXT_DARK = "#0A1830";
const TEXT_MUTED = "#5C6B82";
const TEXT_LIGHT = "#9AABB8";
const BG_MAIN = "#FFFFFF";
const BORDER_HAIRLINE = "#E8EEF5";

/** HTML-escape untrusted text before embedding in email HTML. */
export const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Escape + preserve line breaks. */
export const nl2br = (s: unknown) => esc(s).replace(/\n/g, "<br/>");

/** Apple / Amazon style key-value row with hairline bottom divider. */
export const infoRow = (label: string, value: unknown) => `
  <tr>
    <td class="info-label" style="padding:10px 0;font-size:13px;color:${TEXT_MUTED};font-weight:500;width:130px;vertical-align:top;border-bottom:1px solid ${BORDER_HAIRLINE};">${esc(label)}</td>
    <td class="info-value" style="padding:10px 0;font-size:13.5px;color:${TEXT_DARK};font-weight:600;vertical-align:top;border-bottom:1px solid ${BORDER_HAIRLINE};">${esc(value)}</td>
  </tr>`;

/** Wrap rows from `infoRow` into a clean detail list (no bulky borders). */
export const infoTable = (rows: string) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;border-collapse:collapse;">${rows}</table>`;

/** Sleek left-bar callout block (frameless, edge-aligned). */
export const quoteBlock = (heading: string, html: string) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;width:100%;">
    <tr>
      <td style="border-left:3px solid ${NAVY_PRIMARY};padding:8px 0 8px 14px;">
        <div style="font-size:11px;font-weight:700;color:${NAVY_PRIMARY};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">${esc(heading)}</div>
        <div class="mobile-text" style="font-size:13.5px;color:${TEXT_DARK};line-height:1.6;">${html}</div>
      </td>
    </tr>
  </table>`;

/** Sleek status pill badge for appointment updates or notifications. */
export const statusBadge = (text: string, type: "info" | "success" | "warning" = "info") => {
  let bg = "#EFF6FF";
  let color = "#1D4ED8";
  if (type === "success") {
    bg = "#ECFDF5";
    color = "#047857";
  } else if (type === "warning") {
    bg = "#FFFBEB";
    color = "#B45309";
  }
  return `<span style="display:inline-block;padding:3px 10px;border-radius:9999px;font-size:12px;font-weight:600;background:${bg};color:${color};">${esc(text)}</span>`;
};

type RenderEmailOpts = {
  title: string; // body heading
  bodyHtml: string; // main content (already escaped where needed)
  previewText?: string; // inbox preview snippet
  footerNote?: string; // optional small print above contact footer
};

export function renderEmail({ title, bodyHtml, previewText, footerNote }: RenderEmailOpts): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${esc(title)}</title>
  <style>
    /* Mobile responsive optimizations (100% full-width, edge-to-edge) */
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 0 !important; width: 100% !important; }
      .email-container { width: 100% !important; max-width: 100% !important; }
      .email-header { padding: 20px 16px 16px !important; }
      .email-body { padding: 20px 16px !important; }
      .email-footer { padding: 20px 16px !important; }
      .mobile-title { font-size: 20px !important; line-height: 1.3 !important; margin-bottom: 12px !important; }
      .mobile-text { font-size: 13.5px !important; line-height: 1.6 !important; }
      .info-label { width: 100px !important; font-size: 12px !important; padding: 8px 0 !important; }
      .info-value { font-size: 13px !important; padding: 8px 0 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${BG_MAIN};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  ${
    previewText
      ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#ffffff;">${esc(previewText)}</div>`
      : ""
  }
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-wrapper" style="background:${BG_MAIN};padding:24px 0;width:100%;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <tr>
      <td align="center" style="padding:0;">
        <!-- 100% Full Width Container (No side gaps, cards, or inset backgrounds) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-container" style="max-width:600px;width:100%;background:${BG_MAIN};text-align:left;border-collapse:collapse;">
          <!-- Top Accent Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg, ${NAVY_PRIMARY} 0%, ${ACCENT_TEAL} 100%);"></td>
          </tr>

          <!-- Full Width Header -->
          <tr>
            <td class="email-header" style="padding:28px 24px 20px;border-bottom:1px solid ${BORDER_HAIRLINE};">
              <div style="font-size:19px;font-weight:700;color:${NAVY_PRIMARY};letter-spacing:-0.02em;">${esc(CLINIC_NAME)}</div>
              <div style="font-size:11px;font-weight:600;color:${TEXT_MUTED};letter-spacing:0.08em;text-transform:uppercase;margin-top:3px;">${esc(CLINIC_TAGLINE)}</div>
            </td>
          </tr>

          <!-- Full Width Main Email Body -->
          <tr>
            <td class="email-body" style="padding:28px 24px;">
              <h1 class="mobile-title" style="margin:0 0 16px;font-size:22px;font-weight:700;line-height:1.3;color:${TEXT_DARK};letter-spacing:-0.01em;">${esc(title)}</h1>
              <div class="mobile-text" style="font-size:14px;line-height:1.65;color:${TEXT_DARK};">${bodyHtml}</div>
            </td>
          </tr>

          ${
            footerNote
              ? `<tr><td style="padding:0 24px 16px;font-size:12px;color:${TEXT_MUTED};line-height:1.5;">${esc(footerNote)}</td></tr>`
              : ""
          }

          <!-- 100% Full Width Seamless Footer (No background color mismatch or card inset) -->
          <tr>
            <td class="email-footer" style="padding:20px 24px;background:${BG_MAIN};border-top:1px solid ${BORDER_HAIRLINE};">
              <div style="font-size:13px;font-weight:600;color:${TEXT_DARK};">${esc(CLINIC_NAME)}</div>
              <div style="font-size:12px;color:${TEXT_MUTED};margin-top:4px;">
                Phone: <a href="tel:${esc(CLINIC_PHONE)}" style="color:${NAVY_PRIMARY};text-decoration:none;">${esc(CLINIC_PHONE)}</a> &nbsp;&bull;&nbsp; Email: <a href="mailto:${esc(CLINIC_EMAIL)}" style="color:${NAVY_PRIMARY};text-decoration:none;">${esc(CLINIC_EMAIL)}</a>
              </div>
              <div style="font-size:11px;color:${TEXT_LIGHT};margin-top:10px;line-height:1.5;">
                This is an automated operational email from ${esc(CLINIC_NAME)}. Please do not send sensitive personal health information over unencrypted email.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}


