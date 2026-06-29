const nodemailer = require("nodemailer");
const dns = require("dns");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    dnsLookup: (hostname, options, callback) => {
        // Force IPv4 only
        dns.lookup(hostname, { family: 4 }, callback);
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
});

transporter.verify((err, success) => {
    if (err) {
        console.error("SMTP VERIFY ERROR:", err);
    } else {
        console.log("✅ SMTP Server Ready");
    }
});

async function sendOTPEmail(toEmail, otp) {
    try {
        console.log("EMAIL:", process.env.EMAIL_USER);
        console.log(process.env.EMAIL_PASS ? "PASS OK" : "PASS MISSING");

        const mailOptions = {
            from: `"Resume Analyser" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "🔒 Reset Your Password - OTP Verification",
            html: `
                <h2>Password Reset</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>Valid for 10 minutes.</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Mail Sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Nodemailer Error:", error);
        throw new Error("Email bhejne mein dikkat aayi");
    }
}

module.exports = { sendOTPEmail };