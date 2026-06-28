import axios from "axios"


const api = axios.create({
    baseURL:"https://resume-analyser-backend-ve99.onrender.com",
    withCredentials: true
})

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {

        console.log(err)

    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        console.log(err)
    }

}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {

    }
}

export async function getMe() {

    try {

        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.log(err)
    }

}

// ==========================================
// 🔐 FORGOT & RESET PASSWORD APIS
// ==========================================

/**
 * Step 1: ईमेल भेजकर OTP जनरेट करवाएं
 * @param {string} email
 */
export const forgetPasswordApi = async (email) => {
    try {
        const response = await api.post('/api/auth/forget-password', { email });
        return response.data;
    } catch (err) {
        // एरर को थ्रो (throw) कर रहे हैं ताकि हमारा कस्टम हुक इसके catch ब्लॉक में एरर मैसेज पकड़ सके
        throw err; 
    }
};

/**
 * Step 2: OTP वेरीफाई करवाएं (सक्सेस होने पर बैकएंड कुकी में resetToken सेट कर देगा)
 * @param {string} email
 * @param {string} otp
 */
export const verifyOtpApi = async (email, otp) => {
    try {
        const response = await api.post('/api/auth/verify-otp', { email, otp });
        return response.data;
    } catch (err) {
        throw err;
    }
};

/**
 * Step 3: नया पासवर्ड सबमिट करें (सक्सेस होने पर बैकएंड ऑटो-लॉगिन टोकन सेट कर देगा)
 * @param {string} newPassword
 */
export const resetPasswordApi = async (newPassword) => {
    try {
        const response = await api.post('/api/auth/reset-password', { newPassword });
        return response.data;
    } catch (err) {
        throw err;
    }
};