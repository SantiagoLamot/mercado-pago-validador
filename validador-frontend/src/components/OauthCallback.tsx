import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaLock } from 'react-icons/fa';
import { completarOauth } from '../services/mpService';
import { HeroCard, Alert } from './ui';

export const OauthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const yaEjecutado = useRef(false);

  useEffect(() => {
    if (yaEjecutado.current) return;
    yaEjecutado.current = true;

    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      setError('Faltan parámetros de Mercado Pago en la URL de retorno.');
      return;
    }

    completarOauth(code, state)
      .then(() => navigate('/notificaciones', { replace: true }))
      .catch((err) => {
        const message = axios.isAxiosError(err) ? err.response?.data ?? err.message : String(err);
        setError('Error al completar la conexión con Mercado Pago: ' + message);
      });
  }, [searchParams, navigate]);

  return (
    <HeroCard icon={<FaLock />} title="Conectando con Mercado Pago…" description="Esto solo toma un momento.">
      {error && <Alert variant="error">{error}</Alert>}
    </HeroCard>
  );
};
