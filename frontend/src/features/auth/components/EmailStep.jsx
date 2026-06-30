import React from 'react';

const EmailStep = ({ email, setEmail, onSubmit }) => (
  <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={inputStyles.label}>Email Address</label>
    <input 
      type="email" 
      placeholder="you@example.com"
      value={email} 
      onChange={(e) => setEmail(e.target.value)} 
      required 
      style={inputStyles.input}
    />
    <button type="submit" style={inputStyles.button}>
      Send OTP
    </button>
  </form>
);

export default EmailStep;