#!/usr/bin/env node

// Calculator CLI
// Supported operations:
//  - add / +        : addition (supports 2 or more operands)
//  - subtract / -   : subtraction (first operand minus the rest)
//  - multiply / *   : multiplication (supports 2 or more operands)
//  - divide / /     : division (sequential; division by zero is an error)

// Usage examples:
//   node src/calculator.js add 2 3        # => 5
//   node src/calculator.js + 1 2 3        # => 6
//   node src/calculator.js subtract 10 4  # => 6
//   node src/calculator.js multiply 2 5   # => 10
//   node src/calculator.js divide 10 2    # => 5

function printUsage() {
  console.log('Usage: node src/calculator.js <operation> <num1> <num2> [<num3> ...]');
  console.log('Operations: add(+), subtract(-), multiply(*, x), divide(/)');
}

function exitWithError(msg, code = 1) {
  console.error('Error:', msg);
  process.exit(code);
}

const args = process.argv.slice(2);
if (args.length < 3) {
  // allow operations with at least two operands
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

if (nums.length < 2) exitWithError('Require at least two numeric operands', 2);

function add(operands) { return operands.reduce((a,b) => a + b, 0); }
function subtract(operands) { return operands.slice(1).reduce((a,b) => a - b, operands[0]); }
function multiply(operands) { return operands.reduce((a,b) => a * b, 1); }
function divide(operands) {
  return operands.slice(1).reduce((a,b) => {
    if (b === 0) exitWithError('Division by zero', 3);
    return a / b;
  }, operands[0]);
}

let result;
switch (op) {
  case 'add':
  case '+':
    result = add(nums);
    break;
  case 'subtract':
  case 'sub':
  case '-':
    result = subtract(nums);
    break;
  case 'multiply':
  case 'mul':
  case '*':
  case 'x':
    result = multiply(nums);
    break;
  case 'divide':
  case 'div':
  case '/':
    result = divide(nums);
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
