import { ReactNode } from "react"
import { Navigate } from "react-router-dom"

export type Props = {
    children:ReactNode
}
 
export const AllTaskRoute = ({children}:Props) => {
    const user = localStorage.getItem('user')
    const parseUser = JSON.parse(user || '{}')
    if (parseUser.role !== 'admin' && parseUser.role !== 'manager') {
        return <Navigate to={'/'} />
    }
    return children
}