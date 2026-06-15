import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, Activity, Settings, Lock, Check, X, Mail, UserPlus } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Login = () => {
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);

  const navigate = useNavigate();

  // Password Requirements Checking
  const hasMinLength = signUpPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(signUpPassword);
  const hasNumber = /[0-9]/.test(signUpPassword);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(signUpPassword);
  const passwordsMatch = signUpPassword === signUpConfirmPassword && signUpPassword !== '';
  const allRequirementsMet = hasMinLength && hasUppercase && hasNumber && hasSpecialChar && passwordsMatch;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
    else navigate('/');
    setLoginLoading(false);
  };

  const handleDiscordLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setLoginError(error.message);
      setLoginLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!allRequirementsMet) {
      setSignUpError('Please ensure all password requirements are met.');
      return;
    }
    setSignUpLoading(true);
    setSignUpError('');
    setSignUpSuccess('');

    const { error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        data: {
          role: 'user', // Non-admin by default
        },
      },
    });

    if (error) {
      setSignUpError(error.message);
    } else {
      setSignUpSuccess('Account registration successful! Check your inbox for confirmation (if email confirmations are active).');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');
    }
    setSignUpLoading(false);
  };

  const renderRequirement = (label, isMet) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      fontSize: '0.8rem', 
      color: isMet ? '#48bb78' : '#a0aec0', 
      transition: 'all 0.2s', 
      marginBottom: '6px', 
      fontFamily: 'monospace' 
    }}>
      {isMet ? (
        <Check size={14} style={{ color: '#48bb78', flexShrink: 0 }} />
      ) : (
        <X size={14} style={{ color: '#fc8181', flexShrink: 0 }} />
      )}
      <span>{label}</span>
    </div>
  );

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      justifyContent: 'center', 
      alignItems: 'stretch', 
      gap: '32px',
      padding: '40px 20px',
      minHeight: '80vh', 
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
      backgroundSize: '24px 24px'
    }}>
      
      {/* LEFT WIDGET: Login & Discord Auth */}
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        background: '#0a192f', 
        border: '2px solid #90cdf4', 
        boxShadow: '12px 12px 0px rgba(144, 205, 244, 0.2)', 
        padding: '40px', 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--primary-blue)' }}></div>
        <div style={{ position: 'absolute', top: 10, right: -40, opacity: 0.05, transform: 'rotate(15deg)', pointerEvents: 'none' }}>
          <ShieldCheck size={180} color="#90cdf4" />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Shield size={28} color="#90cdf4" />
            <h2 style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.4rem', margin: 0, fontFamily: 'monospace' }}>System Access</h2>
          </div>
          <p style={{ color: '#8892b0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '32px', borderBottom: '1px solid #233554', paddingBottom: '16px' }}>
            Registered Operator Verification
          </p>

          {loginError && (
            <div style={{ background: 'rgba(229, 62, 62, 0.1)', borderLeft: '4px solid #e53e3e', color: '#fc8181', padding: '12px 16px', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#90cdf4', marginBottom: '8px', letterSpacing: '1px' }}>Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={{ width: '100%', padding: '14px', background: '#112240', border: '1px solid #233554', color: '#fff', fontSize: '1rem', fontFamily: 'monospace', outline: 'none', transition: 'border-color 0.2s', borderRadius: '0px' }} 
                onFocus={e => e.target.style.borderColor = '#90cdf4'}
                onBlur={e => e.target.style.borderColor = '#233554'}
              />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#90cdf4', marginBottom: '8px', letterSpacing: '1px' }}>Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                style={{ width: '100%', padding: '14px', background: '#112240', border: '1px solid #233554', color: '#fff', fontSize: '1rem', fontFamily: 'monospace', outline: 'none', transition: 'border-color 0.2s', borderRadius: '0px' }} 
                onFocus={e => e.target.style.borderColor = '#90cdf4'}
                onBlur={e => e.target.style.borderColor = '#233554'}
              />
            </div>
            <button 
              type="submit" 
              disabled={loginLoading} 
              style={{ width: '100%', padding: '16px', background: loginLoading ? '#233554' : '#90cdf4', color: loginLoading ? '#8892b0' : '#0a192f', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', border: 'none', borderRadius: '0px', cursor: loginLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              {loginLoading ? 'Authenticating...' : <><Settings size={18} /> Sign In</>}
            </button>
          </form>

          {/* Discord OAuth Section */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 16px', color: '#8892b0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <div style={{ flex: 1, height: '1px', background: '#233554' }}></div>
            <span style={{ padding: '0 12px' }}>Or Authenticate Via</span>
            <div style={{ flex: 1, height: '1px', background: '#233554' }}></div>
          </div>

          <button 
            type="button"
            onClick={handleDiscordLogin}
            disabled={loginLoading} 
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: '#5865F2', 
              color: '#fff', 
              fontSize: '0.95rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              border: 'none', 
              borderRadius: '0px', 
              cursor: loginLoading ? 'not-allowed' : 'pointer', 
              transition: 'all 0.2s', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px' 
            }}
            onMouseEnter={(e) => e.target.style.background = '#4752C4'}
            onMouseLeave={(e) => e.target.style.background = '#5865F2'}
          >
            <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.89-.65,1.76-1.34,2.58-2a75.58,75.58,0,0,0,72.76,0c.82.71,1.69,1.4,2.58,2a68.68,68.68,0,0,1-10.5,5,77.6,77.6,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.59-18.83C129,54.65,123.5,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
            </svg>
            Sign In With Discord
          </button>
        </div>
      </div>

      {/* RIGHT WIDGET: Register New Account */}
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        background: '#0a192f', 
        border: '2px solid #cbd5e1', 
        boxShadow: '12px 12px 0px rgba(203, 213, 225, 0.2)', 
        padding: '40px', 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#cbd5e1' }}></div>
        <div style={{ position: 'absolute', top: 10, right: -40, opacity: 0.05, transform: 'rotate(15deg)', pointerEvents: 'none' }}>
          <UserPlus size={180} color="#cbd5e1" />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Lock size={28} color="#cbd5e1" />
            <h2 style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.4rem', margin: 0, fontFamily: 'monospace' }}>Create Account</h2>
          </div>
          <p style={{ color: '#8892b0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '32px', borderBottom: '1px solid #233554', paddingBottom: '16px' }}>
            Standard Operator Registration
          </p>

          {signUpError && (
            <div style={{ background: 'rgba(229, 62, 62, 0.1)', borderLeft: '4px solid #e53e3e', color: '#fc8181', padding: '12px 16px', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> {signUpError}
            </div>
          )}

          {signUpSuccess && (
            <div style={{ background: 'rgba(72, 187, 120, 0.1)', borderLeft: '4px solid #48bb78', color: '#68d391', padding: '12px 16px', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} /> {signUpSuccess}
            </div>
          )}

          <form onSubmit={handleSignUp}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '8px', letterSpacing: '1px' }}>Email Address</label>
              <input 
                type="email" 
                required 
                value={signUpEmail} 
                onChange={e => setSignUpEmail(e.target.value)} 
                style={{ width: '100%', padding: '12px', background: '#112240', border: '1px solid #233554', color: '#fff', fontSize: '1rem', fontFamily: 'monospace', outline: 'none', transition: 'border-color 0.2s', borderRadius: '0px' }} 
                onFocus={e => e.target.style.borderColor = '#cbd5e1'}
                onBlur={e => e.target.style.borderColor = '#233554'}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '8px', letterSpacing: '1px' }}>Password</label>
              <input 
                type="password" 
                required 
                value={signUpPassword} 
                onChange={e => setSignUpPassword(e.target.value)} 
                style={{ width: '100%', padding: '12px', background: '#112240', border: '1px solid #233554', color: '#fff', fontSize: '1rem', fontFamily: 'monospace', outline: 'none', transition: 'border-color 0.2s', borderRadius: '0px' }} 
                onFocus={e => e.target.style.borderColor = '#cbd5e1'}
                onBlur={e => e.target.style.borderColor = '#233554'}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '8px', letterSpacing: '1px' }}>Confirm Password</label>
              <input 
                type="password" 
                required 
                value={signUpConfirmPassword} 
                onChange={e => setSignUpConfirmPassword(e.target.value)} 
                style={{ width: '100%', padding: '12px', background: '#112240', border: '1px solid #233554', color: '#fff', fontSize: '1rem', fontFamily: 'monospace', outline: 'none', transition: 'border-color 0.2s', borderRadius: '0px' }} 
                onFocus={e => e.target.style.borderColor = '#cbd5e1'}
                onBlur={e => e.target.style.borderColor = '#233554'}
              />
            </div>

            {/* Checklist */}
            <div style={{ 
              background: '#112240', 
              border: '1px solid #233554', 
              padding: '16px', 
              marginBottom: '24px'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8892b0' }}>Complexity Index Matrix:</p>
              {renderRequirement('Minimum 8 characters length', hasMinLength)}
              {renderRequirement('Contains uppercase letter (A-Z)', hasUppercase)}
              {renderRequirement('Contains numerical digit (0-9)', hasNumber)}
              {renderRequirement('Contains special character (e.g. !@#$)', hasSpecialChar)}
              {renderRequirement('Passwords match completely', passwordsMatch)}
            </div>

            <button 
              type="submit" 
              disabled={signUpLoading || !allRequirementsMet} 
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: !allRequirementsMet ? '#233554' : (signUpLoading ? '#233554' : '#cbd5e1'), 
                color: !allRequirementsMet ? '#8892b0' : (signUpLoading ? '#8892b0' : '#0a192f'), 
                fontSize: '1rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '2px', 
                border: 'none', 
                borderRadius: '0px', 
                cursor: (!allRequirementsMet || signUpLoading) ? 'not-allowed' : 'pointer', 
                transition: 'all 0.2s', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '8px' 
              }}
            >
              {signUpLoading ? 'Registering...' : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Login;
