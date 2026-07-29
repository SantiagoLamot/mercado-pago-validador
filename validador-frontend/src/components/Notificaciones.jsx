import { useEffect, useState } from 'react';
import './NotificacionesPago.css';

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    // Simulación de llegada de notificaciones
    const simuladas = [
      {
        mensaje: "Pago recibido correctamente",
        monto: 1250.75,
        email: "cliente1@example.com",
        hora: new Date().toISOString(),
      },
      {
        mensaje: "Transacción rechazada por fondos insuficientes",
        monto: 300.0,
        email: "cliente2@example.com",
        hora: new Date(Date.now() - 60000).toISOString(),
      },
      {
        mensaje: "Pago pendiente de confirmación",
        monto: 980.5,
        email: "cliente3@example.com",
        hora: new Date(Date.now() - 120000).toISOString(),
      },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < simuladas.length) {
        setNotificaciones((prev) => [simuladas[index], ...prev]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1500); // cada 1.5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h2>📬 Notificaciones de Pago</h2>
      {notificaciones.length === 0 ? (
        <p className="empty">Aún no hay transacciones recibidas.</p>
      ) : (
        <ul className="lista">
          {notificaciones.map((n, index) => {
            if (!n) return null; // salta si el item es undefined

            return (
              <li key={index} className="item">
                <div><strong>Mensaje:</strong> {n.mensaje}</div>
                <div><strong>Monto:</strong> ${n.monto.toFixed(2)}</div>
                <div><strong>Email:</strong> {n.email}</div>
                <div><strong>Hora:</strong> {new Date(n.hora).toLocaleString()}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Notificaciones;