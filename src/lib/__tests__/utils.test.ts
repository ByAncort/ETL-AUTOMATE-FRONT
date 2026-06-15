import { cn } from '../utils';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    const showHidden = false;
    expect(cn('base', showHidden && 'hidden', 'visible')).toBe('base visible');
  });

  it('should handle arrays', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c');
  });

  it('should handle objects', () => {
    expect(cn({ foo: true, bar: false })).toBe('foo');
  });

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });

  it('should handle null and undefined', () => {
    expect(cn('foo', null, undefined, 'bar')).toBe('foo bar');
  });
});
