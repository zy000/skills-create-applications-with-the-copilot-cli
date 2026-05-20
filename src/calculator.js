#!/usr/bin/env node

// Calculator CLI
// Supported operations:
//  - add / +        : addition (supports 2 or more operands)
//  - subtract / -   : subtraction (first operand minus the rest)
//  - multiply / *   : multiplication (supports 2 or more operands)
//  - divide / /     : division (sequential; division by zero is an error)
//  - modulo / %     : remainder of a divided by b
//  - power / ^      : exponentiation (base ^ exponent)
//  - sqrt           : square root (single operand; error on negative)

// Usage examples:
//   node src/calculator.js add 2 3        # => 5
//   node src/calculator.js + 1 2 3        # => 6
//   node src/calculator.js subtract 10 4  # => 6
//   node src/calculator.js multiply 2 5   # => 10
//   node src/calculator.js divide 10 2    # => 5
//   node src/calculator.js mod 10 3       # => 1
//   node src/calculator.js pow 2 8        # => 256
//   node src/calculator.js sqrt 16        # => 4

function printUsage() {
  console.log('Usage: node src/calculator.js <operation> <num1> <num2> [<num3> ...]');
  console.log('Operations: add(+), subtract(-), multiply(*, x), divide(/), mod(%), pow(^), sqrt');
}

function exitWithError(msg, code = 1) {
  if (require.main === module) {
    console.error('Error:', msg);
    process.exit(code);
  }
  throw new Error(msg);
}

// Core operation implementations (exported for testing)
function add(operands) { return operands.reduce((a,b) => a + b, 0); }
function subtract(operands) { return operands.slice(1).reduce((a,b) => a - b, operands[0]); }
function multiply(operands) { return operands.reduce((a,b) => a * b, 1); }
function divide(operands) {
  return operands.slice(1).reduce((a,b) => {
    if (b === 0) exitWithError('Division by zero', 3);
    return a / b;
  }, operands[0]);
}

function modulo(a, b) {
  if (b === 0) exitWithError('Modulo by zero', 3);
  return a % b;
}

function power(base, exponent) {
  return Math.pow(base, exponent);
}

function squareRoot(n) {
  if (n < 0) exitWithError('Cannot take square root of negative number', 5);
  return Math.sqrt(n);
}

const args = process.argv.slice(2);

function runCLI() {
  if (args.length < 2) {
    // require at least an operation and one operand (some ops need more)
    printUsage();
    process.exit(1);
  }

  const op = args[0].toLowerCase();
  const rawOperands = args.slice(1);
  const nums = rawOperands.map(n => {
    const v = Number(n);
    if (Number.isNaN(v)) exitWithError(`Invalid number: ${n}`, 2);
    return v;
  });

  function addLocal(operands) { return add(operands); }

  let result;
  switch (op) {
    case 'add':
    case '+':
      if (nums.length < 2) exitWithError('Require at least two numeric operands', 2);
      result = add(nums);
      break;
    case 'subtract':
    case 'sub':
    case '-':
      if (nums.length < 2) exitWithError('Require at least two numeric operands', 2);
      result = subtract(nums);
      break;
    case 'multiply':
    case 'mul':
    case '*':
    case 'x':
      if (nums.length < 2) exitWithError('Require at least two numeric operands', 2);
      result = multiply(nums);
      break;
    case 'divide':
    case 'div':
    case '/':
      if (nums.length < 2) exitWithError('Require at least two numeric operands', 2);
      result = divide(nums);
      break;
    case 'mod':
    case 'modulo':
    case '%':
      if (nums.length < 2) exitWithError('Modulo requires two numeric operands', 2);
      result = modulo(nums[0], nums[1]);
      break;
    case 'pow':
    case 'power':
    case '^':
      if (nums.length < 2) exitWithError('Power requires two numeric operands', 2);
      result = power(nums[0], nums[1]);
      break;
    case 'sqrt':
    case 'square-root':
    case 'square_root':
      if (nums.length < 1) exitWithError('Square root requires one numeric operand', 2);
      result = squareRoot(nums[0]);
      break;
    case 'help':
    case '--help':
    case '-h':
      printUsage();
      process.exit(0);
    default:
      exitWithError(`Unknown operation: ${op}`);
  }

  // Print result as plain text (suitable for scripts and piping)
  if (Number.isFinite(result)) {
    console.log(result);
    process.exit(0);
  } else {
    exitWithError('Result is not a finite number', 4);
  }
}

if (require.main === module) {
  runCLI();
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
  squareRoot
};
