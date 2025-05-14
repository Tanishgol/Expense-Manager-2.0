import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, KeyIcon } from 'lucide-react';
import AuthLayout from '../Components/elements/authlayout';
import Input from '../Components/elements/input';
import Button from '../Components/elements/button';

export function ForgotPassword() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email and we'll send you a link to reset your password"
            illustration={
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <svg
                            width="180"
                            height="180"
                            viewBox="0 0 200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect x="60" y="70" width="80" height="60" rx="8" fill="#10B981" />
                            <rect x="73" y="80" width="54" height="8" rx="4" fill="#F0FDFA" />
                            <rect x="73" y="94" width="54" height="8" rx="4" fill="#F0FDFA" />
                            <rect x="73" y="108" width="54" height="8" rx="4" fill="#F0FDFA" />
                            <circle cx="140" cy="70" r="25" fill="#064E3B" />
                            <rect x="130" y="60" width="20" height="30" rx="4" fill="#10B981" />
                            <rect x="135" y="50" width="10" height="15" rx="2" fill="#10B981" />
                            <rect x="135" y="65" width="10" height="5" rx="2.5" fill="#F0FDFA" />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold">Secure Recovery</h2>
                    <p className="text-center text-emerald-50">
                        We'll help you reset your password safely and get back to managing
                        your finances quickly.
                    </p>
                </div>
            }
        >
            {!submitted ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        icon={<MailIcon className="h-5 w-5" />}
                    />
                    <Button type="submit" fullWidth>
                        Send Reset Link
                    </Button>
                    <div className="text-center text-sm">
                        Remember your password?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-emerald-600 hover:text-emerald-700"
                        >
                            Back to login
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="rounded-lg bg-emerald-50 p-4 text-center">
                    <div className="mb-2 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <MailIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-emerald-800">
                        Check your inbox
                    </h3>
                    <p className="mb-4 text-emerald-700">
                        We've sent a password reset link to your email address.
                    </p>
                    <Button variant="outline" fullWidth onClick={() => setSubmitted(false)}>
                        Didn't receive an email? Try again
                    </Button>
                    <div className="mt-4 text-center text-sm">
                        <Link
                            to="/login"
                            className="font-medium text-emerald-600 hover:text-emerald-700"
                        >
                            Back to login
                        </Link>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}

export default ForgotPassword;