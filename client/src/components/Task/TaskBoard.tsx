import { Task } from "../../types/task"
import TaskColumn from "./TaskColumn"
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { updateTask } from '../../api/tasks'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TaskStatus } from "../../types/taskBoard"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { useState } from "react"
import TaskCard from "./TaskCard"

type Props = {
    tasks: Task[]
}

export default function TaskBoard({ tasks }: Props) {
    const todoTasks = tasks.filter(task => task.status === 'todo')
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress')
    const onHoldTasks = tasks.filter(task => task.status === 'on_hold')
    const doneTasks = tasks.filter(task => task.status === 'done')
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const queryClient = useQueryClient()
    const updateMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: TaskStatus }) => updateTask(id, { status } as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
        }
    })
    const handleDragEnd = (event: any) => {
        const { active, over } = event

        setActiveTask(null)

        if (!over) return

        const taskId = active.id
        const newStatus = over.id

        const currentTask = tasks.find(task => task.id === taskId)

        if (!currentTask) return
        if (currentTask.status === newStatus) return

        updateMutation.mutate({
            id: taskId,
            status: newStatus
        })
    }
    const handleDragStart = (event: any) => {
        const task = tasks.find(t => t.id === event.active.id)
        if (task) setActiveTask(task)
    }
    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
            onDragCancel={() => setActiveTask(null)}
        >
            <div className="flex gap-3 overflow-x-auto pb-2">
                <TaskColumn status="todo" title="To Do" tasks={todoTasks} />
                <TaskColumn status="on_hold" title="On Hold" tasks={onHoldTasks} />
                <TaskColumn status="in_progress" title="In Progress" tasks={inProgressTasks} />
                <TaskColumn status="done" title="Done" tasks={doneTasks} />
            </div>

            <DragOverlay dropAnimation={null}>
                {activeTask ? <TaskCard task={activeTask} overlay /> : null}
            </DragOverlay>
        </DndContext>
    )
}
