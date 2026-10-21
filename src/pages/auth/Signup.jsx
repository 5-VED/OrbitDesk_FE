import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MuiSelect from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Mail, Lock, User, Building, ArrowRight, Phone, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signupUser, loginUser, selectAuthLoading, clearAuthError } from '../../store/slices/authSlice';
import { countryCodes } from '../../utils/countryCodes';
import { toast } from 'react-hot-toast';

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

    const handleChange = (field) => (e) => {
        let value = e.target.value;

        if (field === 'phone') {
            value = value.replace(/\D/g, '');
            if (value.length > 10) {
                return;
            }
        }

        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleBlur = (field) => () => {
        const newErrors = { ...errors };
        switch (field) {
            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!formData.email) {
                    newErrors.email = 'Email is required';
                } else if (!emailRegex.test(formData.email)) {
                    newErrors.email = 'Please enter a valid email address';
                } else {
                    delete newErrors.email;
                }
                break;
            }
            case 'name': {
                if (!formData.name.trim()) {
                    newErrors.name = 'Full name is required';
                } else {
                    delete newErrors.name;
                }
                break;
            }
            case 'phone': {
                if (!formData.phone) {
                    newErrors.phone = 'Phone number is required';
                } else if (!/^\d{10}$/.test(formData.phone)) {
                    newErrors.phone = 'Please enter a valid 10-digit phone number';
                } else {
                    delete newErrors.phone;
                }
                break;
            }
            case 'password': {
                if (!formData.password) {
                    newErrors.password = 'Password is required';
                } else if (formData.password.length < 8) {
                    newErrors.password = 'Password must be at least 8 characters long';
                } else {
                    delete newErrors.password;
                }
                break;
            }
            case 'confirmPassword': {
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            }
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
            await dispatch(signupUser({ ...formData })).unwrap();
            await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
            navigate('/dashboard');
        } catch (errorMessage) {
            toast.error(errorMessage);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.default',
                p: { xs: 2, sm: 3 },
                py: { xs: 4, sm: 6 },
            }}
        >
            <Box sx={{ width: '100%', maxWidth: 480 }}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        boxShadow: 3,
                        backgroundColor: 'background.paper',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 3.5 }}>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1.5,
                                    backgroundColor: 'primary.main',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '1.25rem',
                                }}
                            >
                                O
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '1.25rem',
                                    color: 'text.primary',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                OrbitDesk
                            </Typography>
                        </Box>
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                color: 'text.primary',
                                mb: 0.75,
                            }}
                        >
                            Create your account
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Start your 14-day free trial
                        </Typography>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
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

                        {/* Country code + phone */}
                        <Box sx={{ display: 'flex', gap: 1.5, mb: 0 }}>
                            <Box sx={{ width: 130 }}>
                                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                    <FormLabel sx={{ mb: 0.75, fontSize: '0.875rem', fontWeight: 500 }}>
                                        Code
                                    </FormLabel>
                                    <MuiSelect
                                        value={formData.countryCode}
                                        onChange={handleChange('countryCode')}
                                        size="small"
                                        sx={{ borderRadius: 1 }}
                                    >
                                        {countryCodes.map(country => (
                                            <MenuItem key={country.code} value={country.callingCode}>
                                                {country.code} ({country.callingCode})
                                            </MenuItem>
                                        ))}
                                    </MuiSelect>
                                </FormControl>
                            </Box>
                            <Box sx={{ flex: 1 }}>
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
                            </Box>
                        </Box>

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
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            icon={Lock}
                            value={formData.password}
                            onChange={handleChange('password')}
                            onBlur={handleBlur('password')}
                            hint="Minimum 8 characters"
                            error={errors.password}
                            required
                            suffix={
                                <IconButton
                                    size="small"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    aria-label="toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </IconButton>
                            }
                        />

                        <Input
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            icon={Lock}
                            value={formData.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            error={errors.confirmPassword}
                            required
                            suffix={
                                <IconButton
                                    size="small"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                    aria-label="toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </IconButton>
                            }
                        />

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            loading={loading}
                            icon={ArrowRight}
                            iconPosition="right"
                            sx={{ mt: 1 }}
                        >
                            Create Account
                        </Button>
                    </Box>

                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            color: 'text.tertiary',
                            textAlign: 'center',
                            mt: 2,
                            '& a': { color: 'primary.main', textDecoration: 'none' },
                            '& a:hover': { textDecoration: 'underline' },
                        }}
                    >
                        By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </Typography>

                    {/* Footer */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.75,
                            mt: 3,
                            pt: 2.5,
                            borderTop: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Already have an account?
                        </Typography>
                        <Typography
                            component={Link}
                            to="/login"
                            variant="body2"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 600,
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            Sign in
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default Signup;
