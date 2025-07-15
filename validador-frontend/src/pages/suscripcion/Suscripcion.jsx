import { useState } from 'react';
import { iniciarPagoSuscripcion } from '../../services/mpService';
import styles from './Suscripcion.module.scss';
import { motion } from 'framer-motion';
import { FaRegCreditCard } from 'react-icons/fa';

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
    <motion.div
      className={`container ${styles.suscripcionContainer}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className={styles.icon}>
        <FaRegCreditCard />
      </div>

      <motion.h1
        className={styles.title}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
      >
        ¡Bienvenido {username}! 👋
      </motion.h1>

      <motion.p
        className={styles.text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Gracias por registrarte a nuestro servicio. <br />
        Para continuar, <span className={styles.highlight}>suscribite</span> al
        plan mensual y recibí todas tus{' '}
        <span className={styles.highlight}>notificaciones de pago</span> con la
        mayor <span className={styles.highlight}>confiabilidad</span> en las
        transacciones y evitá <span className={styles.highlight}>fraudes</span>.
      </motion.p>

      {error && <div className="alert alert-danger">{error}</div>}

      <motion.button
        onClick={handleSuscribirse}
        className={`btn ${styles.btnBlue}`}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? 'Redirigiendo...' : ' Suscribirse ahora '}
      </motion.button>
    </motion.div>
  );
}
