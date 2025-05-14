import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, LockIcon, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../Components/elements/authlayout';
import Input from '../Components/elements/input';
import Button from '../Components/elements/button';
import Checkbox from '../Components/elements/checkbox';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue"
            illustration={
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="40" y="60" width="120" height="80" rx="8" fill="#10B981" />
                            <rect x="40" y="80" width="120" height="20" fill="#064E3B" />
                            <circle cx="130" cy="100" r="15" fill="#F0FDFA" />
                            <circle cx="130" cy="100" r="10" fill="#ECFDF5" />
                            <rect x="50" y="110" width="60" height="8" rx="2" fill="#F0FDFA" />
                            <rect x="50" y="124" width="40" height="6" rx="2" fill="#F0FDFA" />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold">Secure Access</h2>
                    <p className="text-center text-emerald-50">
                        Log in to manage your finances with confidence. Your financial data
                        is protected with industry-standard encryption.
                    </p>
                </div>
            }
        >
            <form className="space-y-6">
                <Input
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    icon={<MailIcon className="h-5 w-5" />}
                />

                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        icon={<LockIcon className="h-5 w-5" />}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-10 text-slate-500 hover:text-slate-700"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>


                <Button fullWidth>Sign in</Button>

                <div className="text-center text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-700">
                        Create one now
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;