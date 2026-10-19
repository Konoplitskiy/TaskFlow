import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useProjectStore } from "../store/projectStore"
import { deleteProject, getProjects } from "../api/projects"
import { FolderKanban, Layers, Pencil, Plus, Trash2, X } from "lucide-react"
import { useState } from "react"
import ProjectForm from "./Project/ProjectForm"

const projectColors = [
    'bg-[#0c66e4]',
    'bg-[#22a06b]',
    'bg-[#e56910]',
    'bg-[#8270db]',
    'bg-[#c9372c]',
    'bg-[#2898bd]',
]

export default function Sidebar() {
    const selectedProjectId = useProjectStore(state => state.selectedProjectId)
    const setSelectedProjectId = useProjectStore(state => state.setSelectedProjectId)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<any | null>(null)

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const canManage = user.role === 'admin' || user.role === 'manager'
    const queryClient = useQueryClient()

    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
        enabled: canManage,
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteProject(id),
        onSuccess: (_data, id) => {
            if (selectedProjectId === id) setSelectedProjectId('')
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        }
    })

    const itemClass = (active: boolean) =>
        `group flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm transition ${
            active
                ? 'bg-jira-blue-soft font-semibold text-jira-blue'
                : 'text-jira-text hover:bg-jira-column'
        }`

    return (
        <>
            <aside className="sticky top-14 flex h-[calc(100vh-3.5rem)] w-60 shrink-0 flex-col border-r border-jira-border bg-white">
                <div className="flex items-center justify-between border-b border-jira-border px-4 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-jira-subtle">
                        Projects
                    </p>
                    {canManage && (
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="rounded p-1 text-jira-subtle hover:bg-jira-column hover:text-jira-blue"
                            title="Create project"
                        >
                            <Plus size={16} />
                        </button>
                    )}
                </div>

                <div className="flex-1 space-y-0.5 overflow-y-auto p-2">
                    <button
                        onClick={() => setSelectedProjectId('')}
                        className={itemClass(!selectedProjectId)}
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-jira-column text-jira-subtle">
                            <Layers size={14} />
                        </span>
                        All projects
                    </button>

                    {projects.map((project: any, index: number) => (
                        <div
                            key={project.id}
                            className={`group relative flex items-center rounded ${
                                selectedProjectId === project.id ? 'bg-jira-blue-soft' : 'hover:bg-jira-column'
                            }`}
                        >
                            <button
                                onClick={() => setSelectedProjectId(project.id)}
                                className={`flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2 text-left text-sm ${
                                    selectedProjectId === project.id
                                        ? 'font-semibold text-jira-blue'
                                        : 'text-jira-text'
                                }`}
                            >
                                <span
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white ${
                                        projectColors[index % projectColors.length]
                                    }`}
                                >
                                    {project.title?.charAt(0).toUpperCase() || <FolderKanban size={12} />}
                                </span>
                                <span className="min-w-0 flex-1 truncate">{project.title}</span>
                                <span className="text-[10px] font-medium text-jira-subtle group-hover:hidden">
                                    {(project.users?.length || 0) + (project.managers?.length || 0)}
                                </span>
                            </button>

                            {canManage && (
                                <div className="absolute right-1 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 group-hover:flex">
                                    <button
                                        onClick={() => setEditingProject(project)}
                                        className="rounded p-1 text-jira-subtle hover:bg-white hover:text-jira-blue"
                                        title="Edit / members"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(`Delete project "${project.title}"?`)) {
                                                deleteMutation.mutate(project.id)
                                            }
                                        }}
                                        className="rounded p-1 text-jira-subtle hover:bg-white hover:text-jira-danger"
                                        title="Delete project"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {canManage && projects.length === 0 && (
                        <div className="px-2.5 py-3">
                            <p className="mb-2 text-xs text-jira-subtle">No projects yet</p>
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="jira-btn-subtle w-full text-xs"
                            >
                                <Plus size={14} />
                                Create project
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {isCreateOpen && (
                <div className="jira-modal-backdrop">
                    <div className="jira-modal">
                        <button
                            onClick={() => setIsCreateOpen(false)}
                            className="absolute right-3 top-3 rounded p-1.5 text-jira-subtle hover:bg-jira-column"
                        >
                            <X size={18} />
                        </button>
                        <div className="mb-5 pr-8">
                            <h2 className="text-lg font-semibold text-jira-text">Create project</h2>
                            <p className="text-sm text-jira-subtle">Add managers and members</p>
                        </div>
                        <ProjectForm onSuccess={() => setIsCreateOpen(false)} />
                    </div>
                </div>
            )}

            {editingProject && (
                <div className="jira-modal-backdrop">
                    <div className="jira-modal">
                        <button
                            onClick={() => setEditingProject(null)}
                            className="absolute right-3 top-3 rounded p-1.5 text-jira-subtle hover:bg-jira-column"
                        >
                            <X size={18} />
                        </button>
                        <div className="mb-5 pr-8">
                            <h2 className="text-lg font-semibold text-jira-text">Edit project</h2>
                            <p className="text-sm text-jira-subtle">Update details and people</p>
                        </div>
                        <ProjectForm
                            project={editingProject}
                            onSuccess={() => setEditingProject(null)}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
