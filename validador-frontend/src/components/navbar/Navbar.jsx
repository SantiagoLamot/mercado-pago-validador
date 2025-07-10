import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logoutUser } from '../../services/authService';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Al cargar o recibir un evento, actualizamos el estado
    const updateAuthData = () => {
      setUsername(sessionStorage.getItem('username'));
    };

    updateAuthData();
    window.addEventListener('authChange', updateAuthData);

    return () => {
      window.removeEventListener('authChange', updateAuthData);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser(); // llama al backend con el token
    } catch (error) {
      console.error('Error al cerrar sesión en el backend:', error);
      // Igualmente continuamos con el logout local
    }

    // Limpiar frontend
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    setUsername(null);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };


  return (
    <nav className={`navbar navbar-expand-lg ${styles.customNavbar}`}>
      <div className="container">
        <NavLink
          className={({ isActive }) =>
            `${styles.navbarBrand} ${isActive ? styles.activeLink : ''}`
          }
          to="/"
        >
          Inicio
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {username != null ? (
              <>
                <li className="nav-item">
                  <span className={styles.username}>👋 {username}</span>
                </li>
                <li className="nav-item">
                  <button
                    className={`${styles.customBtn} ${styles.logoutBtn}`}
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className={`${styles.customBtn} ${styles.me2}`}
                  >
                    Registro
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className={styles.customBtn}>
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
