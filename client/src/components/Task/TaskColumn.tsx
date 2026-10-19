import { useDroppable } from "@dnd-kit/core"
import { Task } from "../../types/task"
import TaskCard from "./TaskCard"

type Props = {
    title: string
    status: string
    tasks: Task[]
}

const statusAccent: Record<string, string> = {
    todo: 'bg-[#626f86]',
    in_progress: 'bg-[#0c66e4]',
    on_hold: 'bg-[#e56910]',
    done: 'bg-[#22a06b]',
}

export default function TaskColumn({ title, status, tasks }: Props) {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    })

    return (
        <div
            ref={setNodeRef}
            className={`flex min-h-[420px] w-[280px] shrink-0 flex-col rounded-lg transition sm:w-[300px] ${
                isOver ? 'bg-[#e9f2ff] ring-2 ring-jira-blue/30' : 'bg-jira-column'
            }`}
        >
            <div className="flex items-center gap-2 px-3 py-3">
                <span className={`h-2 w-2 rounded-full ${statusAccent[status] || 'bg-jira-subtle'}`} />
                <h2 className="text-xs font-bold uppercase tracking-wide text-jira-subtle">
                    {title}
                </h2>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-jira-subtle">
                    {tasks.length}
                </span>
            </div>

            <div className="flex flex-1 flex-col gap-2 px-2 pb-3">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}

                {tasks.length === 0 && (
                    <div className="rounded-md border border-dashed border-jira-border px-3 py-8 text-center text-xs text-jira-subtle">
                        Drop issues here
                    </div>
                )}
            </div>
        </div>
    )
}
