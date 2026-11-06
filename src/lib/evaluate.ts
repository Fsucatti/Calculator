/** Thrown when an expression divides by zero, so the calculator can say so. */
export class DivisionByZeroError extends Error {
  constructor() {
    super("Can't divide by zero")
  }
}

/**
 * Evaluates what the calculator builds: numbers joined by + - × ÷.
 * Multiplication and division go first. Throws if the expression is incomplete.
 */
export function evaluate(expression: string): number {
  // A number can start with a minus sign at the beginning of the expression or right
  // after an operator. Previous results can also use exponents, such as 1e+21.
  const tokens = expression.match(/(?:^-|(?<=[+\-×÷])-)?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[+\-×÷]/g)
  if (!tokens || tokens.join("") !== expression) throw new Error("Invalid expression")

  const values: number[] = []
  let operator = "+"

  tokens.forEach((token, index) => {
    const expectsNumber = index % 2 === 0
    if (!expectsNumber) {
      operator = token
      return
    }

    const value = Number(token)
    if (Number.isNaN(value)) throw new Error("Invalid expression")

    if (operator === "×") values.push(values.pop()! * value)
    else if (operator === "÷") {
      if (value === 0) throw new DivisionByZeroError()
      values.push(values.pop()! / value)
    } else values.push(operator === "-" ? -value : value)
  })

  if (tokens.length % 2 === 0) throw new Error("Incomplete expression")
  return tidy(values.reduce((sum, value) => sum + value, 0))
}

/**
 * Hides binary rounding noise, so 1.1 + 2.2 shows 3.3 instead of 3.3000000000000003.
 * Twelve significant digits fit the display and keep every result a calculator expects.
 */
export function tidy(value: number): number {
  if (value === 0) return 0 // Also turns -0 into 0.
  if (!Number.isFinite(value)) return value
  return Number(value.toPrecision(12))
}
