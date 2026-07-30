import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';

import { Landing } from '../components/landing/Landing';
import Home from '../components/Home';
import { Login } from '../components/Login';
import { Register } from '../components/Register';
import { Suscripcion } from '../components/Suscripcion';
import { Oauth } from '../components/Oauth';
import { OauthCallback } from '../components/OauthCallback';
import Notificaciones from '../components/Notificaciones';
import { CambiarContrasena } from '../components/CambiarContrasena';
import { AdminEmpresas } from '../components/admin/AdminEmpresas';
import { AdminConfiguracion } from '../components/admin/AdminConfiguracion';
import { RequiereAdmin } from './RequiereAdmin';

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  {
    element: <DashboardLayout />,
    children: [
      { path: '/inicio', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/suscripcion', element: <Suscripcion /> },
      { path: '/oauth', element: <Oauth /> },
      { path: '/oauth/callback', element: <OauthCallback /> },
      { path: '/notificaciones', element: <Notificaciones /> },
      { path: '/perfil/cambiar-contrasena', element: <CambiarContrasena /> },
      {
        path: '/admin/empresas',
        element: (
          <RequiereAdmin>
            <AdminEmpresas />
          </RequiereAdmin>
        ),
      },
      {
        path: '/admin/configuracion',
        element: (
          <RequiereAdmin>
            <AdminConfiguracion />
          </RequiereAdmin>
        ),
      },
      { path: '*', element: <Navigate to="/inicio" /> },
    ],
  },
]);
