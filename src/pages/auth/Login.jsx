import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, selectAuthLoading, clearAuthError } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';

export function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});

    const handleBlur = (field) => () => {
        const newErrors = { ...errors };
        switch (field) {
            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email) {
                    newErrors.email = 'Email is required';
                } else if (!emailRegex.test(email)) {
                    newErrors.email = 'Please enter a valid email address';
                } else {
                    delete newErrors.email;
                }
                break;
            }
            case 'password': {
                if (!password) {
                    newErrors.password = 'Password is required';
                } else {
                    delete newErrors.password;
                }
                break;
            }
            default:
                break;
        }
        setErrors(newErrors);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: null }));
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        dispatch(clearAuthError());
        try {
            await dispatch(loginUser({ email, password })).unwrap();
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
            }}
        >
            <Box sx={{ width: '100%', maxWidth: 440 }}>
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
                            Welcome back
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Sign in to your account to continue
                        </Typography>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            icon={Mail}
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleBlur('email')}
                            error={errors.email}
                            required
                        />

                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            icon={Lock}
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handleBlur('password')}
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

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 2.5,
                                mt: -0.5,
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                        Remember me
                                    </Typography>
                                }
                            />
                            <Typography
                                component={Link}
                                to="/forgot-password"
                                variant="body2"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                Forgot password?
                            </Typography>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            loading={loading}
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            Sign In
                        </Button>
                    </Box>

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
                            Don't have an account?
                        </Typography>
                        <Typography
                            component={Link}
                            to="/signup"
                            variant="body2"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 600,
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            Sign up
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default Login;
