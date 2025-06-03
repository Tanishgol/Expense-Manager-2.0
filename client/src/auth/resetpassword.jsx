import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { EyeIcon, EyeOffIcon, LockIcon, ShieldCheckIcon, CheckIcon, CircleX } from 'lucide-react'
import AuthLayout from '../Components/elements/authlayout'
import Button from '../Components/elements/button'
import resetPasswordImage from '../Assets/reset-password-icon.png'
import { toast } from 'react-hot-toast'

function evaluatePasswordStrength(password) {
    let score = 0;
    let feedback = '';

    // Check length
    if (password.length >= 8) score += 2;
    else if (password.length >= 6) score += 1;

    // Check character types
    if (/[a-z]/.test(password)) score += 2; // Lowercase
    if (/[A-Z]/.test(password)) score += 2; // Uppercase
    if (/[0-9]/.test(password)) score += 2; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 2; // Special characters

    // Convert score to strength level (1-4)
    let strength = Math.min(4, Math.ceil(score / 2.5));

    // Generate feedback
    if (score < 4) {
        feedback = 'Too weak: add more variety';
        strength = 1;
    } else {
        const missing = [];
        if (password.length < 8) missing.push('length (8+ chars)');
        if (!/[A-Z]/.test(password)) missing.push('uppercase');
        if (!/[a-z]/.test(password)) missing.push('lowercase');
        if (!/[0-9]/.test(password)) missing.push('numbers');
        if (!/[^A-Za-z0-9]/.test(password)) missing.push('special chars');

        if (missing.length > 0) {
            if (strength <= 2) {
                feedback = `Basic: add ${missing[0]}`;
            } else {
                feedback = `Medium: add ${missing[0]} to strengthen`;
            }
        } else {
            feedback = 'Strong password';
        }
    }

    return { strength, feedback };
}

function getStrengthColor(strength) {
    switch (strength) {
        case 1:
            return 'bg-red-500';
        case 2:
            return 'bg-orange-500';
        case 3:
            return 'bg-yellow-500';
        case 4:
            return 'bg-green-500';
        default:
            return 'bg-gray-300';
    }
}

const OTP_EXPIRY_TIME = 60; // 60 seconds

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [checkedOtp, setCheckedOtp] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [strengthFeedback, setStrengthFeedback] = useState('')
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()

    const { state } = location
    const otp = state?.otp
    const email = state?.email
    const otpVerifiedAt = state?.otpVerifiedAt

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        const { strength, feedback } = evaluatePasswordStrength(value);
        setPasswordStrength(strength);
        setStrengthFeedback(feedback);

        if (confirmPassword) {
            setPasswordsMatch(confirmPassword === value);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setPasswordsMatch(password === value);
    };

    useEffect(() => {
        if (!otp || !email || !otpVerifiedAt) {
            navigate('/email-verification')
        } else {
            // Check if OTP verification time is within expiry window
            const isOtpValid = Date.now() - otpVerifiedAt < OTP_EXPIRY_TIME * 1000;
            if (!isOtpValid) {
                toast.error('Your session has expired. Please verify your email again.');
                navigate('/email-verification');
                return;
            }
            setCheckedOtp(true)
        }
    }, [otp, email, otpVerifiedAt, navigate])

    if (!checkedOtp) {
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (passwordStrength < 3) {
            toast.error('Please choose a stronger password')
            return
        }

        setIsLoading(true)

        try {
            console.log('Sending reset password request:', { email, otp });
            const response = await fetch('http://localhost:9000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    otp,
                    email,
                    newPassword: password,
                }),
            })

            const data = await response.json()
            console.log('Reset password response:', { status: response.status, data });

            if (response.ok) {
                toast.success('Password reset successful')
                navigate('/login')
            } else {
                // Handle specific error cases
                if (data.message === 'Invalid or expired OTP') {
                    toast.error('Your OTP has expired. Please request a new one.')
                    navigate('/email-verification')
                } else if (data.message === 'Invalid email') {
                    toast.error('Invalid email address. Please try again.')
                    navigate('/email-verification')
                } else if (data.message === 'User not found') {
                    toast.error('User not found. Please check your email address.')
                    navigate('/email-verification')
                } else {
                    toast.error(data.message || 'Failed to reset password')
                }
            }
        } catch (error) {
            console.error('Reset password error:', error);

            if (!navigator.onLine) {
                toast.error('No internet connection. Please check your network and try again.');
            } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
                toast.error('Unable to connect to the server. Please check if the server is running.');
            } else {
                toast.error('An error occurred while resetting your password. Please try again.');
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Reset Your Password"
            subtitle="Enter your new password"
            illustration={
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <img src={resetPasswordImage} alt="Reset Password" width={150} />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold">Secure Reset</h2>
                    <p className="text-center text-emerald-50">
                        Choose a strong password to keep your account secure.
                    </p>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={handlePasswordChange}
                                className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:outline-none ${passwordStrength >= 3 ? 'border-emerald-500 focus:ring-emerald-500' : 'border-slate-300 focus:ring-slate-300'}`}
                                aria-describedby="passwordStrength"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-500"
                            >
                                {showPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
                            </span>
                        </div>
                        {password && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 w-full rounded ${i < passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-600" id="passwordStrength">
                                    {passwordStrength === 4 ? (
                                        <span className="flex items-center text-emerald-600">
                                            <CheckIcon className="mr-1 h-3 w-3" /> {strengthFeedback}
                                        </span>
                                    ) : strengthFeedback}
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                required
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:outline-none ${confirmPassword && !passwordsMatch ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-emerald-500'}`}
                                aria-describedby="confirmPasswordError"
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-500"
                            >
                                {showConfirmPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
                            </span>
                        </div>
                        {confirmPassword && !passwordsMatch && (
                            <p className="text-xs text-red-600 mt-1" id="confirmPasswordError">
                                <span className="flex items-center">
                                    <CircleX className="mr-1 h-3 w-3" />
                                    Passwords don't match
                                </span>
                            </p>
                        )}

                        {confirmPassword && passwordsMatch && (
                            <p className="text-xs text-emerald-600 mt-1">
                                <span className="flex items-center">
                                    <CheckIcon className="mr-1 h-3 w-3" />
                                    Passwords match
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    fullWidth
                    disabled={isLoading || passwordStrength < 3 || !confirmPassword || !passwordsMatch}
                    className="flex items-center justify-center gap-2"
                >
                    <ShieldCheckIcon className="h-5 w-5" />
                    <span>{isLoading ? 'Resetting...' : 'Reset Password'}</span>
                </Button>
            </form>
        </AuthLayout>
    )
}

export default ResetPassword