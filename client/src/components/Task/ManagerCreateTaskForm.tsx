import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTask } from "../../api/tasks"
import { getUsers } from "../../api/admin"
import { getProjects } from "../../api/projects"

type Props = {
  onSuccess: () => void
}

export default function ManagerCreateTaskForm({ onSuccess }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedUserId, setAssignedUserId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [status, setStatus] = useState('todo')

  const queryClient = useQueryClient()

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setTitle('')
      setDescription('')
      setAssignedUserId('')
      setProjectId('')
      setStatus('todo')
      onSuccess()
    }
  })

  const handleSubmit = (e: any) => {
    e.preventDefault()

    mutation.mutate({
      title,
      description,
      assignedUserId,
      projectId,
      status
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="jira-label">Summary</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Issue summary"
          className="jira-input"
          required
        />
      </div>

      <div>
        <label className="jira-label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue"
          rows={3}
          className="jira-input resize-none"
        />
      </div>

      <div>
        <label className="jira-label">Assignee</label>
        <select
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
          className="jira-input"
        >
          <option value="">Unassigned</option>
          {users.map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="jira-label">Project</label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="jira-input"
        >
          <option value="">No project</option>
          {projects.map((project: any) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="jira-label">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="jira-input"
        >
          <option value="todo">To Do</option>
          <option value="on_hold">On Hold</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
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
