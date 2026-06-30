import React from 'react';

const OtpStep = ({ otp, setOtp, onSubmit }) => (
  <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={inputStyles.label}>Enter 6-Digit OTP</label>
    <input 
      type="text" 
      placeholder="0 0 0 0 0 0"
      maxLength="6"
      value={otp} 
      onChange={(e) => setOtp(e.target.value)} 
      required 
      style={{ ...inputStyles.input, letterSpacing: '4px', textAlign: 'center', fontSize: '18px' }}
    />
    <button type="submit" style={inputStyles.button}>
      Verify OTP
    </button>
  </form>
);

export default OtpStep;