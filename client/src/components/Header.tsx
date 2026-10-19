import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { LayoutGrid, Shield, LogOut, ChevronDown } from "lucide-react"

export default function Header() {
    const user = localStorage.getItem('user')
    const parsedUser = JSON.parse(user || '{}')
    const name = parsedUser.name || parsedUser.email
    const role = parsedUser.role

    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        queryClient.clear()
        navigate('/login')
    }

    const isAdmin = role === 'admin'
    const isManagerOrAdmin = role === 'admin' || role === 'manager'

    const navBtn = (active: boolean) =>
        `jira-btn text-sm ${active
            ? 'bg-white/15 text-white'
            : 'text-[#c7d1db] hover:bg-white/10 hover:text-white'
        }`

    return (
        <header className="sticky top-0 z-50 h-14 w-full bg-jira-navy text-white shadow-md">
            <div className="flex h-full items-center justify-between gap-4 px-4">
                <div className="flex items-center gap-5">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <span className="flex h-7 w-7 items-center justify-center rounded bg-jira-blue text-[11px] font-bold tracking-tight shadow-sm">
                            TF
                        </span>
                        <span className="text-[15px] font-semibold tracking-tight">
                            Task<span className="text-[#85b8ff]">Flow</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 sm:flex">
                        <button
                            onClick={() => navigate('/')}
                            className={navBtn(location.pathname === '/')}
                        >
                            Your work
                        </button>

                        {isManagerOrAdmin && (
                            <button
                                onClick={() => navigate('/allTask')}
                                className={navBtn(location.pathname === '/allTask')}
                            >
                                <LayoutGrid size={15} />
                                Boards
                            </button>
                        )}

                        {isAdmin && (
                            <button
                                onClick={() => navigate('/admin')}
                                className={navBtn(location.pathname === '/admin')}
                            >
                                <Shield size={15} />
                                Admin
                            </button>
                        )}
                    </nav>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsOpen(prev => !prev)}
                        className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-white/10"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#579dff] text-sm font-bold text-jira-navy">
                            {name?.charAt(0).toUpperCase()}
                        </span>
                        <span className="hidden max-w-[140px] truncate text-sm text-[#c7d1db] md:block">
                            {name}
                        </span>
                        <ChevronDown size={14} className="text-[#c7d1db]" />
                    </button>

                    {isOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                            <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-jira-border bg-white text-jira-text shadow-xl">
                                <div className="border-b border-jira-border px-4 py-3">
                                    <p className="truncate text-sm font-semibold">{name}</p>
                                    <p className="mt-0.5 text-xs capitalize text-jira-subtle">{role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-jira-danger hover:bg-red-50"
                                >
                                    <LogOut size={15} />
                                    Log out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
