import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailIcon, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthLayout from '../Components/elements/authlayout';
import Input from '../Components/elements/input';
import Button from '../Components/elements/button';
import emailverification from '../Assets/email-verification-icon.png';

export function EmailVerification() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter an email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:9000/api/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email.trim()
                })
            });

            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                toast.error('Invalid response from server');
                return;
            }

            if (!response.ok) {
                toast.error(data?.message || 'Email verification failed');
                return;
            }

            if (data?.exists === false) {
                toast.error('Email not found');
                return;
            }

            toast.success('OTP sent successfully');
            navigate('/verify-otp', { state: { email } });
        } catch (error) {
            toast.error('Unable to connect to server. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Email Verification"
            subtitle="Enter your email and we'll send you a link to reset your password"
            illustration={
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <img src={emailverification} alt="Icon of emailverification" width={150} />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-white">Email Verification</h2>
                    <p className="text-center text-emerald-50">
                        We'll send a verification code to your email address to ensure it's you.
                    </p>
                </div>
            }
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    icon={<MailIcon className="h-5 w-5" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-emerald-400 dark:bg-dark-card"
                />
                <Button 
                    type="submit" 
                    fullWidth 
                    className="flex items-center justify-center gap-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600"
                    disabled={isLoading}
                >
                    <MessageCircle className="h-5 w-5" />
                    <span>{isLoading ? 'Sending...' : 'Send Verification Code'}</span>
                </Button>
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Remember your password?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                        Back to login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}

export default EmailVerification;