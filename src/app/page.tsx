import Calculator from "../components/Calculator"
import ProjectFooter, { BackToPortfolio } from "../components/ProjectFooter"

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-900 text-white antialiased">
      {/* Moving, pulsing grid, drawn with CSS so the calculator doesn't re-render every frame. */}
      <div aria-hidden className="grid-backdrop" />
      <header className="relative p-4">
        <BackToPortfolio />
      </header>
      <main className="relative flex flex-1 items-center justify-center px-4 pb-8">
        <Calculator />
      </main>
      <div className="relative">
        <ProjectFooter />
      </div>
    </div>
  )
}
