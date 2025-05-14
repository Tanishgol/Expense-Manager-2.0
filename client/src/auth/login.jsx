import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, LockIcon, LogIn, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../Components/elements/authlayout';
import Input from '../Components/elements/input';
import Button from '../Components/elements/button';
import Checkbox from '../Components/elements/checkbox';
import savingmoney from '../Assets/save-money-login.png'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue"
            illustration={
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <img src={savingmoney} alt="Icon of Saving Money" width={150} />
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        icon={<LockIcon className="h-5 w-5" />}
                        className="pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {password && (
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-10 text-slate-500 hover:text-slate-700"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <Checkbox label="Remember me" id="remember-me" />
                    <Link to="/email-verification" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                        Forgot password?
                    </Link>
                </div>

                <Button fullWidth className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                    <LogIn className="h-5 w-5" />
                    <span className="text-sm font-semibold">Sign in</span>
                </Button>


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