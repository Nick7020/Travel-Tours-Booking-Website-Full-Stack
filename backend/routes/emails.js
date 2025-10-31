const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');

// Email templates
const emailTemplates = {
    welcome: {
        subject: '🌟 Welcome to Tarang Travel & Tours! Your Adventure Begins! 🌎',
        html: (name) => `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 20px; border-radius: 15px;">
                <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <!-- Header with Icon -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="background: #e0e7ff; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                            <span style="font-size: 40px;">✈️</span>
                        </div>
                        <h1 style="color: #3b82f6; margin: 0 0 10px 0; font-size: 28px;">Welcome to Tarang Travel!</h1>
                        <div style="height: 4px; width: 60px; background: #3b82f6; margin: 15px auto; border-radius: 2px;"></div>
                    </div>
                    
                    <!-- Greeting -->
                    <p style="font-size: 16px; color: #4b5563; line-height: 1.7; margin-bottom: 25px;">
                        Dear <span style="color: #3b82f6; font-weight: 600;">${name}</span>,<br>
                        🎉 Welcome to the Tarang Travel family! We're absolutely thrilled to have you on board for what promises to be an unforgettable journey. 🌈
                    </p>
                    
                    <!-- Main Content -->
                    <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <h2 style="color: #3b82f6; margin-top: 0; font-size: 20px; display: flex; align-items: center;">
                            <span style="margin-right: 10px;">🚀</span> Your Adventure Starts Here!
                        </h2>
                        <ul style="font-size: 15px; color: #4b5563; line-height: 1.8; padding-left: 25px; margin: 15px 0 0 0;">
                            <li style="margin-bottom: 12px;">
                                <span style="color: #10b981; font-weight: bold;">✓</span> <strong>Exclusive Deals:</strong> Get access to members-only discounts and early bird specials! 🎁
                            </li>
                            <li style="margin-bottom: 12px;">
                                <span style="color: #10b981; font-weight: bold;">✓</span> <strong>Personalized Recommendations:</strong> Tailored travel suggestions just for you! ✨
                            </li>
                            <li style="margin-bottom: 12px;">
                                <span style="color: #10b981; font-weight: bold;">✓</span> <strong>24/7 Support:</strong> Our travel experts are always here for you! 💫
                            </li>
                            <li style="margin-bottom: 0;">
                                <span style="color: #10b981; font-weight: bold;">✓</span> <strong>Travel Tips:</strong> Get insider knowledge before you go! 🧳
                            </li>
                        </ul>
                    </div>
                    
                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://www.tarangtravel.com/explore" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                            🚀 Start Exploring Now →
                        </a>
                    </div>
                    
                    <!-- Contact Info -->
                    <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 30px 0; border: 1px solid #e2e8f0;">
                        <h3 style="color: #3b82f6; margin-top: 0; font-size: 18px; display: flex; align-items: center;">
                            <span style="margin-right: 10px;">📞</span> Need Help? We're Here For You!
                        </h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
                            <div style="flex: 1; min-width: 120px;">
                                <div style="color: #64748b; font-size: 14px; margin-bottom: 5px;">📧 Email</div>
                                <div style="color: #1e293b; font-weight: 500;">support@tarangtravel.com</div>
                            </div>
                            <div style="flex: 1; min-width: 120px;">
                                <div style="color: #64748b; font-size: 14px; margin-bottom: 5px;">📱 WhatsApp</div>
                                <div style="color: #1e293b; font-weight: 500;">+1 (555) 123-4567</div>
                            </div>
                            <div style="flex: 1; min-width: 120px;">
                                <div style="color: #64748b; font-size: 14px; margin-bottom: 5px;">🌐 Live Chat</div>
                                <div style="color: #1e293b; font-weight: 500;">Available 24/7</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Social Media -->
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px;">Follow us on social media for travel inspiration!</p>
                        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
                            <a href="#" style="color: #3b82f6; text-decoration: none; font-size: 20px;">📱</a>
                            <a href="#" style="color: #3b82f6; text-decoration: none; font-size: 20px;">📸</a>
                            <a href="#" style="color: #3b82f6; text-decoration: none; font-size: 20px;">🐦</a>
                            <a href="#" style="color: #3b82f6; text-decoration: none; font-size: 20px;">📘</a>
                        </div>
                        <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                            Tarang Travel & Tours • 123 Adventure Lane • Paradise City, PC 12345
                        </p>
                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #cbd5e1;">
                            © ${new Date().getFullYear()} Tarang Travel. All rights reserved.
                        </p>
                    </div>
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
