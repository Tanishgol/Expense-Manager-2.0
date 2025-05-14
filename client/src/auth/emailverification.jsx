import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailIcon, MessageCircle } from 'lucide-react';
import AuthLayout from '../Components/elements/authlayout';
import Input from '../Components/elements/input';
import Button from '../Components/elements/button';
import emailverification from '../Assets/email-verification-icon.png';

export function EmailVerification() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/verify-otp', { state: { email } });
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
                    <h2 className="mb-2 text-2xl font-bold">Secure Recovery</h2>
                    <p className="text-center text-emerald-50">
                        We'll help you reset your password safely and get back to managing
                        your finances quickly.
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
                />
                <Button type="submit" fullWidth className="flex items-center justify-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Send OTP</span>
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
        </AuthLayout>
    );
}

export default EmailVerification;