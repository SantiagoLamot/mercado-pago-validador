import { useState } from 'react';
import { iniciarOauth } from '../../services/mpService';
import styles from './Oauth.module.scss';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';

export default function Oauth() {
  const username = sessionStorage.getItem('username');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOauth = async () => {
    setError('');
    setLoading(true);
    try {
      const link = await iniciarOauth();
      window.location.href = link;
    } catch (err) {
      setError(
        'Error al habilitar notificaciones: ' +
          (err.response?.data || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`container ${styles.oauthContainer}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className={styles.icon}>
        <FaLock />
      </div>

      <motion.h1
        className={styles.title}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
      >
        ¡Hola, {username}! 👋
      </motion.h1>

      <motion.p
        className={styles.text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Habilitá los permisos de <span className={styles.highlight}>Mercado Pago</span> para poder ver tus <span className={styles.highlight}>notificaciones</span>. <br />
        <strong>No te preocupes, tu privacidad sigue a salvo!</strong>
      </motion.p>

      {error && <div className="alert alert-danger">{error}</div>}

      <motion.button
        onClick={handleOauth}
        className={`btn ${styles.btnBlue}`}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? 'Redirigiendo...' : '🔒 Habilitar notificaciones'}
      </motion.button>
    </motion.div>
  );
}
