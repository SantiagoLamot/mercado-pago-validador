import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { obtenerPrecioMensual, actualizarPrecioMensual } from '../../services/adminService';
import { Button, FormField, Alert } from '../ui';
import styles from './Admin.module.scss';

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    return fallback + (err.response?.data?.error ?? err.message);
  }
  return fallback + String(err);
};

export const AdminConfiguracion = () => {
  const [precio, setPrecio] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerPrecioMensual()
      .then((p) => setPrecio(String(p)))
      .catch((err) => setError(extractErrorMessage(err, 'Error al cargar precio: ')));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMensaje('');
    try {
      const actualizado = await actualizarPrecioMensual(parseFloat(precio));
      setPrecio(String(actualizado));
      setMensaje('Precio actualizado correctamente.');
    } catch (err) {
      setError(extractErrorMessage(err, 'Error al actualizar precio: '));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Configuración de suscripción</h1>

      {error && <Alert variant="error">{error}</Alert>}
      {mensaje && <Alert variant="info">{mensaje}</Alert>}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <FormField
          id="admin-precio-mensual"
          label="Precio mensual (ARS)"
          type="number"
          step="0.01"
          min="0"
          value={precio}
          onChange={setPrecio}
          required
        />
        <Button type="submit" className={styles.submitButton}>
          Guardar
        </Button>
      </form>
    </div>
  );
};
