import React from 'react';

const EmailStep = ({ email, setEmail, onSubmit }) => (
  <form onSubmit={onSubmit} style={{ marginBottom: '15px' }}>
    <label>Email Address:</label>
    <input 
      type="email" 
      value={email} 
      onChange={(e) => setEmail(e.target.value)} 
      required 
      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
    />
    <button type="submit" style={{ marginTop: '10px' }}>Send OTP</button>
  </form>
);

export default EmailStep;