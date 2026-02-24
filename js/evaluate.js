export function isOperator(token) {
  return token === "+" || token === "-" || token === "*" || token === "/";
}

function getDecimalCtor() {
  const ctor = globalThis.Decimal || globalThis.window?.Decimal;
  if (!ctor) {
    throw new Error("Decimal.js is not available");
  }
  return ctor;
}

export function evaluate(tokenList) {
  const DecimalCtor = getDecimalCtor();
  const output = [];
  const operators = [];
  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  tokenList.forEach((token) => {
    if (!isOperator(token)) {
      output.push(token);
      return;
    }

    while (
      operators.length &&
      precedence[operators[operators.length - 1]] >= precedence[token]
    ) {
      output.push(operators.pop());
    }
    operators.push(token);
  });

  while (operators.length) {
    output.push(operators.pop());
  }

  const stack = [];
  output.forEach((token) => {
    if (!isOperator(token)) {
      stack.push(new DecimalCtor(token));
      return;
    }

    const right = stack.pop();
    const left = stack.pop();
    if (!left || !right) {
      throw new Error("Invalid expression");
    }

    switch (token) {
      case "+":
        stack.push(left.plus(right));
        break;
      case "-":
        stack.push(left.minus(right));
        break;
      case "*":
        stack.push(left.times(right));
        break;
      case "/":
        stack.push(left.div(right));
        break;
      default:
        throw new Error("Unknown operator");
    }
  });

  if (stack.length !== 1) {
    throw new Error("Invalid expression");
  }
  return stack[0];
}
