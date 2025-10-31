const nodemailer = require('nodemailer');

async function createTransporter() {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  // Ethereal fallback for testing without real creds
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

function bookingConfirmationTemplate(name, details) {
  return {
    subject: 'Your Booking is Confirmed! ✅',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">✅ Booking Confirmed!</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333;">Dear ${name},</p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Great news! Your booking has been confirmed. Get ready for an amazing journey!</p>
          <div style="background: #f0fdf4; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
            <h2 style="color: #059669; margin-top: 0;">📋 Booking Details</h2>
            <p style="margin: 10px 0;"><strong>Package:</strong> ${details.packageName}</p>
            <p style="margin: 10px 0;"><strong>Date:</strong> ${details.travelDate}</p>
            <p style="margin: 10px 0;"><strong>Travelers:</strong> ${details.travelers}</p>
            <p style="margin: 10px 0;"><strong>Total Amount:</strong> $${details.amount}</p>
            <p style="margin: 10px 0;"><strong>Booking ID:</strong> ${details.bookingId}</p>
          </div>
          <p style="margin-top: 30px; color: #333;">Have questions? Contact us at support@tarangtravel.com</p>
          <p style="margin-top: 20px; color: #333;">Happy travels!<br><strong>Tarang Travel Team</strong></p>
        </div>
      </div>
    `,
  };
}

async function sendBookingConfirmation({ to, name, booking }) {
  const transporter = await createTransporter();
  const details = {
    packageName: booking.packageName,
    travelDate: new Date(booking.travelDetails?.travelDate || booking.createdAt).toLocaleDateString(),
    travelers: booking.travelDetails?.numberOfTravelers || 1,
    amount: booking.totalAmount || booking.price || 0,
    bookingId: booking._id,
  };
  const { subject, html } = bookingConfirmationTemplate(name, details);
  const info = await transporter.sendMail({
    from: `"Tarang Travel" <${process.env.EMAIL_USER || 'noreply@tarangtravel.com'}>`,
    to,
    subject,
    html,
  });
  return { messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
}

module.exports = { createTransporter, sendBookingConfirmation };
