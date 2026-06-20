const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const originalConsoleError = console.error;
console.error = function () {
  const msg = typeof arguments[0] === 'string' ? arguments[0] : '';
  if (msg.includes('unexpectedCharacterInSelector') || msg.includes('Error parsing')) {
    return;
  }
  return originalConsoleError.apply(console, arguments);
};
