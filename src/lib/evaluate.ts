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
    else if (operator === "÷") values.push(values.pop()! / value)
    else values.push(operator === "-" ? -value : value)
  })

  if (tokens.length % 2 === 0) throw new Error("Incomplete expression")
  return values.reduce((sum, value) => sum + value, 0)
}
