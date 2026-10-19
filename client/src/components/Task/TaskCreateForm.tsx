import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '../../api/tasks'

type Props = {
    onSuccess: () => void
}

export default function TaskCreateForm({ onSuccess }: Props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const handleTask = (e: any) => {
        e.preventDefault()
        mutation.mutate({
            title, description
        })
    }
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (data: { title: string; description: string }) => createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            setTitle('')
            setDescription('')
            onSuccess()
        }
    })

    return (
        <form onSubmit={handleTask} className="space-y-4">
            <div>
                <label className="jira-label">Summary</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="What needs to be done?"
                    className="jira-input"
                    required
                />
            </div>

            <div>
                <label className="jira-label">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more details..."
                    rows={3}
                    className="jira-input resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={mutation.isPending}
                className="jira-btn-primary w-full py-2.5"
            >
                {mutation.isPending ? 'Creating...' : 'Create'}
            </button>
        </form>
    )
}
