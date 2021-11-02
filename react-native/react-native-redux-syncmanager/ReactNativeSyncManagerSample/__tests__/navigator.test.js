import { navigator } from '../src/navigator';

describe('navigator (stack)', () => {
  it('check properties of stack', () => {
    expect(navigator.top()).toBe(null);
    expect(navigator.push('hello')).toBe(true);
    expect(navigator.top()).toBe('hello');
    expect(navigator.push('world')).toBe(true);
    expect(navigator.top()).toBe('world');
    expect(navigator.push('of')).toBe(true);
    expect(navigator.top()).toBe('of');
    expect(navigator.push('stack')).toBe(true);
    expect(navigator.top()).toBe('stack');
    navigator.pop();
    expect(navigator.top()).toBe('of');
    navigator.pop();
    expect(navigator.top()).toBe('world');
    navigator.pop();
    expect(navigator.top()).toBe('hello');
    navigator.pop();
    expect(navigator.top()).toBe(null);
  });

  it('check duplicate push', () => {
    expect(navigator.push('hello')).toBe(true);
    expect(navigator.push('world')).toBe(true);
    expect(navigator.push('of')).toBe(true);
    expect(navigator.push('stack')).toBe(true);
    expect(navigator.top()).toBe('stack');
    expect(navigator.push('stack')).toBe(false);
    expect(navigator.top()).toBe('stack');
    expect(navigator.push('of')).toBe(false);
    expect(navigator.top()).toBe('stack');
    expect(navigator.push('world')).toBe(false);
    expect(navigator.top()).toBe('stack');
  });
});
