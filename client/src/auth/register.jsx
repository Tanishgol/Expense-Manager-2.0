import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, MailIcon, LockIcon, CheckIcon } from 'lucide-react';
import AuthLayout from '../Components/elements/authlayout';
import Input from '../Components/elements/input';
import Button from '../Components/elements/button';
import Checkbox from '../Components/elements/checkbox';
import savingmoney from '../Assets/save-money-register.png';

export function Register() {
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Simple password strength logic
        let strength = 0;
        if (value.length > 6) strength += 1;
        if (/[A-Z]/.test(value)) strength += 1;
        if (/[0-9]/.test(value)) strength += 1;
        if (/[^A-Za-z0-9]/.test(value)) strength += 1;
        setPasswordStrength(strength);
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Sign up to start managing your finances"
            illustration={
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <img src={savingmoney} alt="Icon of Saving Money" width={152} />
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
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        icon={<LockIcon className="h-5 w-5" />}
                        value={password}
                        onChange={handlePasswordChange}
                        success={passwordStrength >= 3}
                    />
                    {password && (
                        <div className="mt-1">
                            <div className="mb-1 flex">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 w-full ${i < passwordStrength ? 'bg-emerald-500' : 'bg-slate-200'} ${i > 0 ? 'ml-1' : ''
                                            }`}
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
                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    required
                    icon={<LockIcon className="h-5 w-5" />}
                />
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
                    />
                </div>
                <Button fullWidth>Create Account</Button>
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