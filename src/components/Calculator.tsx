"use client"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { DivisionByZeroError, evaluate, tidy } from "@/lib/evaluate"

type ButtonInfo = {
  label: string
  /** Name read by screen readers when the label is a symbol. */
  name?: string
  wide?: boolean
  tall?: boolean
  variant?: "default" | "operator" | "clear" | "memory"
}

const buttons: ButtonInfo[] = [
  { label: "MC", name: "Memory clear", variant: "memory" },
  { label: "MR", name: "Memory recall", variant: "memory" },
  { label: "M+", name: "Memory add", variant: "memory" },
  { label: "M-", name: "Memory subtract", variant: "memory" },

  { label: "C", name: "Clear", variant: "clear" },
  { label: "⌫", name: "Delete", variant: "operator" },
  { label: "÷", name: "Divide", variant: "operator" },
  { label: "×", name: "Multiply", variant: "operator" },

  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "-", name: "Subtract", variant: "operator" },

  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "+", name: "Add", variant: "operator" },

  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "=", name: "Equals", variant: "operator", tall: true },

  { label: "0", wide: true },
  { label: ".", name: "Decimal point" },
]

const OPERATORS = ["÷", "×", "-", "+"]
const isOperator = (key: string) => OPERATORS.includes(key)
/** The number being typed: whatever follows the last operator. */
const lastNumber = (expression: string) => expression.split(/(?<=\d|\.)[+\-×÷]/).pop() ?? ""

export default function Calculator() {
  const [expression, setExpression] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [showProgrammer, setShowProgrammer] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  // After "=", a digit starts a new calculation and an operator continues from the result.
  const justEvaluated = useRef(false)

  const current = lastNumber(expression)
  const display = message ?? (current === "" || current === "-" ? current || "0" : current)
  const shownValue = Number.parseFloat(current)

  const handleClick = (key: string) => {
    setMessage(null)
    const fresh = justEvaluated.current
    justEvaluated.current = false

    switch (key) {
      case "C":
        return setExpression("")
      case "⌫":
        return setExpression(fresh ? "" : expression.slice(0, -1))
      case "=":
        return calculateResult()
      case "MC":
        return setMemory(0)
      case "MR": {
        // Recalled memory replaces the number being typed, or starts the next one.
        const base = fresh ? "" : expression
        return setExpression(base.slice(0, base.length - lastNumber(base).length) + String(memory))
      }
      case "M+":
      case "M-":
        if (Number.isFinite(shownValue)) setMemory((m) => tidy(key === "M+" ? m + shownValue : m - shownValue))
        justEvaluated.current = fresh
        return
    }

    if (isOperator(key)) {
      if (expression === "") return key === "-" ? setExpression("-") : undefined
      if (expression === "-") return
      // Pressing a second operator replaces the first one.
      if (isOperator(expression.slice(-1))) return setExpression(expression.slice(0, -1) + key)
      return setExpression(expression + key)
    }

    const base = fresh ? "" : expression
    if (key === ".") {
      if (lastNumber(base).includes(".")) return
      return setExpression(base + (lastNumber(base) === "" || lastNumber(base) === "-" ? "0." : "."))
    }
    // Avoid numbers like 007.
    if (lastNumber(base) === "0") return setExpression(base.slice(0, -1) + key)
    setExpression(base + key)
  }

  const calculateResult = () => {
    if (expression === "") return
    try {
      const value = evaluate(expression)
      if (!Number.isFinite(value)) throw new Error("Too big")
      const result = String(value)
      setHistory((prev) => [`${expression} = ${result}`, ...prev].slice(0, 10))
      setExpression(result)
      justEvaluated.current = true
    } catch (error) {
      setMessage(error instanceof DivisionByZeroError ? "Can't divide by 0" : "Error")
      setExpression("")
    }
  }

  // Keyboard input. The handler is refreshed after each render so it always sees the latest state.
  const handler = useRef<(e: KeyboardEvent) => void>(() => {})
  useEffect(() => {
    handler.current = onKey
  })
  const onKey = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const keyMap: Record<string, string> = {
      "/": "÷",
      "*": "×",
      "-": "-",
      "+": "+",
      Enter: "=",
      "=": "=",
      Backspace: "⌫",
      Escape: "C",
      Delete: "C",
      ".": ".",
      ",": ".",
    }
    const key = keyMap[e.key] ?? (/^\d$/.test(e.key) ? e.key : null)
    if (!key) return
    e.preventDefault()
    handleClick(key)
  }
  useEffect(() => {
    const listener = (e: KeyboardEvent) => handler.current(e)
    window.addEventListener("keydown", listener)
    return () => window.removeEventListener("keydown", listener)
  }, [])

  // Programmer mode shows the whole-number part of the value on screen.
  const whole = Number.isFinite(shownValue) ? Math.trunc(shownValue) : 0
  const sign = whole < 0 ? "-" : ""
  const binary = sign + Math.abs(whole).toString(2)
  const hex = sign + Math.abs(whole).toString(16).toUpperCase()

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div
      className="
        bg-slate-950/70
        rounded-2xl
        p-6
        w-full max-w-[360px]
        flex flex-col gap-4
        backdrop-blur-md
        shadow-[0_0_25px_rgba(34,211,238,0.4)]
        border border-cyan-500/20
      "
    >
      {/* Expression */}
      <div className="flex justify-between gap-2 bg-slate-900/70 backdrop-blur-sm rounded-md p-2 text-sm text-cyan-300 font-mono">
        <span className="text-cyan-500" title={memory !== 0 ? `Memory: ${memory}` : undefined}>
          {memory !== 0 ? "M" : ""}
        </span>
        <span className="truncate text-right">{expression || "0"}</span>
      </div>

      {/* Display */}
      <output
        aria-live="polite"
        className="bg-slate-900/80 backdrop-blur-sm rounded-md p-4 text-right text-3xl font-mono tracking-wider text-cyan-200 shadow-inner border border-cyan-500/30 truncate"
      >
        {display}
      </output>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <motion.button
            key={btn.label}
            aria-label={btn.name}
            onClick={() => handleClick(btn.label)}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(34,211,238,0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`rounded-md border uppercase font-semibold transition-colors
              ${btn.variant === "memory" ? "py-2 text-xs bg-slate-900 border-cyan-700/50 text-cyan-400 hover:bg-slate-800" : "py-3"}
              ${btn.variant === "clear" ? "bg-red-700/50 border-red-500 text-red-200 hover:bg-red-600/60" : ""}
              ${btn.variant === "operator" ? "bg-cyan-900/40 border-cyan-400 text-cyan-200 hover:bg-cyan-700/50" : ""}
              ${!btn.variant ? "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700" : ""}
              ${btn.wide ? "col-span-2" : ""}
              ${btn.tall ? "row-span-2" : ""}`}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>

      {/* Programmer Mode Toggle */}
      <button
        onClick={() => setShowProgrammer(!showProgrammer)}
        className="mt-2 py-2 px-4 bg-slate-800 text-cyan-300 rounded-md border border-cyan-400/30 text-sm"
      >
        {showProgrammer ? "Hide Programmer Mode" : "Show Programmer Mode"}
      </button>

      {/* Programmer Mode Panel */}
      {showProgrammer && (
        <div className="bg-slate-800/60 rounded-md p-3 text-sm text-cyan-400 font-mono border border-cyan-500/30 flex flex-col gap-2">
          <div className="flex justify-between items-center gap-2">
            <span className="break-all"><strong>Binary:</strong> {binary}</span>
            <button
              onClick={() => copyToClipboard(binary)}
              className="bg-cyan-700/40 px-2 py-1 rounded text-xs hover:bg-cyan-600/60"
            >
              Copy
            </button>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="break-all"><strong>Hex:</strong> {hex}</span>
            <button
              onClick={() => copyToClipboard(hex)}
              className="bg-cyan-700/40 px-2 py-1 rounded text-xs hover:bg-cyan-600/60"
            >
              Copy
            </button>
          </div>
          {current.includes(".") && (
            <div className="text-xs text-gray-400">
              *Fractional part truncated in binary/hex
            </div>
          )}
        </div>
      )}

      {/* History Toggle */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="mt-2 py-2 px-4 bg-slate-800 text-cyan-300 rounded-md border border-cyan-400/30 text-sm"
      >
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {/* History Panel */}
      {showHistory && (
        <div className="bg-slate-800/60 rounded-md p-3 text-sm text-cyan-300 font-mono border border-cyan-500/30 max-h-32 overflow-y-auto">
          {history.length === 0 && <div className="text-gray-400">No history yet</div>}
          {history.map((entry, i) => (
            <div key={i} className="truncate">{entry}</div>
          ))}
        </div>
      )}
    </div>
  )
}
