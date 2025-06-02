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
                console.error('Error parsing response:', parseError);
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
            console.error('Network or server error:', error);
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
                    disabled={isLoading}
                />
                <Button 
                    type="submit" 
                    fullWidth 
                    className="flex items-center justify-center gap-2"
                    disabled={isLoading}
                >
                    <MessageCircle className="h-5 w-5" />
                    <span>{isLoading ? 'Verifying...' : 'Send OTP'}</span>
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