import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure react-router-dom is used
import { useAuth } from './useAuth'; 
import { forgetPasswordApi, verifyOtpApi, resetPasswordApi } from '../services/auth.api';

export const ResetPass = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { setUser } = useAuth(); 

    // STEP 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await forgetPasswordApi(email);
            alert(data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Error sending OTP");
        }
    };

    // STEP 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await verifyOtpApi(email, otp);
            alert(data.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        }
    };

    // STEP 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await resetPasswordApi(newPassword);
            
            if (data.success && data.user) {
                alert(data.message || "Password updated successfully!");
                
                // फ्रेश रीलोड करके होमपेज पर रीडायरेक्ट ताकि 'get-me' क्रैश न हो
                window.location.replace("/"); 
            } else {
                setError("Password badal gaya par user data nahi mila.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update password");
        }
    };

    // 🔥 यह रिटर्न ब्लॉक गायब था, इसे जोड़ दिया है:
    return {
        step, 
        email, 
        setEmail, 
        otp, 
        setOtp, 
        newPassword, 
        setNewPassword, 
        error,
        handleSendOtp, 
        handleVerifyOtp, 
        handleResetPassword
    };
};