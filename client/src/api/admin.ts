import { api } from "./axios"

export const getUsers = async () => {
  const res = await api.get('/user')
  return res.data
}

export const updateUserRole = async (id: string, role: string) => {
  const res = await api.patch(`/user/${id}/role`, { role })
  return res.data
}

export const deleteUser = async (id: string) => {
  const res = await api.delete(`/user/${id}`)
  return res.data
}