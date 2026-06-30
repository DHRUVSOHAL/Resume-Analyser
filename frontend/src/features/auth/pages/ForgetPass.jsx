import React from 'react';
import EmailStep from '../components/EmailStep';
import OtpStep from '../components/OtpStep';
import PasswordStep from '../components/PasswordStep';
import { ResetPass } from '../hooks/ResetPass';

const ForgetPass = () => {
  const {
    step, email, setEmail, otp, setOtp, newPassword, setNewPassword, error,
    handleSendOtp, handleVerifyOtp, handleResetPassword
  } = ResetPass();

  const stepsConfig = [
    { id: 1, label: 'Email' },
    { id: 2, label: 'OTP' },
    { id: 3, label: 'Password' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>Reset your password in 3 simple steps</p>

        {/* Progress Bar UI */}
        <div style={styles.progressContainer}>
          {stepsConfig.map((s, index) => (
            <React.Fragment key={s.id}>
              <div style={styles.stepWrapper}>
                <div style={{
                  ...styles.stepCircle,
                  backgroundColor: step >= s.id ? '#4F46E5' : '#E5E7EB',
                  color: step >= s.id ? '#FFFFFF' : '#6B7280'
                }}>
                  {s.id}
                </div>
                <span style={{
                  ...styles.stepLabel,
                  color: step >= s.id ? '#4F46E5' : '#9CA3AF',
                  fontWeight: step === s.id ? '600' : '400'
                }}>{s.label}</span>
              </div>
              {index < stepsConfig.length - 1 && (
                <div style={{
                  ...styles.stepLine,
                  backgroundColor: step > s.id ? '#4F46E5' : '#E5E7EB'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Alert */}
        {error && <div style={styles.errorAlert}>{error}</div>}

        {/* Form Steps Switching */}
        <div style={styles.formContent}>
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
      </div>
    </div>
  );
};

// Modern UI Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#F3F4F6',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    padding: '20px'
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: '40px 32px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '440px',
    boxSizing: 'border-box'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    textAlign: 'center',
    margin: '0 0 30px 0'
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '35px',
    position: 'relative'
  },
  stepWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2
  },
  stepCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  stepLabel: {
    fontSize: '12px',
    marginTop: '6px',
    transition: 'all 0.3s ease'
  },
  stepLine: {
    height: '2px',
    flex: 1,
    margin: '0 -10px',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
    zIndex: 1
  },
  errorAlert: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center',
    border: '1px solid #FCA5A5'
  },
  formContent: {
    marginTop: '10px'
  }
};

export default ForgetPass;