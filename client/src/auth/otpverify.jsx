import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheckIcon } from 'lucide-react'
import AuthLayout from '../Components/elements/authlayout'
import Button from '../Components/elements/button'
import verifyImage from '../Assets/OTPverify.png'

const OTPVerify = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const inputRefs = useRef([])
    const [timer, setTimer] = useState(30)
    const [canResend, setCanResend] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };


    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            setOtp(digits);
            inputRefs.current[5].focus();
        }
    };

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

    const handleResendCode = () => {
        if (canResend) {
            setOtp(['', '', '', '', '', ''])
            setTimer(30)
            setCanResend(false)
            inputRefs.current[0].focus()
        }
    }

    const handleVerify = () => {
        const enteredOtp = otp.join('')
        if (enteredOtp.length === 6) {
            navigate('/reset-password')
        } else {
            alert('Please enter the complete 6-digit OTP')
        }
    }

    return (
        <AuthLayout
            title="Verify Your Account"
            subtitle="Enter the verification code sent to your email"
            illustration={
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <img src={verifyImage} alt="Security Verification" width={150} />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold">Security First</h2>
                    <p className="text-center text-emerald-50">
                        We've sent a 6-digit verification code to your email address to
                        ensure your account security.
                    </p>
                </div>
            }
        >
            <div className="space-y-6 px-4 sm:px-6 md:px-8">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Verification Code
                    </label>
                    <div className="flex flex-wrap justify-center gap-4 max-w-sm xsss:grid xsss:grid-cols-6 xss:grid-cols-6 xs:grid-cols-6 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6">                        {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className="w-12 h-12 text-center text-xl font-semibold border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            type="text"
                            maxLength={1}
                            pattern="[0-9]"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                        />
                    ))}
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-slate-600">
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={!canResend}
                            className={`font-medium ${canResend ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-400'}`}
                        >
                            Resend {!canResend && `(${timer}s)`}
                        </button>
                    </p>
                </div>

                <Button
                    fullWidth
                    onClick={handleVerify}
                    disabled={otp.some((digit) => digit === '')}
                    className="flex items-center justify-center space-x-2"
                >
                    <ShieldCheckIcon className="h-5 w-5" />
                    <span>Verify OTP</span>
                </Button>

                <div className="text-center text-sm">
                    <Link
                        to="/login"
                        className="font-medium text-emerald-600 hover:text-emerald-700"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )
}

export default OTPVerify