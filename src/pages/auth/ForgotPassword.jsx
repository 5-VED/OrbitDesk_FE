import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../features/auth/api/auth';
import { toast } from 'react-hot-toast';
import './Auth.css';

const OTP_LENGTH = 6;
const OTP_DURATION = 120;

export function ForgotPassword() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(false);

    const otpRefs = useRef([]);

    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }
        setCanResend(false);
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const formatTime = useCallback((seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setErrors({ email: 'Email is required' });
            return;
        }
        if (!emailRegex.test(email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }

        setErrors({});
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            toast.success('OTP sent to your email');
            setStep(2);
            setCountdown(OTP_DURATION);
            setOtp(Array(OTP_LENGTH).fill(''));
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to send OTP';
            toast.error(msg);
            setErrors({ email: msg });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setErrors(prev => ({ ...prev, otp: null }));

        if (value && index < OTP_LENGTH - 1) {
            otpRefs.current[index + 1]?.focus();
        }

        if (newOtp.every(d => d !== '')) {
            handleVerifyOtp(newOtp.join(''));
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!pasted) return;

        const newOtp = [...otp];
        for (let i = 0; i < pasted.length; i++) {
            newOtp[i] = pasted[i];
        }
        setOtp(newOtp);

        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        otpRefs.current[focusIdx]?.focus();

        if (newOtp.every(d => d !== '')) {
            handleVerifyOtp(newOtp.join(''));
        }
    };

    const handleVerifyOtp = async (otpString) => {
        setLoading(true);
        setErrors({});
        try {
            const res = await authService.verifyOtp(email, otpString);
            toast.success('OTP verified');
            setResetToken(res.data.resetToken);
            setStep(3);
        } catch (error) {
            const msg = error.response?.data?.message || 'Invalid OTP';
            toast.error(msg);
            setErrors({ otp: msg });
            setOtp(Array(OTP_LENGTH).fill(''));
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            toast.success('New OTP sent');
            setCountdown(OTP_DURATION);
            setOtp(Array(OTP_LENGTH).fill(''));
            setErrors({});
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);
        try {
            await authService.resetPassword(resetToken, password);
            toast.success('Password reset successfully');
            setStep(4);
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to reset password';
            toast.error(msg);
            setErrors({ password: msg });
        } finally {
            setLoading(false);
        }
    };

    // Step 4: Success
    if (step === 4) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <div className="auth-success-icon">
                                <CheckCircle size={32} />
                            </div>
                            <h1 className="auth-title">Password Reset</h1>
                            <p className="auth-subtitle">
                                Your password has been reset successfully. You can now sign in with your new password.
                            </p>
                        </div>

                        <Button fullWidth onClick={() => navigate('/login')}>
                            Back to Sign In
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Step 3: New Password
    if (step === 3) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <div className="auth-logo">
                                <div className="auth-logo-icon">S</div>
                                <span className="auth-logo-text">SupportDesk</span>
                            </div>
                            <h1 className="auth-title">Set new password</h1>
                            <p className="auth-subtitle">
                                Enter your new password below
                            </p>
                        </div>

                        <form className="auth-form" onSubmit={handleResetPassword}>
                            <Input
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                icon={Lock}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors(prev => ({ ...prev, password: null }));
                                }}
                                error={errors.password}
                                required
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                            />

                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm new password"
                                icon={Lock}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setErrors(prev => ({ ...prev, confirmPassword: null }));
                                }}
                                error={errors.confirmPassword}
                                required
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                            />

                            <Button type="submit" fullWidth loading={loading}>
                                Reset Password
                            </Button>
                        </form>

                        <div className="auth-footer">
                            <Link to="/login" className="auth-back-link">
                                <ArrowLeft size={16} />
                                <span>Back to login</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: OTP Verification
    if (step === 2) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <div className="auth-success-icon" style={{
                                backgroundColor: 'var(--color-primary-light, #e0e7ff)',
                                color: 'var(--color-primary)'
                            }}>
                                <ShieldCheck size={32} />
                            </div>
                            <h1 className="auth-title">Verify OTP</h1>
                            <p className="auth-subtitle">
                                Enter the 6-digit code sent to <strong>{email}</strong>
                            </p>
                        </div>

                        <div className="auth-form">
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                justifyContent: 'center',
                                marginBottom: 'var(--spacing-md)',
                            }}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={el => otpRefs.current[i] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        onPaste={i === 0 ? handleOtpPaste : undefined}
                                        disabled={loading}
                                        style={{
                                            width: '48px',
                                            height: '56px',
                                            textAlign: 'center',
                                            fontSize: '24px',
                                            fontWeight: '600',
                                            fontFamily: 'monospace',
                                            border: `2px solid ${errors.otp ? 'var(--color-danger, #ef4444)' : digit ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                            borderRadius: 'var(--radius-md, 8px)',
                                            outline: 'none',
                                            backgroundColor: 'var(--color-bg-primary)',
                                            color: 'var(--color-text-primary)',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--color-primary)';
                                            e.target.style.boxShadow = '0 0 0 3px var(--color-primary-light, rgba(99, 102, 241, 0.1))';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = digit ? 'var(--color-primary)' : 'var(--color-border)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                ))}
                            </div>

                            {errors.otp && (
                                <p style={{
                                    color: 'var(--color-danger, #ef4444)',
                                    fontSize: 'var(--font-size-sm)',
                                    textAlign: 'center',
                                    margin: '0 0 var(--spacing-sm)',
                                }}>
                                    {errors.otp}
                                </p>
                            )}

                            <div style={{
                                textAlign: 'center',
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--color-text-secondary)',
                                marginBottom: 'var(--spacing-md)',
                            }}>
                                {countdown > 0 ? (
                                    <p style={{ margin: 0 }}>
                                        Code expires in{' '}
                                        <span style={{
                                            fontWeight: '600',
                                            color: countdown <= 30 ? 'var(--color-danger, #ef4444)' : 'var(--color-primary)',
                                            fontFamily: 'monospace',
                                        }}>
                                            {formatTime(countdown)}
                                        </span>
                                    </p>
                                ) : (
                                    <p style={{ margin: 0, color: 'var(--color-danger, #ef4444)' }}>
                                        OTP has expired
                                    </p>
                                )}
                            </div>

                            {loading && (
                                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
                                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        Verifying...
                                    </p>
                                </div>
                            )}

                            <div style={{
                                textAlign: 'center',
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--color-text-secondary)',
                            }}>
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={!canResend || loading}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: canResend ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                                        fontWeight: '600',
                                        cursor: canResend ? 'pointer' : 'not-allowed',
                                        padding: 0,
                                        fontSize: 'inherit',
                                    }}
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </div>

                        <div className="auth-footer">
                            <button
                                type="button"
                                onClick={() => { setStep(1); setErrors({}); }}
                                className="auth-back-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
                            >
                                <ArrowLeft size={16} />
                                <span>Try another email</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Step 1: Email Input
    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <div className="auth-logo-icon">O</div>
                            <span className="auth-logo-text">OrbitDesk</span>
                        </div>
                        <h1 className="auth-title">Forgot password?</h1>
                        <p className="auth-subtitle">
                            No worries, we'll send you a verification code
                        </p>
                    </div>

                    <form className="auth-form" onSubmit={handleSendOtp}>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            icon={Mail}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors(prev => ({ ...prev, email: null }));
                            }}
                            error={errors.email}
                            required
                        />

                        <Button type="submit" fullWidth loading={loading}>
                            Send OTP
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <Link to="/login" className="auth-back-link">
                            <ArrowLeft size={16} />
                            <span>Back to login</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
