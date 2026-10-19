import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

type Props = {
    children: ReactNode
}
export const ProtectedRoute = ({ children }: Props) => {
    const token = localStorage.getItem('access_token')
    if (!token) {
        return <Navigate to="/login" replace />
    }
    return children
}