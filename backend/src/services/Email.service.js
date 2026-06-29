const nodemailer = require('nodemailer');

// 1. Transporter create karo (Forced IPv4 Config)
const transporter = nodemailer.createTransport({
    // 💡 smtp.gmail.com का डायरेक्ट और स्टेबल IPv4 एड्रेस डाल दिया है
    host: "74.125.143.108", 
    port: 465,               // IPv4 एड्रेस के साथ पोर्ट 465 (SSL) एकदम रॉकेट चलेगा
    secure: true,            // पोर्ट 465 के लिए secure हमेशा TRUE होगा
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  // तुम्हारा 16-digit App Password
    },
    // कनेक्शन को और मजबूत करने के लिए टाइमआउट्स
    connectionTimeout: 15000, 
    greetingTimeout: 15000,
    tls: {
        rejectUnauthorized: false,
        servername: "smtp.gmail.com" // 👈 यह बहुत ज़रूरी है ताकि गूगल का सर्टिफिकेट मैच हो जाए
    }
});

// 2. Email bhejne ka reusable function
async function sendOTPEmail(toEmail, otp) {
    try {
        const mailOptions = {
            from: `"Resume Analyser" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: '🔒 Reset Your Password - OTP Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>Humne aapke account ke liye ek password reset request receive ki hai. Aapka 6-digit verification OTP neeche diya gaya hai:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4A90E2; background: #f4f7f6; padding: 10px 20px; border-radius: 5px; border: 1px dashed #4A90E2;">
                            ${otp}
                        </span>
                    </div>
                    <p style="color: #666; font-size: 14px;">Yeh OTP sirf 10 minutes ke liye valid hai. Agar aapne yeh request nahi ki thi, toh is email ko ignore karein.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">Secure Auth System &copy; 2026</p>
                </div>
            `
        };
        console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS ? "PASS OK" : "PASS MISSING");
        const info = await transporter.sendMail(mailOptions);
        console.log(`📨 Email successfully sent to ${toEmail}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.log("email bhejne me error aya")
        console.error("❌ Nodemailer Error:", error);
        throw new Error("Email bhejne mein dikkat aayi");
    }
}

module.exports = { sendOTPEmail };