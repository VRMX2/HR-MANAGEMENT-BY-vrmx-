import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, KeyRound } from 'lucide-react';
import { auth } from '../firebase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isReset, setIsReset] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login, signup, loginWithGoogle, resetPassword, checkEmailExists } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            if (isReset) {
                // PRO & SECURE: We directly attempt to send the reset email.
                // Firebase will handle the email validation internally.
                // We always show a success message to prevent user enumeration.
                await resetPassword(email);

                // Always show the same message
                setMessage(`If an account exists for ${email}, you will receive a password reset instruction shortly.`);
            } else if (isLogin) {
                await login(email, password);
                navigate('/');
            } else {
                await signup(email, password);
                navigate('/');
            }
        } catch (err) {
            console.error("Auth Error:", err);
            // Customize error messages for better UX
            if (isReset) {
                // Even if it fails (e.g. user not found), we might want to show success or a generic error
                // But typically resetPassword doesn't throw for "user not found" if enumeration protection is on.
                // If it does throw, we should be careful.
                // For now, let's just show the success message for reset to be safe, unless it's a network error.
                setMessage(`If an account exists for ${email}, you will receive a password reset instruction shortly.`);
            } else {
                setError('Failed to ' + (isLogin ? 'log in' : 'sign up') + ': ' + err.message);
            }
        }
        setLoading(false);
    }

    async function handleGoogleSignIn() {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setError('Failed to sign in with Google: ' + err.message);
        }
        setLoading(false);
    }

    const toggleMode = (mode) => {
        setError('');
        setMessage('');
        if (mode === 'reset') {
            setIsReset(true);
            setIsLogin(true);
        } else if (mode === 'signup') {
            setIsReset(false);
            setIsLogin(false);
        } else {
            setIsReset(false);
            setIsLogin(true);
        }
    }

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 w-full max-w-md shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary-500 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-2xl mb-4">P</div>
                    <h2 className="text-2xl font-bold text-white">
                        {isReset ? 'Reset Password' : (isLogin ? 'Welcome back' : 'Create Account')}
                    </h2>
                    <p className="text-gray-400">
                        {isReset ? 'Enter your email to receive reset instructions' : 'Please sign in to continue'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg text-sm mb-6">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="you@company.com"
                        />
                    </div>

                    {!isReset && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-400">Password</label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={() => toggleMode('reset')}
                                        className="text-xs text-primary-500 hover:text-primary-400"
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing...' : (isReset ? 'Reset Password' : (isLogin ? 'Sign In' : 'Create Account'))}
                        {!loading && (isReset ? <KeyRound size={18} /> : <LogIn size={18} />)}
                    </button>
                </form>

                {isReset && (
                    <button
                        onClick={() => toggleMode('login')}
                        className="w-full mt-4 text-gray-400 hover:text-white text-sm"
                    >
                        Back to Login
                    </button>
                )}

                {!isReset && (
                    <>
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-dark-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-dark-800 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </button>

                        <p className="mt-8 text-center text-sm text-gray-400">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => toggleMode(isLogin ? 'signup' : 'login')}
                                className="text-primary-500 hover:text-primary-400 font-medium"
                            >
                                {isLogin ? "Sign up" : "Log in"}
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
