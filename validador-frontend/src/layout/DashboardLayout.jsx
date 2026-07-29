import { Link, Outlet, useNavigate } from 'react-router-dom';
import styles from '../styles/styles.module.css';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';

export const DashboardLayout = () => {
    const { username, accessToken, licencia,vencimientoLicencia , oauth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };
    return (
        <div className={styles.dashboard}>
            <aside className={styles.sidebar}>
                <h2>Validador MP</h2>
                {accessToken && <p>👤 {username}</p>}
                {licencia && vencimientoLicencia && (
                <p className={styles.licenciaInfo}>
                    🛡️ Licencia activa hasta: <strong>{vencimientoLicencia}</strong>
                </p>
            )}
                <nav>
                    <Link to="/">Inicio</Link>
                    {!accessToken && <Link to="/login">Login</Link>}
                    {!accessToken && <Link to="/register">Registro</Link>}
                    {accessToken && !licencia && <Link to="/suscripcion">Suscripción</Link>}
                    {accessToken && licencia && !oauth && <Link to="/oauth">OAuth</Link>}
                    {accessToken && licencia && oauth && <Link to="/notificaciones">Notificaciones</Link>}
                </nav>
                {accessToken && (
                    <button className={`btn ${styles.btnLogout}`} onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                )}
            </aside>
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};
