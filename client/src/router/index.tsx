import { createBrowserRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import TasksPage from '../pages/TaskPage';
import { ProtectedRoute } from './ProtectedRoute';
import AdminPage from '../pages/AdminPage';
import { AdminRoute } from './AdminRoute';
import { AllTaskRoute } from './AllTaskRoute';
import AllTaskPage from '../pages/AllTasksPage';
export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <TasksPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    },
    {
        path: '/admin',
        element: (
            <AdminRoute>
                <AdminPage />
            </AdminRoute>
        )
    },
    {
        path:'/allTask',
        element: (
            <AllTaskRoute>
                <AllTaskPage/>
            </AllTaskRoute>
        )
    }
])