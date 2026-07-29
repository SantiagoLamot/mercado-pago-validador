import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { cambiarContrasena } from '../services/authService';
import { Button, FormField, Alert, PageShell, Card } from './ui';
import type { CambiarContrasenaForm } from '../types/forms';
import styles from './Register.module.scss';

const INITIAL_FORM: CambiarContrasenaForm = {
  contrasenaActual: '',
  contrasenaNueva: '',
  repetirContrasena: '',
};

export const CambiarContrasena = () => {
  const [form, setForm] = useState<CambiarContrasenaForm>(INITIAL_FORM);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof CambiarContrasenaForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validar = (): string | null => {
    if (form.contrasenaNueva.length < 6) {
      return 'La contraseña nueva debe tener al menos 6 caracteres.';
    }
    if (form.contrasenaNueva !== form.repetirContrasena) {
      return 'La confirmación no coincide con la contraseña nueva.';
    }
    if (form.contrasenaNueva === form.contrasenaActual) {
      return 'La contraseña nueva debe ser distinta de la actual.';
    }
    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setExito(false);

    const validacion = validar();
    if (validacion) {
      setError(validacion);
      return;
    }

    setLoading(true);
    try {
      await cambiarContrasena(form.contrasenaActual, form.contrasenaNueva);
      setExito(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      const message = axios.isAxiosError(err) ? (err.response?.data ?? err.message) : String(err);
      setError('No se pudo cambiar la contraseña: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell background="transparent">
      <h1 className={styles.title}>Cambiar contraseña</h1>
      <Card>
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            id="cambiar-actual"
            label="Contraseña actual"
            type="password"
            autoComplete="current-password"
            value={form.contrasenaActual}
            onChange={updateField('contrasenaActual')}
            required
          />
          <FormField
            id="cambiar-nueva"
            label="Contraseña nueva"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={form.contrasenaNueva}
            onChange={updateField('contrasenaNueva')}
            required
          />
          <FormField
            id="cambiar-repetir"
            label="Repetir contraseña nueva"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={form.repetirContrasena}
            onChange={updateField('repetirContrasena')}
            required
          />

          {error && <Alert variant="error">{error}</Alert>}
          {exito && <Alert variant="info">Contraseña actualizada correctamente.</Alert>}

          <Button type="submit" className={styles.submitButton} loading={loading} loadingText="Guardando…">
            Guardar cambios
          </Button>
        </form>
      </Card>
    </PageShell>
  );
};
