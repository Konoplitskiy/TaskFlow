import { api } from "./axios";

export type ProjectPayload = {
  title: string
  description?: string
  managerIds?: string[]
  userIds?: string[]
}

export const getProjects = async () => {
  const res = await api.get('/projects')
  return res.data
}

export const getProject = async (id: string) => {
  const res = await api.get(`/projects/${id}`)
  return res.data
}

export const createProject = async (data: ProjectPayload) => {
  const res = await api.post('/projects', data)
  return res.data
}

export const updateProject = async (id: string, data: Partial<ProjectPayload>) => {
  const res = await api.patch(`/projects/${id}`, data)
  return res.data
}

export const deleteProject = async (id: string) => {
  const res = await api.delete(`/projects/${id}`)
  return res.data
}
