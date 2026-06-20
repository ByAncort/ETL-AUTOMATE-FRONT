import { mapApiError } from './apiError';

/**
 * Tema 2 — Experiencia de Usuario.
 * "Si la API no responde, mapear el error en el front."
 */
describe('mapApiError', () => {
  it('API sin respuesta (servidor caido) -> mensaje de conexión', () => {
    const err = { request: {}, response: undefined } as any;
    expect(mapApiError(err)).toBe(
      'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.'
    );
  });

  it('timeout (ECONNABORTED) -> mensaje de demora', () => {
    const err = { code: 'ECONNABORTED', response: undefined } as any;
    expect(mapApiError(err)).toBe('La solicitud tardó demasiado. Intenta nuevamente.');
  });

  it('error 500 -> mensaje de error del servidor (no expone detalle)', () => {
    const err = { response: { status: 500, data: { message: 'NullPointer en H2' } } } as any;
    expect(mapApiError(err)).toBe('Error del servidor. Intenta más tarde.');
  });

  it('error 404 -> usa mensaje del servidor o fallback', () => {
    expect(mapApiError({ response: { status: 404, data: {} } } as any)).toBe('Recurso no encontrado.');
    expect(mapApiError({ response: { status: 404, data: { message: 'API no existe' } } } as any))
      .toBe('API no existe');
  });

  it('401/403 -> mensaje de autorización', () => {
    expect(mapApiError({ response: { status: 401, data: {} } } as any))
      .toBe('No tienes autorización para esta acción.');
    expect(mapApiError({ response: { status: 403, data: {} } } as any))
      .toBe('No tienes autorización para esta acción.');
  });

  it('400 con mensaje del backend -> propaga el mensaje', () => {
    const err = { response: { status: 400, data: { message: 'url is required' } } } as any;
    expect(mapApiError(err)).toBe('url is required');
  });

  it('error desconocido / undefined -> mensaje de conexión por defecto', () => {
    expect(mapApiError(undefined)).toBe(
      'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.'
    );
  });
});
