import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';
import styles from './UserMenu.module.scss';

const initials = (nombre: string, apellido: string, username: string): string => {
  if (nombre || apellido) {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
};

export const UserMenu = () => {
  const { username, nombre, apellido, correo, rol, nombreEmpresa, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const displayName = nombre || apellido ? `${nombre} ${apellido}`.trim() : username;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logoutUser();
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className={styles.avatar} aria-hidden="true">
          {initials(nombre, apellido, username)}
        </span>
        <span className={styles.name}>{displayName}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className={styles.panel} role="menu">
          <div className={styles.panelHeader}>
            <span className={styles.avatar} aria-hidden="true">
              {initials(nombre, apellido, username)}
            </span>
            <div>
              <p className={styles.panelName}>{displayName}</p>
              {correo && <p className={styles.panelMeta}>{correo}</p>}
            </div>
          </div>

          <div className={styles.panelInfo}>
            <span className={styles.badge}>{rol === 'ADMIN' ? 'Admin general' : 'Empresa'}</span>
            {rol !== 'ADMIN' && nombreEmpresa && <span className={styles.panelMeta}>{nombreEmpresa}</span>}
          </div>

          <div className={styles.divider} />

          <Link to="/perfil/cambiar-contrasena" className={styles.menuItem} role="menuitem" onClick={() => setOpen(false)}>
            Cambiar contraseña
          </Link>
          <button type="button" className={styles.menuItemDanger} role="menuitem" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
