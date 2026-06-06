import type { AxiosError } from 'axios';

/**
 * Traduce un error de axios a un mensaje claro para el usuario.
 * Caso clave (nota del profesor): si la API no responde (servidor caido,
 * timeout o red), error.response es undefined y debe mapearse a un mensaje
 * de conexion en lugar de mostrar undefined o reventar la UI.
 */
export function mapApiError(error: unknown): string {
  const err = error as AxiosError<{ message?: string }> | undefined;

  // Sin respuesta del servidor: caido, timeout, CORS o sin red.
  if (!err || err.response === undefined) {
    if (err?.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado. Intenta nuevamente.';
    }
    return 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.';
  }

  const status = err.response.status;
  const serverMsg = err.response.data?.message;

  if (status >= 500) {
    return 'Error del servidor. Intenta más tarde.';
  }
  if (status === 404) {
    return serverMsg || 'Recurso no encontrado.';
  }
  if (status === 401 || status === 403) {
    return serverMsg || 'No tienes autorización para esta acción.';
  }

  return serverMsg || 'Ocurrió un error inesperado. Intenta nuevamente.';
}
