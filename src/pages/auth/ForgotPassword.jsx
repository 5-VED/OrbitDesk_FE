import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { authService } from "../../features/auth/api/auth";
import { toast } from "react-hot-toast";

const OTP_LENGTH = 6;
const OTP_DURATION = 120;

export function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!emailRegex.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success("OTP sent to your email");
      setStep(2);
      setCountdown(OTP_DURATION);
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send OTP";
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
    setErrors((prev) => ({ ...prev, otp: null }));

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    otpRefs.current[focusIdx]?.focus();

    if (newOtp.every((d) => d !== "")) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleVerifyOtp = async (otpString) => {
    setLoading(true);
    setErrors({});
    try {
      const res = await authService.verifyOtp(email, otpString);
      toast.success("OTP verified");
      setResetToken(res.data.resetToken);
      setStep(3);
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid OTP";
      toast.error(msg);
      setErrors({ otp: msg });
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success("New OTP sent");
      setCountdown(OTP_DURATION);
      setOtp(Array(OTP_LENGTH).fill(""));
      setErrors({});
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await authService.resetPassword(resetToken, password);
      toast.success("Password reset successfully");
      setStep(4);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to reset password";
      toast.error(msg);
      setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  const logoBlock = (
    <Box
      sx={{ display: "inline-flex", alignItems: "center", gap: 1.25, mb: 2 }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          backgroundColor: "primary.main",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "1.25rem",
        }}
      >
        O
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          fontSize: "1.25rem",
          color: "text.primary",
          letterSpacing: "-0.02em",
        }}
      >
        OrbitDesk
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 440 }}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: "background.paper",
          }}
        >
          {/* Step 4: Success */}
          {step === 4 && (
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: (theme) => `${theme.palette.success.main}1A`,
                  color: "success.main",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2.5,
                }}
              >
                <CheckCircle size={32} />
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
              >
                Password Reset
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Your password has been reset successfully. You can now sign in
                with your new password.
              </Typography>
              <Button fullWidth size="lg" onClick={() => navigate("/login")}>
                Back to Sign In
              </Button>
            </Box>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <Box>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                {logoBlock}
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "text.primary", mb: 0.75 }}
                >
                  Set new password
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Enter your new password below
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleResetPassword}>
                <Input
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  icon={Lock}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  error={errors.password}
                  required
                  suffix={
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  }
                />

                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  icon={Lock}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: null }));
                  }}
                  error={errors.confirmPassword}
                  required
                  suffix={
                    <IconButton
                      size="small"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </IconButton>
                  }
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  sx={{ mt: 1 }}
                >
                  Reset Password
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                  pt: 2,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  component={Link}
                  to="/login"
                  variant="body2"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to login</span>
                </Typography>
              </Box>
            </Box>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <Box>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: (theme) =>
                      `${theme.palette.primary.main}1A`,
                    color: "primary.main",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <ShieldCheck size={28} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "text.primary", mb: 0.75 }}
                >
                  Verify OTP
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Enter the 6-digit code sent to <strong>{email}</strong>
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {otp.map((digit, i) => (
                  <Box
                    component="input"
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    disabled={loading}
                    sx={{
                      width: { xs: 40, sm: 48 },
                      height: { xs: 48, sm: 56 },
                      textAlign: "center",
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      fontFamily: "monospace",
                      borderRadius: 1.5,
                      outline: "none",
                      backgroundColor: "background.default",
                      color: "text.primary",
                      border: 2,
                      borderColor: errors.otp
                        ? "error.main"
                        : digit
                          ? "primary.main"
                          : "divider",
                      "&:focus": {
                        borderColor: "primary.main",
                        boxShadow: (theme) =>
                          `0 0 0 3px ${theme.palette.primary.main}26`,
                      },
                    }}
                  />
                ))}
              </Box>

              {errors.otp && (
                <Typography
                  variant="body2"
                  sx={{ color: "error.main", textAlign: "center", mb: 1.5 }}
                >
                  {errors.otp}
                </Typography>
              )}

              <Box sx={{ textAlign: "center", mb: 2 }}>
                {countdown > 0 ? (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Code expires in{" "}
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 600,
                        color: countdown <= 30 ? "error.main" : "primary.main",
                        fontFamily: "monospace",
                      }}
                    >
                      {formatTime(countdown)}
                    </Box>
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: "error.main", fontWeight: 500 }}
                  >
                    OTP has expired
                  </Typography>
                )}
              </Box>

              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Didn't receive the code?{" "}
                  <Box
                    component="button"
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || loading}
                    sx={{
                      background: "none",
                      border: "none",
                      color: canResend ? "primary.main" : "text.tertiary",
                      fontWeight: 600,
                      cursor: canResend ? "pointer" : "not-allowed",
                      p: 0,
                      fontSize: "inherit",
                      "&:hover": {
                        textDecoration: canResend ? "underline" : "none",
                      },
                    }}
                  >
                    Resend OTP
                  </Box>
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                  pt: 2,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setErrors({});
                  }}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    background: "none",
                    border: "none",
                    color: "text.secondary",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Try another email</span>
                </Box>
              </Box>
            </Box>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <Box>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                {logoBlock}
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "text.primary", mb: 0.75 }}
                >
                  Forgot password?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  No worries, we'll send you a verification code
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSendOtp}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  error={errors.email}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  sx={{ mt: 1 }}
                >
                  Send OTP
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                  pt: 2,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  component={Link}
                  to="/login"
                  variant="body2"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to login</span>
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
