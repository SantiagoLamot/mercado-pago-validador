import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../context/AuthContext';
import type { EstadoUsuario, PagoNotificacion } from '../types/api';

export type ConnectionStatus = 'connecting' | 'connected' | 'error' | 'disconnected';

const MAX_NOTIFICACIONES = 50;

interface UseNotificacionesSocketResult {
  status: ConnectionStatus;
  notificaciones: PagoNotificacion[];
  estadoUsuario: EstadoUsuario | null;
}

export function useNotificacionesSocket(): UseNotificacionesSocketResult {
  const { accessToken } = useAuth();
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [notificaciones, setNotificaciones] = useState<PagoNotificacion[]>([]);
  const [estadoUsuario, setEstadoUsuario] = useState<EstadoUsuario | null>(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!accessToken) {
      setStatus('error');
      return;
    }

    setStatus('connecting');
    connectedRef.current = false;

    const client = new Client({
      brokerURL: `${import.meta.env.VITE_WS_BASE_URL}/ws?token=${accessToken}`,
      reconnectDelay: 5000,
      onConnect: () => {
        connectedRef.current = true;
        setStatus('connected');

        client.subscribe('/user/queue/pagos', (message) => {
          const pago: PagoNotificacion = JSON.parse(message.body);
          setNotificaciones((prev) => [pago, ...prev].slice(0, MAX_NOTIFICACIONES));
        });

        client.subscribe('/user/queue/usuario', (message) => {
          const estado: EstadoUsuario = JSON.parse(message.body);
          setEstadoUsuario(estado);
        });
      },
      onStompError: () => {
        setStatus('error');
      },
      onWebSocketClose: () => {
        setStatus(connectedRef.current ? 'disconnected' : 'error');
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [accessToken]);

  return { status, notificaciones, estadoUsuario };
}
