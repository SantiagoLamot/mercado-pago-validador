import { useState } from 'react';
import axios from 'axios';
import { FaLock } from 'react-icons/fa';
import { iniciarOauth } from '../services/mpService';
import { useAuth } from '../context/AuthContext';
import { HeroCard, Highlight, MotionButton, Alert } from './ui';

export const Oauth = () => {
  const { username } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOauth = async () => {
    setError('');
    setLoading(true);
    try {
      const link = await iniciarOauth();
      window.location.href = link;
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data ?? err.message : String(err);
      setError('Error al habilitar notificaciones: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeroCard
      icon={<FaLock />}
      title={<>¡Hola, {username}! 👋</>}
      description={
        <>
          Habilitá los permisos de <Highlight>Mercado Pago</Highlight> para poder ver tus{' '}
          <Highlight>notificaciones</Highlight>. <br />
          <strong>No te preocupes, tu privacidad sigue a salvo!</strong>
        </>
      }
    >
      {error && <Alert variant="error">{error}</Alert>}

      <MotionButton
        onClick={handleOauth}
        loading={loading}
        loadingText="Redirigiendo…"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🔒 Habilitar notificaciones
      </MotionButton>
    </HeroCard>
  );
};
