const { Resend } = require('resend');

// Apni API key pass karo (Render environment variable se)
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOTPEmail(toEmail, otp) {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev', // Shuru mein testing ke liye yeh use karo, baad mein apna domain add kar sakte ho
            to: toEmail,
            subject: '🔒 Reset Your Password - OTP Verification',
            html: `
                <h2>Password Reset</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>Valid for 10 minutes.</p>
            `,
        });

        console.log("✅ Mail Sent:", data.id);
        return true;
    } catch (error) {
        console.error("❌ Resend Error:", error);
        throw new Error("Email bhejne mein dikkat aayi");
    }
}

module.exports = { sendOTPEmail };