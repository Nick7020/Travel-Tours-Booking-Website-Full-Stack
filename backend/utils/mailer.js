const nodemailer = require('nodemailer');

async function createTransporter() {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP_EMAIL and SMTP_PASSWORD environment variables are required');
  }

  console.log('🔧 Creating Gmail SMTP transporter');
  console.log('🔑 Using Gmail account:', process.env.SMTP_EMAIL);
  
  // More explicit Gmail SMTP configuration
  const gmailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.SMTP_EMAIL.trim(),
      pass: process.env.SMTP_PASSWORD.trim()
    },
    // Enable debug mode
    debug: true,
    logger: true,
    // Timeout settings
    connectionTimeout: 5 * 60 * 1000, // 5 minutes
    // Disable SSL validation issues
    tls: {
      rejectUnauthorized: false
    }
  };
  
  console.log('📡 Gmail SMTP configuration ready');
  
  try {
    const transporter = nodemailer.createTransport(gmailConfig);
    
    // Verify connection configuration
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified successfully');
    return transporter;
    
  } catch (error) {
    console.error('❌ Error creating Gmail SMTP transporter:', error);
    throw new Error(`Failed to create Gmail SMTP transporter: ${error.message}`);
  }
  
  // Fallback to Ethereal for testing if no Gmail credentials provided
  console.warn('⚠️  No Gmail credentials found, using Ethereal test account');
  const testAccount = await nodemailer.createTestAccount();
  const etherealTransporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  
  console.log('📧 Ethereal test account created:', testAccount.user);
  console.log('🔗 Ethereal email preview:', nodemailer.getTestMessageUrl({}));
  
  return etherealTransporter;
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
  console.log(`📧 Preparing to send booking confirmation to: ${to}`);
  
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      throw new Error('Failed to create email transporter');
    }
    
    console.log('✅ Email transporter created successfully');
    
    const details = {
      packageName: booking.packageName,
      travelDate: new Date(booking.travelDetails?.travelDate || booking.createdAt).toLocaleDateString(),
      travelers: booking.travelDetails?.numberOfTravelers || 1,
      amount: booking.totalAmount || booking.price || 0,
      bookingId: booking._id,
    };
    
    console.log('📝 Preparing email with booking details:', details);
    
    const { subject, html } = bookingConfirmationTemplate(name, details);
    
    const mailOptions = {
      from: `"Tarang Travel" <${process.env.SMTP_EMAIL || 'noreply@tarangtravel.com'}>`,
      to,
      subject,
      html,
    };
    
    console.log('✉️ Sending email with options:', { 
      to, 
      subject,
      hasHtml: !!html,
      from: mailOptions.from 
    });
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    });
    
    return { 
      success: true,
      messageId: info.messageId, 
      previewUrl: nodemailer.getTestMessageUrl(info) 
    };
    
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
    return { 
      success: false, 
      error: error.message,
      details: error 
    };
  }
}

// Email template for trip confirmation
function tripConfirmationTemplate(name, bookingDetails) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Your Trip Has Been Confirmed! 🎉</h2>
      
      <p>Dear ${name},</p>
      
      <p>We're excited to inform you that your trip has been confirmed by our team. Here are your booking details:</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #3498db; margin-top: 0;">Trip Details</h3>
        <p><strong>Package:</strong> ${bookingDetails.packageName}</p>
        <p><strong>Type:</strong> ${bookingDetails.packageType}</p>
        <p><strong>Travel Date:</strong> ${new Date(bookingDetails.travelDate).toLocaleDateString()}</p>
        <p><strong>Number of Travelers:</strong> ${bookingDetails.numberOfTravelers}</p>
        <p><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount.toLocaleString()}</p>
      </div>
      
      <p>Our team will be in touch with you soon with more details about your trip. If you have any questions, feel free to reply to this email.</p>
      
      <p>Happy Travels! ✈️</p>
      <p><strong>The Travel & Tours Team</strong></p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #7f8c8d;">
        <p>This is an automated email, please do not reply directly to this message.</p>
      </div>
    </div>
  `;
}

// Function to send trip confirmation email
async function sendTripConfirmation({ to, name, booking }) {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: `"Travel & Tours" <${process.env.SMTP_EMAIL || 'noreply@traveltours.com'}>`,
      to: to,
      subject: `Your ${booking.packageName} Trip is Confirmed!`,
      html: tripConfirmationTemplate(name, {
        packageName: booking.packageName,
        packageType: booking.packageType,
        travelDate: booking.travelDetails.travelDate,
        numberOfTravelers: booking.travelDetails.numberOfTravelers,
        totalAmount: booking.totalAmount
      })
    };

    console.log('📤 Sending trip confirmation email to:', to);
    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email sent (test mode):', nodemailer.getTestMessageUrl(info));
    } else {
      console.log('✅ Trip confirmation email sent to:', to);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error sending trip confirmation email:', error);
    throw new Error(`Failed to send trip confirmation email: ${error.message}`);
  }
}

module.exports = { 
  createTransporter, 
  sendBookingConfirmation,
  sendTripConfirmation 
};
