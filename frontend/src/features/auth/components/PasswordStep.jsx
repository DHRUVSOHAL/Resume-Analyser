import React from 'react';

const PasswordStep = ({ newPassword, setNewPassword, onSubmit }) => (
  <form onSubmit={onSubmit} style={{ marginBottom: '15px' }}>
    <label>New Password:</label>
    <input 
      type="password" 
      value={newPassword} 
      onChange={(e) => setNewPassword(e.target.value)} 
      required 
      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
    />
    <button type="submit" style={{ marginTop: '15px', width: '100%' }}>
      Update Password
    </button>
  </form>
);

export default PasswordStep;