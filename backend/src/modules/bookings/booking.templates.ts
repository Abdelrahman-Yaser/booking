// ─── Booking Confirmation ────────────────────────────────────────
export function bookingConfirmationTemplate(data: {
  customerName: string;
  hotelName: string;
  bookingId: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  currency?: string;
}): { subject: string; html: string; text: string } {
  const currency = data.currency ?? 'EGP';

  const subject = `✅ Booking Confirmed — ${data.hotelName} (Ref: ${data.bookingId.slice(-8).toUpperCase()})`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1a56db;padding:32px 40px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;">🏨 ${data.hotelName}</h1>
            <p style="color:#93c5fd;margin:8px 0 0;font-size:14px;">Booking Confirmation</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:32px 40px 0;">
            <h2 style="color:#111827;margin:0 0 8px;font-size:20px;">Hi ${data.customerName}! 👋</h2>
            <p style="color:#6b7280;margin:0;font-size:15px;line-height:1.6;">
              Your booking has been <strong style="color:#059669;">confirmed</strong>. We look forward to welcoming you!
            </p>
          </td>
        </tr>

        <!-- Booking Details Card -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
                  <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
                  <p style="margin:4px 0 0;font-size:20px;font-weight:bold;color:#1a56db;letter-spacing:2px;">${data.bookingId.slice(-8).toUpperCase()}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="padding-bottom:16px;">
                        <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;">Room</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#111827;">Room ${data.roomNumber} — ${data.roomType}</p>
                      </td>
                      <td width="50%" style="padding-bottom:16px;">
                        <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;">Duration</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#111827;">${data.nights} Night${data.nights > 1 ? 's' : ''}</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="50%">
                        <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;">Check-in</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#111827;">🗓 ${data.checkIn}</p>
                      </td>
                      <td width="50%">
                        <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;">Check-out</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#111827;">🗓 ${data.checkOut}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Total -->
              <tr>
                <td style="padding:16px 24px;background:#1a56db;border-radius:0 0 8px 8px;">
                  <table width="100%">
                    <tr>
                      <td><p style="margin:0;color:#bfdbfe;font-size:14px;">Total Amount</p></td>
                      <td align="right"><p style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">${currency} ${data.totalPrice.toLocaleString()}</p></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Info Note -->
        <tr>
          <td style="padding:0 40px 32px;">
            <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">
              📍 Please present this email or your booking reference upon arrival.<br/>
              ❓ For any questions, contact us at <a href="mailto:info@${data.hotelName.toLowerCase().replace(/\s/g, '')}.com" style="color:#1a56db;">${data.hotelName}</a>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} ${data.hotelName}. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `
Booking Confirmed — ${data.hotelName}
Reference: ${data.bookingId.slice(-8).toUpperCase()}

Dear ${data.customerName},
Your booking has been confirmed.

Room: ${data.roomNumber} (${data.roomType})
Check-in:  ${data.checkIn}
Check-out: ${data.checkOut}
Nights:    ${data.nights}
Total:     ${currency} ${data.totalPrice}

See you soon!
${data.hotelName}
  `.trim();

  return { subject, html, text };
}

// ─── Check-In ────────────────────────────────────────────────────
export function checkInTemplate(data: {
  customerName: string;
  hotelName: string;
  bookingId: string;
  roomNumber: string;
  roomType: string;
  checkOut: string;
}): { subject: string; html: string; text: string } {
  const subject = `🏨 Welcome to ${data.hotelName}! Your Check-in is Complete`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:#059669;padding:32px 40px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:28px;">🎉 Welcome!</h1>
            <p style="color:#a7f3d0;margin:8px 0 0;font-size:16px;">${data.hotelName}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 40px;">
            <h2 style="color:#111827;margin:0 0 12px;">Hi ${data.customerName}!</h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
              You've successfully checked in. We hope you have a wonderful stay!
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:20px;">
              <tr>
                <td style="padding:8px 16px;">
                  <p style="margin:0;font-size:13px;color:#065f46;">🔑 <strong>Your Room:</strong> ${data.roomNumber} (${data.roomType})</p>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 16px;">
                  <p style="margin:0;font-size:13px;color:#065f46;">📅 <strong>Check-out:</strong> ${data.checkOut}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 16px;">
                  <p style="margin:0;font-size:13px;color:#065f46;">🔖 <strong>Ref:</strong> ${data.bookingId.slice(-8).toUpperCase()}</p>
                </td>
              </tr>
            </table>

            <p style="color:#6b7280;font-size:13px;margin:24px 0 0;line-height:1.6;">
              Need anything? Our reception team is available 24/7 to assist you. 😊
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} ${data.hotelName}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `
Welcome to ${data.hotelName}!

Hi ${data.customerName}, you've checked in successfully.
Room: ${data.roomNumber} (${data.roomType})
Check-out: ${data.checkOut}
Ref: ${data.bookingId.slice(-8).toUpperCase()}

Enjoy your stay!
  `.trim();

  return { subject, html, text };
}

// ─── Check-Out ───────────────────────────────────────────────────
export function checkOutTemplate(data: {
  customerName: string;
  hotelName: string;
  bookingId: string;
  roomNumber: string;
  nights: number;
  totalPrice: number;
  currency?: string;
}): { subject: string; html: string; text: string } {
  const currency = data.currency ?? 'EGP';
  const subject = `👋 Thank You for Staying at ${data.hotelName}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:#7c3aed;padding:32px 40px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:28px;">👋 See You Again!</h1>
            <p style="color:#ddd6fe;margin:8px 0 0;font-size:16px;">${data.hotelName}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 40px;">
            <h2 style="color:#111827;margin:0 0 12px;">Dear ${data.customerName},</h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Thank you for choosing ${data.hotelName}. We hope you had a wonderful experience!
            </p>

            <!-- Receipt Summary -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <tr><td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
                <p style="margin:0;font-size:13px;color:#6b7280;">Booking Ref</p>
                <p style="margin:4px 0 0;font-weight:bold;color:#111827;">${data.bookingId.slice(-8).toUpperCase()}</p>
              </td></tr>
              <tr><td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
                <p style="margin:0;font-size:13px;color:#6b7280;">Room</p>
                <p style="margin:4px 0 0;font-weight:bold;color:#111827;">Room ${data.roomNumber} · ${data.nights} night${data.nights > 1 ? 's' : ''}</p>
              </td></tr>
              <tr><td style="padding:16px 20px;background:#7c3aed;">
                <table width="100%"><tr>
                  <td><p style="margin:0;color:#ddd6fe;font-size:14px;">Total Paid</p></td>
                  <td align="right"><p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">${currency} ${data.totalPrice.toLocaleString()}</p></td>
                </tr></table>
              </td></tr>
            </table>

            <p style="color:#6b7280;font-size:13px;margin:24px 0 0;line-height:1.6;text-align:center;">
              ⭐ We'd love your feedback! Please let us know about your stay.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} ${data.hotelName}. We hope to see you again!</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `
Thank you for staying at ${data.hotelName}!

Dear ${data.customerName},
We hope you had a great stay.

Booking Ref: ${data.bookingId.slice(-8).toUpperCase()}
Room: ${data.roomNumber} · ${data.nights} nights
Total: ${currency} ${data.totalPrice}

We'd love to see you again!
${data.hotelName}
  `.trim();

  return { subject, html, text };
}

// ─── Cancellation ────────────────────────────────────────────────
export function cancellationTemplate(data: {
  customerName: string;
  hotelName: string;
  bookingId: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
}): { subject: string; html: string; text: string } {
  const subject = `❌ Booking Cancelled — ${data.hotelName} (Ref: ${data.bookingId.slice(-8).toUpperCase()})`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:#dc2626;padding:32px 40px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;">Booking Cancelled</h1>
            <p style="color:#fca5a5;margin:8px 0 0;font-size:14px;">${data.hotelName}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
              Dear <strong>${data.customerName}</strong>,<br/>
              Your booking has been <strong style="color:#dc2626;">cancelled</strong>. Here are the details:
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:20px;">
              <tr><td style="padding:6px 0;">
                <p style="margin:0;font-size:13px;color:#7f1d1d;">🔖 Ref: <strong>${data.bookingId.slice(-8).toUpperCase()}</strong></p>
              </td></tr>
              <tr><td style="padding:6px 0;">
                <p style="margin:0;font-size:13px;color:#7f1d1d;">🛏 Room: <strong>${data.roomNumber}</strong></p>
              </td></tr>
              <tr><td style="padding:6px 0;">
                <p style="margin:0;font-size:13px;color:#7f1d1d;">🗓 Was: <strong>${data.checkIn} → ${data.checkOut}</strong></p>
              </td></tr>
            </table>

            <p style="color:#6b7280;font-size:13px;margin:24px 0 0;">
              If you believe this is an error, please contact us immediately.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} ${data.hotelName}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `
Booking Cancelled — ${data.hotelName}

Dear ${data.customerName},
Your booking (Ref: ${data.bookingId.slice(-8).toUpperCase()}) has been cancelled.

Room: ${data.roomNumber}
Was: ${data.checkIn} → ${data.checkOut}

Contact us if this was an error.
  `.trim();

  return { subject, html, text };
}
