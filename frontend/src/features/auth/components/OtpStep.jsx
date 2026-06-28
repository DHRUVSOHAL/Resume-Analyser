import React from 'react';

const OtpStep = ({ otp, setOtp, onSubmit }) => (
  <form onSubmit={onSubmit} style={{ marginBottom: '15px' }}>
    <label>Enter OTP:</label>
    <input 
      type="text" 
      value={otp} 
      onChange={(e) => setOtp(e.target.value)} 
      required 
      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
    />
    <button type="submit" style={{ marginTop: '10px' }}>Verify OTP</button>
  </form>
);

export default OtpStep;