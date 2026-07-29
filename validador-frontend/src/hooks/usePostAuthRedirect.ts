interface PostAuthState {
  licencia: boolean;
  oauth: boolean;
  rol?: string;
}

export function getPostAuthRoute(state: PostAuthState): string {
  if (state.rol === 'ADMIN') return '/admin/empresas';
  if (!state.licencia) return '/suscripcion';
  if (!state.oauth) return '/oauth';
  return '/notificaciones';
}
