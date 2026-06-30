import React from 'react';

const PasswordStep = ({ newPassword, setNewPassword, onSubmit }) => (
  <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={inputStyles.label}>New Password</label>
    <input 
      type="password" 
      placeholder="••••••••"
      value={newPassword} 
      onChange={(e) => setNewPassword(e.target.value)} 
      required 
      style={inputStyles.input}
    />
    <button type="submit" style={{ ...inputStyles.button, backgroundColor: '#10B981' }}>
      Update Password
    </button>
  </form>
);

export default PasswordStep;