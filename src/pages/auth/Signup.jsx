import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building, ArrowRight, Phone, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signupUser, loginUser, selectAuthLoading, clearAuthError } from '../../store/slices/authSlice';
import { countryCodes } from '../../utils/countryCodes';
import { toast } from 'react-hot-toast';
import './Auth.css';

export function Signup() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        countryCode: '+91',
        password: '',
        confirmPassword: '',
        gender: '',
    });

    // Sort country codes by name or keep as is (list is alphabetical)
    // We can use countryCodes directly.

    const handleChange = (field) => (e) => {
        let value = e.target.value;

        // Special handling for phone to allow only numbers and max 10
        if (field === 'phone') {
            // Remove any non-numeric characters
            value = value.replace(/\D/g, '');
            // Limit to 10 digits
            if (value.length > 10) {
                return; // Ignore input if more than 10
            }
        }

        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleBlur = (field) => () => {
        const newErrors = { ...errors };
        // Validate specific field
        switch (field) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!formData.email) {
                    newErrors.email = 'Email is required';
                } else if (!emailRegex.test(formData.email)) {
                    newErrors.email = 'Please enter a valid email address';
                } else {
                    delete newErrors.email;
                }
                break;
            case 'name':
                if (!formData.name.trim()) {
                    newErrors.name = 'Full name is required';
                } else {
                    delete newErrors.name;
                }
                break;
            case 'phone':
                if (!formData.phone) {
                    newErrors.phone = 'Phone number is required';
                } else if (!/^\d{10}$/.test(formData.phone)) {
                    newErrors.phone = 'Please enter a valid 10-digit phone number';
                } else {
                    delete newErrors.phone;
                }
                break;
            case 'password':
                if (!formData.password) {
                    newErrors.password = 'Password is required';
                } else if (formData.password.length < 8) {
                    newErrors.password = 'Password must be at least 8 characters long';
                } else {
                    delete newErrors.password;
                }
                break;
            case 'confirmPassword':
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10,15}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        dispatch(clearAuthError());
        try {
            // Include user selected country code and phone
            await dispatch(signupUser({ ...formData })).unwrap();

            // Auto login after successful signup
            await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
            navigate('/dashboard');
        } catch (errorMessage) {
            toast.error(errorMessage);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <div className="auth-logo-icon">S</div>
                            <span className="auth-logo-text">SupportDesk</span>
                        </div>
                        <h1 className="auth-title">Create your account</h1>
                        <p className="auth-subtitle">Start your 14-day free trial</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Enter your name"
                            icon={User}
                            value={formData.name}
                            onChange={handleChange('name')}
                            onBlur={handleBlur('name')}
                            error={errors.name}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            icon={Mail}
                            value={formData.email}
                            onChange={handleChange('email')}
                            onBlur={handleBlur('email')}
                            error={errors.email}
                            required
                        />

                        <div className="phone-input-group" style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ width: '120px' }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500 }}>Code</label>
                                <select
                                    className="select-field"
                                    value={formData.countryCode}
                                    onChange={handleChange('countryCode')}
                                    style={{ height: '42px' }}
                                >
                                    {countryCodes.map(country => (
                                        <option key={country.code} value={country.callingCode}>
                                            {country.code} ({country.callingCode})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    icon={Phone}
                                    value={formData.phone}
                                    onChange={handleChange('phone')}
                                    onBlur={handleBlur('phone')}
                                    error={errors.phone}
                                    required
                                />
                            </div>
                        </div>

                        <Select
                            label="Gender"
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' }
                            ]}
                            value={formData.gender}
                            onChange={handleChange('gender')}
                            required
                        />

                        <Input
                            label="Company Name"
                            type="text"
                            placeholder="Enter your company name"
                            icon={Building}
                            value={formData.company}
                            onChange={handleChange('company')}
                        />

                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            icon={Lock}
                            value={formData.password}
                            onChange={handleChange('password')}
                            onBlur={handleBlur('password')}
                            hint="Minimum 8 characters"
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
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            icon={Lock}
                            value={formData.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
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

                        <Button type="submit" fullWidth loading={loading} icon={ArrowRight} iconPosition="right">
                            Create Account
                        </Button>
                    </form>

                    <p className="auth-terms">
                        By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </p>

                    <div className="auth-footer">
                        <span>Already have an account?</span>
                        <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
