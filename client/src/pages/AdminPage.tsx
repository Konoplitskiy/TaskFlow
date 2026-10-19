import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUsers, updateUserRole, deleteUser } from "../api/admin"
import Header from "../components/Header"
import { Loader2, Trash2, Users } from "lucide-react"

export default function AdminPage() {
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers
    })

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }: { id: string, role: string }) =>
            updateUserRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })

    const deleteUserMutation = useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="flex min-h-[50vh] items-center justify-center gap-2 text-jira-subtle">
                    <Loader2 className="animate-spin" size={18} />
                    Loading users...
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="flex min-h-[50vh] items-center justify-center text-jira-danger">
                    Failed to load users
                </div>
            </>
        )
    }

    return (
        <>
            <Header />

            <div className="min-h-[calc(100vh-3.5rem)] bg-jira-bg p-5">
                <div className="mx-auto max-w-4xl space-y-5">
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded bg-jira-blue-soft text-jira-blue">
                            <Users size={20} />
                        </span>
                        <div>
                            <h1 className="jira-page-title">User management</h1>
                            <p className="jira-page-subtitle">
                                Manage roles and access for your workspace
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-jira-border bg-white">
                        <div className="grid grid-cols-[1fr_140px_88px] gap-3 border-b border-jira-border bg-jira-bg px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-jira-subtle">
                            <span>User</span>
                            <span>Role</span>
                            <span className="text-right">Actions</span>
                        </div>

                        <div className="divide-y divide-jira-border">
                            {data.map((user: any) => (
                                <div
                                    key={user.id}
                                    className="grid grid-cols-[1fr_140px_88px] items-center gap-3 px-4 py-3 hover:bg-[#fafbfc]"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#579dff] text-xs font-bold text-jira-navy">
                                            {(user.name || user.email || '?').charAt(0).toUpperCase()}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-jira-text">
                                                {user.name || user.email}
                                            </p>
                                            <p className="truncate text-xs text-jira-subtle">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <select
                                        value={user.role}
                                        onChange={(e) =>
                                            updateRoleMutation.mutate({
                                                id: user.id,
                                                role: e.target.value
                                            })
                                        }
                                        className="jira-input py-1.5"
                                    >
                                        <option value="user">User</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => deleteUserMutation.mutate(user.id)}
                                            disabled={deleteUserMutation.isPending}
                                            className="jira-btn-danger px-2.5"
                                            title="Delete user"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
