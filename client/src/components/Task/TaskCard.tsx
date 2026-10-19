import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from "react";
import { Task } from '../../types/task';
import { UpdateTaskDto } from '../../types/updateTask';
import { deleteTask, updateTask } from '../../api/tasks';
import { useDraggable } from '@dnd-kit/core'
import { CheckSquare, Pencil, Trash2, X } from 'lucide-react';

type Props = {
    task: Task
    overlay?: boolean
}

function issueKey(id: string) {
    const short = id.replace(/-/g, '').slice(0, 4).toUpperCase()
    return `TF-${short}`
}

export default function TaskCard({ task, overlay = false }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(task.title)
    const [editDescription, setEditDescriprion] = useState(task.description)
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateTaskDto }) => updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
            setIsEditing(false)
        }

    })

    const handleUpdate = () => {
        if (!editTitle.trim()) return
        updateMutation.mutate({
            id: task.id,
            data: {
                title: editTitle,
                description: editDescription
            }
        })
    }
    const handleDelete = () => {
        deleteMutation.mutate(task.id)
    }

    const handleCancel = () => {
        setEditTitle(task.title)
        setEditDescriprion(task.description)
        setIsEditing(false)
    }

    const handleStartEdit = () => {
        setEditTitle(task.title)
        setEditDescriprion(task.description)
        setIsEditing(true)
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const isAllowed = user.role === 'admin' || user.role === 'manager'
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id,
        disabled: overlay,
    })

    return (
        <div
            ref={overlay ? undefined : setNodeRef}
            {...(overlay ? {} : { ...listeners, ...attributes })}
            className={`group rounded border border-jira-border bg-white p-3 ${
                overlay
                    ? 'cursor-grabbing shadow-md ring-1 ring-jira-border'
                    : `shadow-none transition hover:bg-[#fafbfc] cursor-grab active:cursor-grabbing ${
                        isDragging ? 'opacity-30' : ''
                    }`
            }`}
        >
            {isEditing ? (
                <div className="space-y-2.5" onPointerDown={(e) => e.stopPropagation()}>
                    <input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        type="text"
                        className="jira-input"
                    />

                    <textarea
                        value={editDescription}
                        onChange={e => setEditDescriprion(e.target.value)}
                        rows={2}
                        className="jira-input resize-none"
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={handleUpdate}
                            disabled={updateMutation.isPending}
                            className="jira-btn-primary"
                        >
                            {updateMutation.isPending ? 'Saving...' : 'Save'}
                        </button>

                        <button
                            onClick={handleCancel}
                            disabled={updateMutation.isPending}
                            className="jira-btn-subtle"
                        >
                            <X size={14} />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-sm font-medium leading-snug text-jira-text">
                        {task.title}
                    </p>

                    {task.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-jira-subtle">
                            {task.description}
                        </p>
                    )}

                    {task.project && (
                        <div className="mt-2.5">
                            <span className="inline-flex items-center rounded bg-[#dfe1e6] px-1.5 py-0.5 text-[11px] font-medium text-jira-text">
                                {task.project.title}
                            </span>
                        </div>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-jira-subtle">
                            <CheckSquare size={14} className="text-jira-blue" />
                            <span className="text-[11px] font-semibold tracking-wide">
                                {issueKey(task.id)}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                            <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={handleStartEdit}
                                className="rounded p-1 text-jira-subtle hover:bg-jira-column hover:text-jira-text"
                                title="Edit"
                            >
                                <Pencil size={13} />
                            </button>

                            {isAllowed && (
                                <button
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={handleDelete}
                                    disabled={deleteMutation.isPending}
                                    className="rounded p-1 text-jira-subtle hover:bg-red-50 hover:text-jira-danger disabled:opacity-50"
                                    title="Delete"
                                >
                                    <Trash2 size={13} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
