import { UpdateTaskDto } from "../types/updateTask"
import { api } from "./axios"

export const getTasks = async () => {
    const res = await api.get('/tasks')
    return res.data
}

export const createTask = async (data: {
    title: string
    description?: string
    assignedUserId?: string
    status?: string
}) => {
    const res = await api.post('/tasks', data)
    return res.data
}

export const deleteTask = async (id: string) => {
    const res = await api.delete(`/tasks/${id}`)
    return res.data
}

export const updateTask = async (id: string, data: UpdateTaskDto) => {
    const res = await api.patch(`/tasks/${id}`, data)
    return res.data
}

export const getAllTasks = async () => {
    const res = await api.get('/tasks/all')
    return res.data
}