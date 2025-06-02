import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { CheckIcon, LockKeyhole, EyeIcon, EyeOffIcon, CircleX, LockIcon, ShieldCheckIcon } from 'lucide-react'
import AuthLayout from '../Components/elements/authlayout'
import Button from '../Components/elements/button'
import resetPasswordImage from '../Assets/reset-password-icon.png'
import { toast } from 'react-hot-toast'
import Input from '../Components/elements/input'

const ResetPassword = () => {
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!otp) {
            toast.error('Please enter the OTP sent to your email')
            return
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('http://localhost:9000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    otp,
                    newPassword: password,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Password reset successful')
                navigate('/login')
            } else {
                toast.error(data.message || 'Failed to reset password')
            }
        } catch (error) {
            console.error('Reset password error:', error)
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Reset Your Password"
            subtitle="Enter the OTP sent to your email and your new password"
            illustration={
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <img src={resetPasswordImage} alt="Reset Password" width={150} />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold">Secure Reset</h2>
                    <p className="text-center text-emerald-50">
                        Enter the OTP from your email and choose a new password.
                    </p>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <Input
                        label="Enter OTP"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        required
                        maxLength={6}
                        pattern="[0-9]{6}"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        disabled={isLoading}
                    />

                    <div className="relative">
                        <Input
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            icon={<LockIcon className="h-5 w-5" />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-10 text-slate-500 hover:text-slate-700"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOffIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <div className="relative">
                        <Input
                            label="Confirm New Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            icon={<LockIcon className="h-5 w-5" />}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-10 text-slate-500 hover:text-slate-700"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? (
                                <EyeOffIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    fullWidth
                    disabled={isLoading}
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