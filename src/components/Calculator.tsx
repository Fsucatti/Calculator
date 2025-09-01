"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [expression, setExpression] = useState("")
  const [showProgrammer, setShowProgrammer] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState<string[]>([])

  type ButtonInfo = {
  label: string
  span?: number
  variant?: "default" | "operator" | "clear"
}

const buttons: ButtonInfo[] = [
  { label: "C", variant: "clear" },
  { label: "÷", variant: "operator" },
  { label: "×", variant: "operator" },
  { label: "-", variant: "operator" },

  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "+", variant: "operator" },

  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "=", variant: "operator" },

  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: ".", variant: "operator" },

  { label: "0", span: 2 } // spans 2 columns
]


  const isOperator = (btn: string) => ["÷", "×", "-", "+", "="].includes(btn)

  // --- Handle button clicks ---
  const handleClick = (btn: string) => {
    if (btn === "C") {
      setDisplay("0")
      setExpression("")
      return
    }

    if (btn === "=") {
      calculateResult()
      return
    }

    if (btn === "M+") {
      setMemory((prev) => prev + parseFloat(display))
      return
    }

    if (btn === "M-") {
      setMemory((prev) => prev - parseFloat(display))
      return
    }

    if (btn === "MR") {
      setDisplay(memory.toString())
      setExpression(memory.toString())
      return
    }

    if (btn === "MC") {
      setMemory(0)
      return
    }

    if (isOperator(btn) && expression === "") return
    if (isOperator(btn) && isOperator(expression.slice(-1))) {
      setExpression(expression.slice(0, -1) + btn)
      setDisplay(btn)
      return
    }

    if (btn === ".") {
      const parts = expression.split(/[\+\-\×\÷]/)
      const lastNumber = parts[parts.length - 1]
      if (lastNumber.includes(".")) return
    }

    setExpression(expression + btn)
    setDisplay(btn)
  }

  // --- Calculate result ---
  const calculateResult = () => {
    try {
      const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/")
      const result = Function(`return ${sanitized}`)()
      setDisplay(result.toString())
      setExpression(result.toString())
      setHistory((prev) => [expression + " = " + result, ...prev].slice(0, 10))
    } catch {
      setDisplay("Error")
      setExpression("")
    }
  }

  // --- Keyboard input ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, string> = {
        "/": "÷",
        "*": "×",
        "-": "-",
        "+": "+",
        Enter: "=",
        Backspace: "C",
        ".": "."
      }
      if (e.key in keyMap) {
        handleClick(keyMap[e.key])
        e.preventDefault()
      } else if (!isNaN(Number(e.key))) {
        handleClick(e.key)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [display, expression, memory])

  // --- Programmer Mode (binary/hex) ---
  const [binary, setBinary] = useState("0")
  const [hex, setHex] = useState("0")

  useEffect(() => {
    const num = parseFloat(display)
    if (!isNaN(num) && Number.isFinite(num)) {
      const intPart = Math.trunc(num)
      const sign = intPart < 0 ? "-" : ""
      setBinary(sign + Math.abs(intPart).toString(2))
      setHex(sign + Math.abs(intPart).toString(16).toUpperCase())
    } else {
      setBinary("0")
      setHex("0")
    }
  }, [display])

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div
      className="
        bg-slate-950/70
        rounded-2xl
        p-6
        w-[360px]
        flex flex-col gap-4
        backdrop-blur-md
        shadow-[0_0_25px_rgba(34,211,238,0.4)]
        border border-cyan-500/20
      "
    >
      {/* Expression */}
      <div className="bg-slate-900/70 backdrop-blur-sm rounded-md p-2 text-right text-sm text-cyan-300 font-mono truncate">
        {expression || "0"}
      </div>

      {/* Display */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-md p-4 text-right text-3xl font-mono tracking-wider text-cyan-200 shadow-inner border border-cyan-500/30">
        {display}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2">
  {buttons.map((btn) => (
    <motion.button
      key={btn.label}
      onClick={() => handleClick(btn.label)}
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(34,211,238,0.5)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`py-3 rounded-md border uppercase font-semibold transition-colors
        ${btn.variant === "clear" ? "bg-red-700/50 border-red-500 text-red-200 hover:bg-red-600/60" : ""}
        ${btn.variant === "operator" ? "bg-cyan-900/40 border-cyan-400 text-cyan-200 hover:bg-cyan-700/50" : ""}
        ${!btn.variant ? "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700" : ""}
        ${btn.span ? `col-span-${btn.span}` : ""}`}
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
          <div className="flex justify-between items-center">
            <span><strong>Binary:</strong> {binary}</span>
            <button
              onClick={() => copyToClipboard(binary)}
              className="bg-cyan-700/40 px-2 py-1 rounded text-xs hover:bg-cyan-600/60"
            >
              Copy
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span><strong>Hex:</strong> {hex}</span>
            <button
              onClick={() => copyToClipboard(hex)}
              className="bg-cyan-700/40 px-2 py-1 rounded text-xs hover:bg-cyan-600/60"
            >
              Copy
            </button>
          </div>
          {display.includes(".") && (
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
