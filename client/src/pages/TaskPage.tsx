import { useQuery } from "@tanstack/react-query"
import { getTasks } from "../api/tasks"
import Header from "../components/Header"
import TaskBoard from "../components/Task/TaskBoard"
import TaskCreateForm from "../components/Task/TaskCreateForm"
import { useState } from "react"
import Sidebar from "../components/Sidebar"
import { useProjectStore } from "../store/projectStore"
import { Plus, X, Loader2 } from "lucide-react"

export default function TasksPage() {
  const [isOpen, setIsOpen] = useState(false)
  const selectedProjectId = useProjectStore(state => state.selectedProjectId)

  const user = localStorage.getItem('user')
  const parsedUser = JSON.parse(user || '{}')

  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks', parsedUser.id],
    queryFn: getTasks
  })

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex min-h-[50vh] items-center justify-center gap-2 text-jira-subtle">
          <Loader2 className="animate-spin" size={18} />
          Loading board...
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

  const visibleTasks = selectedProjectId
    ? tasks.filter((task: any) => task.project?.id === selectedProjectId)
    : tasks

  return (
    <>
      <Header />

      <div className="flex min-h-[calc(100vh-3.5rem)] bg-jira-bg">
        <Sidebar />

        <main className="flex-1 overflow-x-auto p-5">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-jira-subtle">
                <span className="rounded bg-jira-blue px-1.5 py-0.5 text-[10px] text-white">TF</span>
                Board
              </div>
              <h1 className="jira-page-title">My board</h1>
              <p className="jira-page-subtitle">
                {visibleTasks.length} issue{visibleTasks.length === 1 ? '' : 's'}
                {selectedProjectId ? ' in selected project' : ''}
              </p>
            </div>

            <button
              className="jira-btn-primary"
              onClick={() => setIsOpen(true)}
            >
              <Plus size={16} />
              Create
            </button>
          </div>

          <TaskBoard tasks={visibleTasks} />
        </main>
      </div>

      {isOpen && (
        <div className="jira-modal-backdrop">
          <div className="jira-modal">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 rounded p-1.5 text-jira-subtle hover:bg-jira-column hover:text-jira-text"
            >
              <X size={18} />
            </button>

            <div className="mb-5 pr-8">
              <h2 className="text-lg font-semibold text-jira-text">Create issue</h2>
              <p className="text-sm text-jira-subtle">Add a new task to your board</p>
            </div>

            <TaskCreateForm onSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
