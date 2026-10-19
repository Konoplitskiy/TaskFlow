import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createProject, updateProject } from "../../api/projects"
import { getUsers } from "../../api/admin"

type ProjectUser = {
  id: string
  email: string
  name?: string
  role?: string
}

type ProjectData = {
  id: string
  title: string
  description?: string
  managers?: ProjectUser[]
  users?: ProjectUser[]
}

type Props = {
  onSuccess: () => void
  project?: ProjectData | null
}

function toggleId(list: string[], id: string) {
  return list.includes(id) ? list.filter(item => item !== id) : [...list, id]
}

export default function ProjectForm({ onSuccess, project = null }: Props) {
  const isEdit = Boolean(project)
  const [title, setTitle] = useState(project?.title || "")
  const [description, setDescription] = useState(project?.description || "")
  const [managerIds, setManagerIds] = useState<string[]>(
    project?.managers?.map(m => m.id) || []
  )
  const [userIds, setUserIds] = useState<string[]>(
    project?.users?.map(u => u.id) || []
  )

  const queryClient = useQueryClient()

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  const mutation = useMutation({
    mutationFn: (payload: {
      title: string
      description?: string
      managerIds: string[]
      userIds: string[]
    }) =>
      isEdit && project
        ? updateProject(project.id, payload)
        : createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      onSuccess()
    },
  })

  const managers = users.filter((user: any) => user.role === "manager" || user.role === "admin")
  const members = users.filter((user: any) => user.role === "user" || user.role === "manager")

  const handleSubmit = (e: any) => {
    e.preventDefault()
    mutation.mutate({
      title,
      description,
      managerIds,
      userIds,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="jira-label">Project name</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Website Redesign"
          className="jira-input"
          required
        />
      </div>

      <div>
        <label className="jira-label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this project about?"
          rows={3}
          className="jira-input resize-none"
        />
      </div>

      <div>
        <label className="jira-label">Managers</label>
        <div className="max-h-36 space-y-1 overflow-y-auto rounded border border-jira-border bg-jira-bg p-2">
          {managers.length === 0 && (
            <p className="px-1 py-2 text-xs text-jira-subtle">No managers available</p>
          )}
          {managers.map((user: any) => (
            <label
              key={user.id}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-white"
            >
              <input
                type="checkbox"
                checked={managerIds.includes(user.id)}
                onChange={() => setManagerIds(prev => toggleId(prev, user.id))}
                className="accent-jira-blue"
              />
              <span className="truncate">{user.name || user.email}</span>
              <span className="ml-auto text-[11px] text-jira-subtle">{user.role}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="jira-label">Members</label>
        <div className="max-h-36 space-y-1 overflow-y-auto rounded border border-jira-border bg-jira-bg p-2">
          {members.length === 0 && (
            <p className="px-1 py-2 text-xs text-jira-subtle">No members available</p>
          )}
          {members.map((user: any) => (
            <label
              key={user.id}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-white"
            >
              <input
                type="checkbox"
                checked={userIds.includes(user.id)}
                onChange={() => setUserIds(prev => toggleId(prev, user.id))}
                className="accent-jira-blue"
              />
              <span className="truncate">{user.name || user.email}</span>
              <span className="ml-auto text-[11px] text-jira-subtle">{user.role}</span>
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-jira-subtle">
          Select people to add to this project
        </p>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending || !title.trim()}
        className="jira-btn-primary w-full py-2.5"
      >
        {mutation.isPending
          ? (isEdit ? "Saving..." : "Creating...")
          : (isEdit ? "Save changes" : "Create project")}
      </button>
    </form>
  )
}
