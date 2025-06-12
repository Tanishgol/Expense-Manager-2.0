import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheckIcon } from 'lucide-react'
import AuthLayout from '../Components/elements/authlayout'
import Button from '../Components/elements/button'
import verifyImage from '../Assets/OTPverify.png'
import { toast } from 'react-hot-toast'

const OTP_EXPIRY_TIME = 300; // 5 minutes in seconds
const RESEND_DELAY = 60; // 60 seconds

const OTPVerify = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const inputRefs = useRef([])
    const [timer, setTimer] = useState(RESEND_DELAY)
    const [expiryTimer, setExpiryTimer] = useState(OTP_EXPIRY_TIME)
    const [canResend, setCanResend] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [otpGeneratedAt, setOtpGeneratedAt] = useState(Date.now())
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email

    useEffect(() => {
        if (!email) {
            navigate('/email-verification')
        }
    }, [email, navigate])

    // Timer for OTP expiry
    useEffect(() => {
        const interval = setInterval(() => {
            const timeLeft = Math.max(0, Math.floor((otpGeneratedAt + OTP_EXPIRY_TIME * 1000 - Date.now()) / 1000));
            setExpiryTimer(timeLeft);

            if (timeLeft === 0) {
                toast.error('OTP has expired. Please request a new one.');
                setOtp(['', '', '', '', '', '']);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [otpGeneratedAt]);

    // Timer for resend button
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(interval)
        } else {
            setCanResend(true)
        }
    }, [timer])

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Format time remaining for display
    const formatTimeRemaining = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleResendCode = async () => {
        if (!canResend) return;

        setIsVerifying(true);
        try {
            const response = await fetch('http://localhost:9000/api/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to send new OTP');
            }

            const data = await response.json();
            toast.success('New OTP sent successfully');
            setOtp(['', '', '', '', '', '']);
            setTimer(RESEND_DELAY);
            setCanResend(false);
            setOtpGeneratedAt(Date.now());
            setExpiryTimer(OTP_EXPIRY_TIME);
            inputRefs.current[0]?.focus();
        } catch (error) {
            toast.error(error.message || 'Failed to send new OTP. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerify = async () => {
        const enteredOtp = otp.join('')
        if (enteredOtp.length === 6) {
            // Check if OTP has expired
            if (Date.now() > otpGeneratedAt + OTP_EXPIRY_TIME * 1000) {
                toast.error('OTP has expired. Please request a new one.');
                setOtp(['', '', '', '', '', '']);
                return;
            }

            setIsVerifying(true);
            try {
                console.log('Sending OTP verification request:', { email, otp: enteredOtp });
                const response = await fetch('http://localhost:9000/api/verify-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        otp: enteredOtp
                    }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to verify OTP');
                }

                const data = await response.json();
                console.log('OTP verification response:', { status: response.status, data });

                toast.success('OTP verified successfully');
                navigate('/reset-password', {
                    state: {
                        otp: enteredOtp,
                        email: email,
                        otpVerifiedAt: Date.now()
                    }
                });
            } catch (error) {
                console.error('OTP verification error:', error);

                if (!navigator.onLine) {
                    toast.error('No internet connection. Please check your network and try again.');
                } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
                    toast.error('Unable to connect to the server. Please check if the server is running.');
                } else {
                    toast.error(error.message || 'An error occurred while verifying OTP. Please try again.');
                }
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            } finally {
                setIsVerifying(false);
            }
        } else {
            toast.error('Please enter the complete 6-digit OTP');
        }
    };

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, '');
        if (!value) return;

        const newOtp = [...otp];

        if (otp.every((digit) => digit === '') && index !== 0) {
            newOtp[index] = value;
            setOtp(newOtp);
            setTimeout(() => {
                setOtp(prev => {
                    const resetOtp = [...prev];
                    resetOtp[index] = '';
                    resetOtp[0] = value;
                    return resetOtp;
                });
                inputRefs.current[1]?.focus();
            }, 0);
            return;
        }

        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < otp.length - 1) {
            e.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            setOtp(digits);
            setTimeout(() => inputRefs.current[5]?.focus(), 10);
        }
    };

    return (
        <AuthLayout
            title="Verify Your Account"
            subtitle="Enter the verification code sent to your email"
            illustration={
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <img src={verifyImage} alt="Security Verification" width={150} />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-white">Security First</h2>
                    <p className="text-center text-emerald-50">
                        We've sent a 6-digit verification code to your email address to
                        ensure your account security.
                    </p>
                </div>
            }
        >
            <div className="space-y-6 px-4 sm:px-6 md:px-8">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Verification Code
                        </label>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Expires in: {formatTimeRemaining(expiryTimer)}
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 max-w-sm xsss:grid xsss:grid-cols-6 xss:grid-cols-6 xs:grid-cols-6 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="w-12 h-12 text-center text-xl font-semibold border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 dark:bg-dark-card dark:text-white"
                                type="text"
                                maxLength={1}
                                pattern="[0-9]"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                disabled={isVerifying}
                            />
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={!canResend || isVerifying}
                            className={`font-medium ${canResend ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300' : 'text-slate-400 dark:text-slate-500'}`}
                        >
                            Resend {!canResend && (`${timer}s`)}
                        </button>
                    </p>
                </div>

                <Button
                    fullWidth
                    onClick={handleVerify}
                    disabled={otp.some((digit) => digit === '') || isVerifying || expiryTimer === 0}
                    className="flex items-center justify-center space-x-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600"
                >
                    <ShieldCheckIcon className="h-5 w-5" />
                    <span>{isVerifying ? 'Verifying...' : 'Verify OTP'}</span>
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <Link
                        to="/login"
                        className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        </AuthLayout >
    )
}

export default OTPVerify