"use client"

import { useEffect, useState } from "react"
import Calculator from "../components/Calculator"

export default function HomePage() {
  const [offset, setOffset] = useState(0)
  const [pulse, setPulse] = useState(0.05)

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now()

      // Move the grid diagonally
      setOffset((prev) => (prev + 0.5) % 40)

      // Pulsate opacity slower and brighter (0.05 -> 0.15)
      setPulse(0.05 + 0.1 * Math.abs(Math.sin(time / 1200)))
    }, 16)

    return () => clearInterval(interval)
  }, [])

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-slate-900 text-white antialiased"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(34,211,238,${pulse}) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(34,211,238,${pulse}) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        backgroundPosition: `${offset}px ${offset}px`,
      }}
    >
      <Calculator />
    </main>
  )
}
