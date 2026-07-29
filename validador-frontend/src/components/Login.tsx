import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { getPostAuthRoute } from '../hooks/usePostAuthRedirect';
import { Button, FormField, Alert, PageShell, Card } from './ui';
import type { LoginForm } from '../types/forms';
import styles from './Login.module.scss';

const INITIAL_FORM: LoginForm = {
  nombreDeUsuario: '',
  contrasena: '',
};

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginForm>(INITIAL_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof LoginForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(form);
      login(data);
      navigate(getPostAuthRoute(data));
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message ?? err.message : String(err);
      setError('Error en el login: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <h1 className={styles.title}>Iniciar Sesión</h1>
      <Card>
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            id="login-username"
            label="Nombre de Usuario"
            value={form.nombreDeUsuario}
            onChange={updateField('nombreDeUsuario')}
            autoComplete="username"
            required
          />
          <FormField
            id="login-password"
            label="Contraseña"
            type="password"
            value={form.contrasena}
            onChange={updateField('contrasena')}
            autoComplete="current-password"
            required
          />

          {error && <Alert variant="error">{error}</Alert>}

          <Button type="submit" className={styles.submitButton} loading={loading} loadingText="Ingresando…">
            Ingresar
          </Button>
        </form>
        <p className={styles.footerLink}>
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </Card>
    </PageShell>
  );
};
