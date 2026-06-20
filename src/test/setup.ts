import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpia el DOM y el localStorage entre pruebas para aislarlas.
afterEach(() => {
  cleanup();
  localStorage.clear();
});
