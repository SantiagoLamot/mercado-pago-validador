import { useState } from 'react';
import axios from 'axios';
import { FaRegCreditCard } from 'react-icons/fa';
import { iniciarPagoSuscripcion } from '../services/mpService';
import { useAuth } from '../context/AuthContext';
import { HeroCard, Highlight, MotionButton, Alert } from './ui';

export const Suscripcion = () => {
  const { username } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuscribirse = async () => {
    setError('');
    setLoading(true);
    try {
      const link = await iniciarPagoSuscripcion();
      window.location.href = link;
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data ?? err.message : String(err);
      setError('Error al iniciar pago: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeroCard
      icon={<FaRegCreditCard />}
      title={<>¡Bienvenido {username}! 👋</>}
      description={
        <>
          Gracias por registrarte a nuestro servicio. <br />
          Para continuar, <Highlight>suscribite</Highlight> al plan mensual y recibí todas tus{' '}
          <Highlight>notificaciones de pago</Highlight> con la mayor <Highlight>confiabilidad</Highlight> en las
          transacciones y evitá <Highlight>fraudes</Highlight>.
        </>
      }
    >
      {error && <Alert variant="error">{error}</Alert>}

      <MotionButton
        onClick={handleSuscribirse}
        loading={loading}
        loadingText="Redirigiendo…"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Suscribirse ahora
      </MotionButton>
    </HeroCard>
  );
};
