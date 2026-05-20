const { modulo, power, squareRoot, add, multiply, divide } = require('../calculator');

describe('calculator extended operations', () => {
  test('modulo: 5 % 2 -> 1', () => {
    expect(modulo(5, 2)).toBe(1);
  });

  test('power: 2 ^ 3 -> 8', () => {
    expect(power(2, 3)).toBe(8);
  });

  test('squareRoot: sqrt(16) -> 4', () => {
    expect(squareRoot(16)).toBe(4);
  });

  test('squareRoot: negative number throws', () => {
    expect(() => squareRoot(-4)).toThrow('Cannot take square root of negative number');
  });

  test('modulo by zero throws', () => {
    expect(() => modulo(1, 0)).toThrow('Modulo by zero');
  });

  test('power with zero exponent', () => {
    expect(power(5, 0)).toBe(1);
  });

  test('add/multiply sanity', () => {
    expect(add([1,2,3])).toBe(6);
    expect(multiply([2,3,4])).toBe(24);
  });

  test('divide by zero via function throws', () => {
    expect(() => divide([10,0])).toThrow('Division by zero');
  });
});
