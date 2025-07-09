import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import styles from './Login.module.scss';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreDeUsuario: '',
    contrasena: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser(form);

      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
      sessionStorage.setItem('username', data.userName);

      if (!data.licencia && !data.oauth) {
        navigate('/suscripcion');
      } else if (data.licencia && !data.oauth) {
        navigate('/oauth');
      } else if (data.licencia && data.oauth) {
        navigate('/notificaciones');
      }
    } catch (err) {
      setError(
        'Error en el login: ' +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className={`container ${styles.loginContainer}`}>
      <h2 className={`text-center mb-4 ${styles.title}`}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
        <div className="mb-3">
          <label>Nombre de Usuario</label>
          <input
            type="text"
            className="form-control"
            name="nombreDeUsuario"
            value={form.nombreDeUsuario}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className={`btn btn-primary ${styles.btnBlue}`}>
          Ingresar
        </button>
      </form>
    </div>
  );
}
