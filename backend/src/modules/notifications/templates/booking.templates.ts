// src/modules/notifications/templates/booking.templates.ts

interface TemplateResult {
  subject: string;
  html: string;
  text: string;
}

// ─── 1. CONFIRMATION TEMPLATE ─────────────────────────────────────────
export const bookingConfirmationTemplate = (data: any): TemplateResult => {
  const subject = `Booking Confirmed at ${data.hotelName} - #${data.bookingId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #4CAF50;">Hello ${data.customerName},</h2>
      <p>Your booking at <strong>${data.hotelName}</strong> has been successfully confirmed!</p>
      <hr style="border: none; border-top: 1px solid #eee;" />
      <h3>Booking Details:</h3>
      <p><strong>Booking ID:</strong> ${data.bookingId}</p>
      <p><strong>Room Number:</strong> ${data.roomNumber} (${data.roomType})</p>
      <p><strong>Check-In:</strong> ${data.checkIn}</p>
      <p><strong>Check-Out:</strong> ${data.checkOut}</p>
      <p><strong>Nights:</strong> ${data.nights}</p>
      <h4 style="color: #333;">Total Price: ${data.totalPrice} ${data.currency ?? 'USD'}</h4>
      <hr style="border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #777;">Thank you for choosing our platform!</p>
    </div>
  `;
  const text = `Hello ${data.customerName}, your booking #${data.bookingId} at ${data.hotelName} is confirmed!`;

  return { subject, html, text };
};

// ─── 2. CHECK-IN TEMPLATE ─────────────────────────────────────────────
export const checkInTemplate = (data: any): TemplateResult => {
  const subject = `Welcome to ${data.hotelName}! - Check-in Successful`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #2196F3;">Welcome, ${data.customerName}!</h2>
      <p>You have successfully checked into room <strong>${data.roomNumber}</strong> at <strong>${data.hotelName}</strong>.</p>
      <p>We hope you enjoy your stay. Your scheduled check-out date is <strong>${data.checkOut}</strong>.</p>
      <p style="font-size: 12px; color: #777;">If you need any assistance, please contact the front desk.</p>
    </div>
  `;
  const text = `Welcome ${data.customerName}! Your check-in to room ${data.roomNumber} at ${data.hotelName} was successful.`;

  return { subject, html, text };
};

// ─── 3. CHECK-OUT TEMPLATE ────────────────────────────────────────────
export const checkOutTemplate = (data: any): TemplateResult => {
  const subject = `Thank you for staying at ${data.hotelName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
      <h2>Thank You, ${data.customerName}</h2>
      <p>Your check-out from room <strong>${data.roomNumber}</strong> at <strong>${data.hotelName}</strong> has been processed successfully.</p>
      <p>We hope to see you again soon!</p>
      <p style="font-size: 12px; color: #777;">An invoice for ${data.totalPrice} ${data.currency ?? 'USD'} has been attached to your account.</p>
    </div>
  `;
  const text = `Thank you ${data.customerName} for staying at ${data.hotelName}. Your check-out is complete.`;

  return { subject, html, text };
};

// ─── 4. CANCELLATION TEMPLATE ─────────────────────────────────────────
export const cancellationTemplate = (data: any): TemplateResult => {
  const subject = `Booking Cancelled - #${data.bookingId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #f44336;">Booking Cancelled</h2>
      <p>Hello ${data.customerName},</p>
      <p>Your booking <strong>#${data.bookingId}</strong> at <strong>${data.hotelName}</strong> has been cancelled successfully.</p>
      <p>If this was a mistake or you wish to rebook, please visit our platform.</p>
    </div>
  `;
  const text = `Hello ${data.customerName}, your booking #${data.bookingId} at ${data.hotelName} has been cancelled.`;

  return { subject, html, text };
};