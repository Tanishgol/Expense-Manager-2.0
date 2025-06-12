import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, MailIcon, CircleX, CheckIcon, EyeIcon, EyeOffIcon, UserPlus } from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../Components/elements/authlayout';
import Input from '../Components/elements/input';
import Button from '../Components/elements/button';
import Checkbox from '../Components/elements/checkbox';
import savingmoney from '../Assets/save-money-register.png';

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

export function Register() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [strengthFeedback, setStrengthFeedback] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const navigate = useNavigate();

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setPasswordsMatch(password === value);
    };

    const handleFullNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setFullName(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!acceptedTerms || !passwordsMatch || passwordStrength < 2) {
            setError('Please complete all fields correctly.');
            return;
        }

        const userData = {
            fullName,
            email,
            password,
        };

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:9000/api/register', userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setTimeout(() => {
                navigate('/login');
            }, 1000);

        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred while registering. Please try again.');
            }
        } finally {
            setLoading(false);
        }
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
                    <h2 className="mb-2 text-2xl font-bold text-white">Start Saving Today</h2>
                    <p className="text-center text-emerald-50">
                        Create your account to track expenses, manage budgets, and reach your financial goals faster.
                    </p>
                </div>
            }
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                    label="Full Name"
                    type="text"
                    placeholder="User Name"
                    required
                    icon={<UserIcon className="h-5 w-5" />}
                    value={fullName}
                    onChange={handleFullNameChange}
                    className="block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-emerald-400 dark:bg-dark-card"
                />
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

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:outline-none dark:text-white dark:bg-dark-card dark:border-dark-border ${passwordStrength >= 3 ? 'border-emerald-500 focus:ring-emerald-500 dark:border-emerald-400 dark:focus:ring-emerald-400' : 'border-slate-300 focus:ring-slate-300 dark:border-slate-600 dark:focus:ring-slate-600'}`}
                            aria-describedby="passwordStrength"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-500 dark:text-slate-400"
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
                                        className={`h-1.5 w-full rounded ${i < passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-300 dark:bg-gray-600'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400" id="passwordStrength">
                                {passwordStrength === 4 ? (
                                    <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                                        <CheckIcon className="mr-1 h-3 w-3" /> {strengthFeedback}
                                    </span>
                                ) : strengthFeedback}
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:outline-none dark:text-white dark:bg-dark-card dark:border-dark-border ${confirmPassword && !passwordsMatch ? 'border-red-500 focus:ring-red-400 dark:border-red-400 dark:focus:ring-red-300' : 'border-slate-300 focus:ring-emerald-500 dark:border-slate-600 dark:focus:ring-emerald-400'}`}
                            aria-describedby="confirmPasswordError"
                        />
                        <span
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-500 dark:text-slate-400"
                        >
                            {showConfirmPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
                        </span>
                    </div>
                    {confirmPassword && !passwordsMatch && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1" id="confirmPasswordError">
                            <span className="flex items-center">
                                <CircleX className="mr-1 h-3 w-3" />
                                Passwords don't match
                            </span>
                        </p>
                    )}

                    {confirmPassword && passwordsMatch && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                            <span className="flex items-center">
                                <CheckIcon className="mr-1 h-3 w-3" />
                                Passwords match
                            </span>
                        </p>
                    )}
                </div>

                <div>
                    <Checkbox
                        label={
                            <span className="text-slate-700 dark:text-slate-300">
                                I agree to the{' '}
                                <Link to="/terms" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                                    Privacy Policy
                                </Link>
                            </span>
                        }
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                </div>

                {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}

                <Button
                    fullWidth
                    className="flex items-center justify-center gap-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600"
                    disabled={!acceptedTerms || !passwordsMatch || passwordStrength < 2 || loading || !fullName || !email}
                >
                    {loading ? 'Registering...' : <UserPlus className="h-5 w-5" />}
                    <span>Create Account</span>
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                        Sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}

export default Register;