import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarPagoSuscripcion } from '../../services/mpService';
import styles from './Suscripcion.module.scss';

export default function Suscripcion() {
  const username = sessionStorage.getItem('username');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuscribirse = async () => {
    setError('');
    setLoading(true);
    try {
      const link = await iniciarPagoSuscripcion('param-ejemplo');
      window.location.href = link;
    } catch (err) {
      setError(
        'Error al iniciar pago: ' +
          (err.response?.data || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.suscripcionContainer}`}>
      <h1 className={styles.title}>Bienvenido, {username} 👋</h1>
      <p className={styles.text}>
        Gracias por registrarte a nuestro servicio.
      </p>
      <p className={styles.text}>
        Para continuar suscribite al plan mensual y recibí todas tus notificaciones de pago con la mayor confiabilidad de las transacciones y evitá fraudes.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <button
        onClick={handleSuscribirse}
        className={`btn ${styles.btnBlue}`}
        disabled={loading}
      >
        {loading ? 'Redirigiendo...' : 'Suscribirse ahora'}
      </button>
    </div>
  );
}
