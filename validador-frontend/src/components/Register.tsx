import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { getPostAuthRoute } from '../hooks/usePostAuthRedirect';
import { Button, FormField, Alert, PageShell, Card } from './ui';
import type { RegisterForm } from '../types/forms';
import styles from './Register.module.scss';

const INITIAL_FORM: RegisterForm = {
  nombreDeUsuario: '',
  correo: '',
  contrasena: '',
  nombre: '',
  apellido: '',
  empresa: '',
};

const DATOS_PERSONALES: Array<{ name: keyof RegisterForm; label: string; type?: string; autoComplete?: string }> = [
  { name: 'nombre', label: 'Nombre', autoComplete: 'given-name' },
  { name: 'apellido', label: 'Apellido', autoComplete: 'family-name' },
  { name: 'correo', label: 'Correo', type: 'email', autoComplete: 'email' },
  { name: 'empresa', label: 'Empresa', autoComplete: 'organization' },
];

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState<RegisterForm>(INITIAL_FORM);
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof RegisterForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validar = (): string | null => {
    if (form.contrasena.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (form.contrasena !== repetirContrasena) {
      return 'Las contraseñas no coinciden.';
    }
    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    const validacion = validar();
    if (validacion) {
      setError(validacion);
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(form);
      register(data);
      navigate(getPostAuthRoute(data));
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message ?? err.message : String(err);
      setError('Error en el registro: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell wide>
      <h1 className={styles.title}>Crear cuenta</h1>
      <p className={styles.subtitle}>Registrá tu empresa para empezar a recibir notificaciones de pago.</p>
      <Card>
        <form onSubmit={handleSubmit} noValidate>
          <h2 className={styles.sectionTitle}>Datos de la empresa</h2>
          <div className={styles.grid}>
            {DATOS_PERSONALES.map(({ name, label, type, autoComplete }) => (
              <FormField
                key={name}
                id={`register-${name}`}
                label={label}
                type={type}
                autoComplete={autoComplete}
                value={form[name]}
                onChange={updateField(name)}
                required
              />
            ))}
          </div>

          <h2 className={styles.sectionTitle}>Acceso</h2>
          <div className={styles.grid}>
            <FormField
              id="register-nombreDeUsuario"
              label="Nombre de usuario"
              autoComplete="username"
              value={form.nombreDeUsuario}
              onChange={updateField('nombreDeUsuario')}
              required
            />
          </div>
          <div className={styles.grid}>
            <FormField
              id="register-contrasena"
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              minLength={6}
              hint="Mínimo 6 caracteres"
              value={form.contrasena}
              onChange={updateField('contrasena')}
              required
            />
            <FormField
              id="register-repetirContrasena"
              label="Repetir contraseña"
              type="password"
              autoComplete="new-password"
              minLength={6}
              value={repetirContrasena}
              onChange={setRepetirContrasena}
              required
            />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <Button type="submit" className={styles.submitButton} loading={loading} loadingText="Registrando…">
            Crear cuenta
          </Button>
        </form>
        <p className={styles.footerLink}>
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </Card>
    </PageShell>
  );
};
