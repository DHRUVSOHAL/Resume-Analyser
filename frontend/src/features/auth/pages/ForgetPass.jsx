import React from 'react';
import EmailStep from '../components/EmailStep';
import OtpStep from '../components/OtpStep';
import PasswordStep from '../components/PasswordStep';
import {ResetPass} from '../hooks/ResetPass'

const ForgetPass= () => {
  const {
    step, email, setEmail, otp, setOtp, newPassword, setNewPassword, error,
    handleSendOtp, handleVerifyOtp, handleResetPassword
  } = ResetPass();

  // स्टेप्स के नाम (प्रोग्रेस बार के लिए)
  const stepsConfig = [
    { id: 1, label: 'Email' },
    { id: 2, label: 'OTP' },
    { id: 3, label: 'Password' }
  ];

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Reset Password</h2>
      
      {/* 📊 STEP INDICATOR (PROGRESS BAR) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', position: 'relative' }}>
        {stepsConfig.map((s, index) => (
          <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
            {/* गोला (Circle) */}
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: step >= s.id ? '#007bff' : '#ccc',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}>
              {s.id}
            </div>
            {/* लेबल (Label) */}
            <span style={{ fontSize: '12px', marginTop: '5px', color: step >= s.id ? '#007bff' : '#666', fontWeight: step === s.id ? 'bold' : 'normal' }}>
              {s.label}
            </span>
          </div>
        ))}
        
        {/* बैकग्राउंड प्रोग्रेस लाइन */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          right: '15px',
          height: '2px',
          backgroundColor: '#ccc',
          zIndex: 1
        }} />
        
        {/* एक्टिव प्रोग्रेस लाइन */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
          height: '2px',
          backgroundColor: '#007bff',
          zIndex: 1,
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* ─── ERROR MESSAGE ─── */}
      {error && (
        <div style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px', border: '1px solid #ffa3a3' }}>
          {error}
        </div>
      )}
      
      {/* ─── STEP BASED RENDERING ─── */}
      {step === 1 && (
        <EmailStep email={email} setEmail={setEmail} onSubmit={handleSendOtp} />
      )}

      {step === 2 && (
        <OtpStep otp={otp} setOtp={setOtp} onSubmit={handleVerifyOtp} />
      )}

      {step === 3 && (
        <PasswordStep newPassword={newPassword} setNewPassword={setNewPassword} onSubmit={handleResetPassword} />
      )}
    </div>
  );
};

export default ForgetPass;