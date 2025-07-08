import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(sessionStorage.getItem('username'));

    const handleAuthChange = () => {
      setUsername(sessionStorage.getItem('username'));
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    setUsername(null);
    navigate('/');
    window.dispatchEvent(new Event('authChange'));
    // Cerrar el modal manualmente
    const modal = bootstrap.Modal.getInstance(
      document.getElementById('logoutModal')
    );
    modal.hide();
  };

  return (
    <>
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
              {!username ? (
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
              ) : (
                <>
                  <li className="nav-item">
                    <span className={styles.username}>👋 {username}</span>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`${styles.customBtn} ${styles.logoutBtn}`}
                      data-bs-toggle="modal"
                      data-bs-target="#logoutModal"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal de Confirmación */}
      <div
        className="modal fade"
        id="logoutModal"
        tabIndex="-1"
        aria-labelledby="logoutModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="logoutModalLabel">
                Confirmar cierre de sesión
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              ¿Estás seguro de que querés cerrar sesión?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
