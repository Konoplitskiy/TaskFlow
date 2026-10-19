import { useQuery } from "@tanstack/react-query"
import { getAllTasks } from "../api/tasks"
import Header from "../components/Header"
import TaskBoard from "../components/Task/TaskBoard"
import { Task } from "../types/task"
import ManagerCreateTaskForm from "../components/Task/ManagerCreateTaskForm"
import ProjectForm from "../components/Project/ProjectForm"
import { useState } from "react"
import { FolderPlus, Loader2, Plus, X } from "lucide-react"

export default function AllTaskPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProjectOpen, setIsProjectOpen] = useState(false)

  const { data, isLoading, error } = useQuery<Task[]>({
    queryKey: ["all-tasks"],
    queryFn: getAllTasks,
  })

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex min-h-[50vh] items-center justify-center gap-2 text-jira-subtle">
          <Loader2 className="animate-spin" size={18} />
          Loading dashboard...
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex min-h-[50vh] items-center justify-center text-jira-danger">
          Failed to load tasks
        </div>
      </>
    )
  }

  const tasks = data ?? []

  const totalTasks = tasks.length
  const todoCount = tasks.filter((t) => t.status === "todo").length
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length
  const onHoldCount = tasks.filter((t) => t.status === "on_hold").length
  const doneCount = tasks.filter((t) => t.status === "done").length

  const stats = [
    { label: 'Total', value: totalTasks, accent: 'text-jira-text' },
    { label: 'To Do', value: todoCount, accent: 'text-jira-subtle' },
    { label: 'On Hold', value: onHoldCount, accent: 'text-[#e56910]' },
    { label: 'In Progress', value: inProgressCount, accent: 'text-jira-blue' },
    { label: 'Done', value: doneCount, accent: 'text-jira-success' },
  ]

  return (
    <>
      <Header />

      <main className="min-h-[calc(100vh-3.5rem)] bg-jira-bg p-5">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="jira-page-title">Team board</h1>
              <p className="jira-page-subtitle">
                Manage and monitor all issues across projects
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setIsOpen(true)} className="jira-btn-primary">
                <Plus size={16} />
                Create issue
              </button>

              <button onClick={() => setIsProjectOpen(true)} className="jira-btn-subtle">
                <FolderPlus size={16} />
                Create project
              </button>
            </div>
          </div>

          <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {stats.map((stat) => (
              <div key={stat.label} className="jira-card px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-jira-subtle">
                  {stat.label}
                </p>
                <p className={`mt-1 text-2xl font-semibold ${stat.accent}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          <section className="overflow-x-auto rounded-lg border border-jira-border bg-white p-4">
            <TaskBoard tasks={tasks} />
          </section>
        </div>

        {isOpen && (
          <div className="jira-modal-backdrop">
            <div className="jira-modal">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 rounded p-1.5 text-jira-subtle hover:bg-jira-column"
              >
                <X size={18} />
              </button>

              <div className="mb-5 pr-8">
                <h2 className="text-lg font-semibold text-jira-text">Create issue</h2>
                <p className="text-sm text-jira-subtle">Assign a task to a team member</p>
              </div>

              <ManagerCreateTaskForm onSuccess={() => setIsOpen(false)} />
            </div>
          </div>
        )}

        {isProjectOpen && (
          <div className="jira-modal-backdrop">
            <div className="jira-modal">
              <button
                onClick={() => setIsProjectOpen(false)}
                className="absolute right-3 top-3 rounded p-1.5 text-jira-subtle hover:bg-jira-column"
              >
                <X size={18} />
              </button>

              <div className="mb-5 pr-8">
                <h2 className="text-lg font-semibold text-jira-text">Create project</h2>
                <p className="text-sm text-jira-subtle">Set up a new project space</p>
              </div>

              <ProjectForm onSuccess={() => setIsProjectOpen(false)} />
            </div>
          </div>
        )}
      </main>
    </>
  )
}
