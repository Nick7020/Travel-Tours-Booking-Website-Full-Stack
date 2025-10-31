const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');

// Email templates
const emailTemplates = {
    welcome: {
        subject: 'Welcome to Tarang Travel & Tours! 🏝️',
        html: (name) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px;">
                <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <h1 style="color: #667eea; margin-bottom: 20px;">🏝️ Welcome to Tarang Travel!</h1>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear ${name},</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Thank you for choosing Tarang Travel & Tours for your next adventure! We're thrilled to have you as part of our travel family.
                    </p>
                    <h2 style="color: #667eea; margin-top: 30px; font-size: 20px;">🎯 What's Next?</h2>
                    <ul style="font-size: 16px; color: #333; line-height: 1.8;">
                        <li>✅ Browse our exclusive travel packages</li>
                        <li>✈️ Get personalized recommendations</li>
                        <li>💰 Enjoy special member discounts</li>
                        <li>🌟 Access 24/7 customer support</li>
                    </ul>
                    <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #667eea; margin-bottom: 10px;">📞 Need Help?</h3>
                        <p style="color: #555; margin: 5px 0;">Email: support@tarangtravel.com</p>
                        <p style="color: #555; margin: 5px 0;">Phone: +1-800-TRAVEL</p>
                        <p style="color: #555; margin: 5px 0;">Website: www.tarangtravel.com</p>
                    </div>
                    <p style="font-size: 16px; color: #333; margin-top: 30px;">
                        Best regards,<br>
                        <strong>The Tarang Travel Team</strong>
                    </p>
                </div>
            </div>
        `
    },
    
    bookingConfirmation: {
        subject: 'Your Booking is Confirmed! ✅',
        html: (name, bookingDetails) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">✅ Booking Confirmed!</h1>
                </div>
                <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 16px; color: #333;">Dear ${name},</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Great news! Your booking has been confirmed. Get ready for an amazing journey!
                    </p>
                    <div style="background: #f0fdf4; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
                        <h2 style="color: #059669; margin-top: 0;">📋 Booking Details</h2>
                        <p style="margin: 10px 0;"><strong>Package:</strong> ${bookingDetails.packageName}</p>
                        <p style="margin: 10px 0;"><strong>Date:</strong> ${bookingDetails.travelDate}</p>
                        <p style="margin: 10px 0;"><strong>Travelers:</strong> ${bookingDetails.travelers}</p>
                        <p style="margin: 10px 0;"><strong>Total Amount:</strong> $${bookingDetails.amount}</p>
                        <p style="margin: 10px 0;"><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                    </div>
                    <h3 style="color: #059669;">📌 Important Information</h3>
                    <ul style="color: #333; line-height: 1.8;">
                        <li>Keep this confirmation email for your records</li>
                        <li>Check-in opens 24 hours before departure</li>
                        <li>Bring valid ID and travel documents</li>
                        <li>Arrive at least 2 hours early</li>
                    </ul>
                    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #92400e;">
                            ⚠️ <strong>Note:</strong> Please review all details carefully and contact us immediately if you notice any errors.
                        </p>
                    </div>
                    <p style="margin-top: 30px; color: #333;">
                        Have questions? Contact us at support@tarangtravel.com
                    </p>
                    <p style="margin-top: 20px; color: #333;">
                        Happy travels!<br>
                        <strong>Tarang Travel Team</strong>
                    </p>
                </div>
            </div>
        `
    },
    
    travelTips: {
        subject: '✈️ Essential Travel Tips for Your Journey',
        html: (name) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0;">✈️ Travel Tips & Guidance</h1>
                </div>
                <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 16px; color: #333;">Dear ${name},</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Here are some essential tips to make your travel experience smooth and memorable:
                    </p>
                    
                    <div style="margin: 20px 0;">
                        <h3 style="color: #667eea; margin-bottom: 10px;">📝 Before You Travel</h3>
                        <ul style="color: #333; line-height: 1.8;">
                            <li>Check passport validity (6 months minimum)</li>
                            <li>Get required vaccinations</li>
                            <li>Purchase travel insurance</li>
                            <li>Make copies of important documents</li>
                            <li>Notify your bank of travel plans</li>
                        </ul>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h3 style="color: #667eea; margin-bottom: 10px;">🎒 Packing Tips</h3>
                        <ul style="color: #333; line-height: 1.8;">
                            <li>Pack light - less is more!</li>
                            <li>Use packing cubes for organization</li>
                            <li>Bring essential medications</li>
                            <li>Pack a portable charger</li>
                            <li>Include a change of clothes in carry-on</li>
                        </ul>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h3 style="color: #667eea; margin-bottom: 10px;">🛡️ Safety Tips</h3>
                        <ul style="color: #333; line-height: 1.8;">
                            <li>Keep valuables in hotel safe</li>
                            <li>Stay aware of your surroundings</li>
                            <li>Use official transportation only</li>
                            <li>Save emergency numbers</li>
                            <li>Share itinerary with someone at home</li>
                        </ul>
                    </div>
                    
                    <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #667eea; margin-top: 0;">💡 Pro Tip</h3>
                        <p style="color: #333; margin: 0;">
                            Download offline maps and translation apps before departure. They're lifesavers when you don't have internet!
                        </p>
                    </div>
                    
                    <p style="margin-top: 30px; color: #333;">
                        Safe travels and enjoy your adventure!<br>
                        <strong>Tarang Travel Team</strong>
                    </p>
                </div>
            </div>
        `
    },
    
    custom: {
        subject: (subject) => subject,
        html: (name, message) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="border-bottom: 3px solid #667eea; padding-bottom: 20px; margin-bottom: 20px;">
                        <h2 style="color: #667eea; margin: 0;">🏝️ Tarang Travel & Tours</h2>
                    </div>
                    <p style="font-size: 16px; color: #333;">Dear ${name},</p>
                    <div style="font-size: 16px; color: #333; line-height: 1.6; margin: 20px 0;">
                        ${message}
                    </div>
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                        <p style="color: #666; font-size: 14px; margin: 5px 0;">Best regards,</p>
                        <p style="color: #333; font-size: 16px; margin: 5px 0;"><strong>Tarang Travel Team</strong></p>
                        <p style="color: #999; font-size: 12px; margin-top: 20px;">
                            📧 support@tarangtravel.com | 📞 +1-800-TRAVEL | 🌐 www.tarangtravel.com
                        </p>
                    </div>
                </div>
            </div>
        `
    }
};

// Configure email transporter (with Ethereal fallback for testing)
async function createTransporter() {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.EMAIL_PORT || 587),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
    });
}

// Send email endpoint
router.post('/send', async (req, res) => {
    try {
        const { to, name, template, customSubject, customMessage, bookingDetails } = req.body;
        
        if (!to || !name || !template) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: to, name, template'
            });
        }
        
        let subject, html;
        
        // Get template content
        if (template === 'custom') {
            subject = customSubject || 'Message from Tarang Travel';
            html = emailTemplates.custom.html(name, customMessage);
        } else if (template === 'bookingConfirmation' && bookingDetails) {
            subject = emailTemplates[template].subject;
            html = emailTemplates[template].html(name, bookingDetails);
        } else {
            subject = emailTemplates[template].subject;
            html = emailTemplates[template].html(name);
        }
        
        const transporter = await createTransporter();
        
        // Send email
        const info = await transporter.sendMail({
            from: `"Tarang Travel" <${process.env.EMAIL_USER || 'noreply@tarangtravel.com'}>`,
            to: to,
            subject: subject,
            html: html
        });
        
        console.log(`📧 Email sent to ${to}: ${info.messageId}`);
        
        res.json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId
        });
        
    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

// Send bulk emails
router.post('/send-bulk', async (req, res) => {
    try {
        const { recipients, template, customSubject, customMessage } = req.body;
        
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Recipients array is required'
            });
        }
        
        const transporter = await createTransporter();
        const results = [];
        
        for (const recipient of recipients) {
            try {
                let subject, html;
                
                if (template === 'custom') {
                    subject = customSubject || 'Message from Tarang Travel';
                    html = emailTemplates.custom.html(recipient.name, customMessage);
                } else {
                    subject = emailTemplates[template].subject;
                    html = emailTemplates[template].html(recipient.name);
                }
                
                const info = await transporter.sendMail({
                    from: `"Tarang Travel" <${process.env.EMAIL_USER || 'noreply@tarangtravel.com'}>`,
                    to: recipient.email,
                    subject: subject,
                    html: html
                });
                
                results.push({
                    email: recipient.email,
                    success: true,
                    messageId: info.messageId,
                    previewUrl: (require('nodemailer')).getTestMessageUrl(info)
                });
                
            } catch (error) {
                results.push({
                    email: recipient.email,
                    success: false,
                    error: error.message
                });
            }
        }
        
        const successCount = results.filter(r => r.success).length;
        console.log(`📧 Bulk email: ${successCount}/${recipients.length} sent successfully`);
        
        res.json({
            success: true,
            message: `Sent ${successCount} out of ${recipients.length} emails`,
            results: results
        });
        
    } catch (error) {
        console.error('❌ Error sending bulk emails:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send bulk emails',
            error: error.message
        });
    }
});

// Get available templates
router.get('/templates', (req, res) => {
    const templates = Object.keys(emailTemplates).map(key => ({
        id: key,
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        subject: typeof emailTemplates[key].subject === 'function' 
            ? 'Custom Subject' 
            : emailTemplates[key].subject
    }));
    
    res.json({
        success: true,
        templates: templates
    });
});

module.exports = router;
