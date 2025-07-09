import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import styles from './Register.module.scss';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreDeUsuario: '',
    correo: '',
    contrasena: '',
    nombre: '',
    apellido: '',
    empresa: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerUser(form);

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
        'Error en el registro: ' +
        (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className={`container ${styles.registerContainer}`}>
      <h2 className={`text-center mb-4 ${styles.title}`}>Registro</h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
        <div className="row">
          <div className="mb-3 col-md-6">
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
          <div className="mb-3 col-md-6">
            <label>Correo</label>
            <input
              type="email"
              className="form-control"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 col-md-6">
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
          <div className="mb-3 col-md-6">
            <label>Nombre</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 col-md-6">
            <label>Apellido</label>
            <input
              type="text"
              className="form-control"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 col-md-6">
            <label>Empresa</label>
            <input
              type="text"
              className="form-control"
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className={`btn btn-primary ${styles.btnBlue}`}>
          Registrarse
        </button>
      </form>
    </div>
  );
}
