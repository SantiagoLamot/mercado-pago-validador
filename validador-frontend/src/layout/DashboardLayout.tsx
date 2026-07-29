import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserMenu } from '../components/user/UserMenu';
import styles from './DashboardLayout.module.scss';

export const DashboardLayout = () => {
  const { accessToken, licencia, vencimientoLicencia, oauth, rol } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) => `${styles.link} ${isActive ? styles.active : ''}`;

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.brand}>
          <span className={styles.brandDot} aria-hidden="true" />
          Validador MP
        </h2>
        {accessToken && <UserMenu />}
        {licencia && vencimientoLicencia && (
          <p className={styles.licenciaInfo}>
            🛡️ Licencia activa hasta: <strong>{vencimientoLicencia}</strong>
          </p>
        )}
        <nav className={styles.nav} aria-label="Navegación principal">
          <NavLink to="/inicio" className={linkClass} end>
            Inicio
          </NavLink>
          {!accessToken && (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          )}
          {!accessToken && (
            <NavLink to="/register" className={linkClass}>
              Registro
            </NavLink>
          )}
          {accessToken && !licencia && (
            <NavLink to="/suscripcion" className={linkClass}>
              Suscripción
            </NavLink>
          )}
          {accessToken && licencia && !oauth && (
            <NavLink to="/oauth" className={linkClass}>
              OAuth
            </NavLink>
          )}
          {accessToken && licencia && oauth && (
            <NavLink to="/notificaciones" className={linkClass}>
              Notificaciones
            </NavLink>
          )}
          {accessToken && rol === 'ADMIN' && (
            <NavLink to="/admin/empresas" className={linkClass}>
              Empresas
            </NavLink>
          )}
          {accessToken && rol === 'ADMIN' && (
            <NavLink to="/admin/configuracion" className={linkClass}>
              Configuración
            </NavLink>
          )}
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};
