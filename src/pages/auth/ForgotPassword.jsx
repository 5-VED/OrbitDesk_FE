import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './Auth.css';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1000);
    };

    if (sent) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <div className="auth-success-icon">
                                <Send size={32} />
                            </div>
                            <h1 className="auth-title">Check your email</h1>
                            <p className="auth-subtitle">
                                We've sent password reset instructions to <strong>{email}</strong>
                            </p>
                        </div>

                        <Button variant="secondary" fullWidth onClick={() => setSent(false)}>
                            Try another email
                        </Button>

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

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <div className="auth-logo-icon">S</div>
                            <span className="auth-logo-text">SupportDesk</span>
                        </div>
                        <h1 className="auth-title">Forgot password?</h1>
                        <p className="auth-subtitle">
                            No worries, we'll send you reset instructions
                        </p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            icon={Mail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Button type="submit" fullWidth loading={loading}>
                            Send Reset Link
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
