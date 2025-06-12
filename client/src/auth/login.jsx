import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MailIcon, LockIcon, LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../Components/elements/authlayout';
import Input from '../Components/elements/input';
import Button from '../Components/elements/button';
import Checkbox from '../Components/elements/checkbox';
import savingmoney from '../Assets/save-money-login.png';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }

        try {
            const res = await fetch('http://localhost:9000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user, data.token);
                toast.success('Login successful!');
                
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            } else {
                if (data?.message === 'Email not found') {
                    toast.error('Email not found');
                } else if (data?.message === 'Invalid credentials') {
                    toast.error('Invalid credentials');
                } else if (data?.message === 'Password is incorrect') {
                    toast.error('Password is incorrect');
                } else {
                    toast.error(data.message || 'Login failed, please try again');
                }
            }
        } catch (err) {
            toast.error('Something went wrong. Please check your network or try again later.');
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue"
            illustration={
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <img src={savingmoney} alt="Icon of Saving Money" width={150} />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-white">Secure Access</h2>
                    <p className="text-center text-emerald-50">
                        Log in to manage your finances with confidence. Your financial data
                        is protected with industry-standard encryption.
                    </p>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    icon={<MailIcon className="h-5 w-5" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-emerald-400 dark:bg-dark-card"
                />
                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        icon={<LockIcon className="h-5 w-5" />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-emerald-400 dark:bg-dark-card pr-10"
                    />
                    {password && (
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none focus:ring-0"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <Checkbox label="Remember me" id="remember-me" />
                    <Link
                        to="/email-verification"
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:text-dark:text-white dark:hover:text-emerald-300 dark:focus:ring-emerald-300 dark:focus:ring-offset-gray-900"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    fullWidth
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 dark:bg-emerald-500 text-white rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-opacity-50"
                >
                    <LogIn className="h-5 w-5" />
                    <span className="text-sm font-semibold">Sign in</span>
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                        Create one now
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;