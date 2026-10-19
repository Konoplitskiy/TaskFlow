import { ReactNode } from "react"
import { Navigate } from "react-router-dom"

type Props = {
    children:ReactNode
}

export const AdminRoute = ({children}:Props) => {
    const user = localStorage.getItem('user')
    const parseUser = JSON.parse(user || '{}')
    if (parseUser.role !== 'admin') {
        return <Navigate to={'/'} replace/>
    }
    return children
}