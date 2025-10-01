import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';

// Componentes principales
import Home from '../components/Home';
import { Login } from '../components/Login';
import { Register } from '../components/Register';
import { Suscripcion } from '../components/Suscripcion';
import { Oauth } from '../components/Oauth';
import  Notificaciones  from '../components/Notificaciones';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <DashboardLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '/suscripcion', element: <Suscripcion /> },
            { path: '/oauth', element: <Oauth /> },
            { path: '/notificaciones', element: <Notificaciones /> },
            { path: '*', element: <Navigate to="/" /> }, // Redirección si no existe
        ],
    },
    // Rutas fuera del layout (sin sidebar)

]);