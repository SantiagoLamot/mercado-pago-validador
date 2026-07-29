import { useNotificacionesSocket } from '../hooks/useNotificacionesSocket';
import { Alert } from './ui';
import styles from './Notificaciones.module.scss';

const Notificaciones = () => {
  const { status, notificaciones } = useNotificacionesSocket();

  return (
    <div className={styles.container}>
      <h2>📬 Notificaciones de Pago</h2>

      <p className={styles.status} aria-live="polite">
        {status === 'connecting' && 'Conectando…'}
        {status === 'connected' && 'Conectado — esperando notificaciones en tiempo real.'}
        {status === 'disconnected' && 'Desconectado. Intentando reconectar…'}
      </p>

      {status === 'error' && (
        <Alert variant="error">No se pudo conectar al servicio de notificaciones. Probá recargar la página.</Alert>
      )}

      {status !== 'error' && notificaciones.length === 0 && (
        <p className={styles.empty}>Aún no hay transacciones recibidas.</p>
      )}

      {notificaciones.length > 0 && (
        <ul className={styles.lista} aria-live="polite" aria-label="Notificaciones de pago recibidas">
          {notificaciones.map((n, index) => (
            <li key={`${n.hora}-${index}`} className={styles.item}>
              <div>
                <strong>Mensaje:</strong> {n.mensaje}
              </div>
              <div>
                <strong>Monto:</strong> ${n.monto.toFixed(2)}
              </div>
              <div>
                <strong>Email:</strong> {n.email}
              </div>
              <div>
                <strong>Hora:</strong> {new Date(n.hora).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notificaciones;
