import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, MailIcon, LockIcon, CheckIcon, EyeIcon, EyeOffIcon, UserPlus } from 'lucide-react';
import AuthLayout from '../Components/elements/authlayout';
import Input from '../Components/elements/input';
import Button from '../Components/elements/button';
import Checkbox from '../Components/elements/checkbox';
import savingmoney from '../Assets/save-money-register.png';

export function Register() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        let strength = 0;
        if (value.length > 6) strength += 1;
        if (/[A-Z]/.test(value)) strength += 1;
        if (/[0-9]/.test(value)) strength += 1;
        if (/[^A-Za-z0-9]/.test(value)) strength += 1;
        setPasswordStrength(strength);

        if (confirmPassword) {
            setPasswordsMatch(confirmPassword === value);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setPasswordsMatch(password === value);
    };

    const getStrengthColor = (index) => {
        const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
        return index < passwordStrength ? colors[passwordStrength - 1] : 'bg-slate-200';
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Sign up to start managing your finances"
            illustration={
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <img src={savingmoney} alt="Icon of Saving Money" width={150} />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold">Start Saving Today</h2>
                    <p className="text-center text-emerald-50">
                        Create your account to track expenses, manage budgets, and reach your financial goals faster.
                    </p>
                </div>
            }
        >
            <form className="space-y-6">
                <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Smith"
                    required
                    icon={<UserIcon className="h-5 w-5" />}
                />
                <Input
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    icon={<MailIcon className="h-5 w-5" />}
                />
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
                                        className={`h-1.5 w-full rounded ${getStrengthColor(i)}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-slate-600">
                                {passwordStrength < 2 && 'Add uppercase, numbers or special characters'}
                                {passwordStrength >= 2 && passwordStrength < 3 && 'Getting better...'}
                                {passwordStrength >= 3 && (
                                    <span className="flex items-center text-emerald-600">
                                        <CheckIcon className="mr-1 h-3 w-3" /> Strong password
                                    </span>
                                )}
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
                        />
                        <span
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-500"
                        >
                            {showConfirmPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
                        </span>
                    </div>
                    {confirmPassword && !passwordsMatch && (
                        <p className="text-xs text-red-600 mt-1">Passwords don't match</p>
                    )}
                </div>

                <div>
                    <Checkbox
                        label={
                            <span>
                                I agree to the{' '}
                                <Link to="/terms" className="font-medium text-emerald-600 hover:text-emerald-700">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="font-medium text-emerald-600 hover:text-emerald-700">
                                    Privacy Policy
                                </Link>
                            </span>
                        }
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                </div>

                <Button fullWidth className="flex items-center justify-center gap-2"
                    disabled={!acceptedTerms || !passwordsMatch || passwordStrength < 2}>
                    <UserPlus className="h-5 w-5" />
                    <span>Create Account</span>
                </Button>
                <div className="text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
                        Sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}

export default Register;