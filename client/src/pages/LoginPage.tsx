import { useState } from "react"
import { getMe, login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setError('')
        try {
            const result = await login(email, password)
            const token = result.access_token
            const user = result.user
            if (!token) {
                throw new Error('No token')
            }
            localStorage.setItem('access_token', token)
            localStorage.setItem('user', JSON.stringify(user) )
            await getMe()
            navigate('/')
        } catch (e) {
            setError('Invalid email or password')
            console.error(e)
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1f3a] px-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(12,102,228,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(87,157,255,0.25),transparent_40%),linear-gradient(180deg,#0b1f3a_0%,#132447_55%,#1d2125_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:40px_40px]" />

            <form
                onSubmit={handleLogin}
                className="relative w-full max-w-md space-y-5 rounded-xl border border-white/10 bg-white p-8 shadow-2xl"
            >
                <div className="text-center">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-jira-blue text-sm font-bold text-white shadow">
                        TF
                    </div>
                    <h1 className="text-xl font-semibold text-jira-text">
                        Log in to TaskFlow
                    </h1>
                    <p className="mt-1 text-sm text-jira-subtle">
                        Continue to your board
                    </p>
                </div>

                <div>
                    <label className="jira-label">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="you@company.com"
                        className="jira-input"
                    />
                </div>

                <div>
                    <label className="jira-label">Password</label>
                    <div className="relative">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="jira-input pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-jira-subtle hover:text-jira-text"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-jira-danger">
                        {error}
                    </p>
                )}

                <button type="submit" className="jira-btn-primary w-full py-2.5">
                    Continue
                </button>

                <p className="text-center text-sm text-jira-subtle">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="font-semibold text-jira-blue hover:underline">
                        Create account
                    </Link>
                </p>
            </form>
        </div>
    )
}
