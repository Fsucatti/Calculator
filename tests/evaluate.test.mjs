// Run with: npm test (Node 22.18 or newer runs the TypeScript file directly).
import { test } from "node:test"
import assert from "node:assert/strict"
import { DivisionByZeroError, evaluate } from "../src/lib/evaluate.ts"

test("multiplication and division go first", () => {
  assert.equal(evaluate("2+3×4"), 14)
  assert.equal(evaluate("8-6÷2"), 5)
})

test("hides binary rounding noise", () => {
  assert.equal(evaluate("1.1+2.2"), 3.3)
  assert.equal(evaluate("0.1×3"), 0.3)
  assert.equal(evaluate("1÷3×3"), 1)
})

test("negative numbers and exponents from earlier results", () => {
  assert.equal(evaluate("-5+2"), -3)
  assert.equal(evaluate("4×-2"), -8)
  assert.equal(evaluate("1e+21×2"), 2e21)
})

test("dividing by zero says so", () => {
  assert.throws(() => evaluate("7÷0"), DivisionByZeroError)
})

test("incomplete or invalid expressions throw", () => {
  assert.throws(() => evaluate("5+"))
  assert.throws(() => evaluate("5 + 2"))
  assert.throws(() => evaluate(""))
})
