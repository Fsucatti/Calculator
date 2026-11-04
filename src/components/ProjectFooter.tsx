const PORTFOLIO_URL = "https://fsucatti-portfolio.fsucatti-portfolio.workers.dev/projects"

/** The cat from the portfolio's logo. Removing it is not recommended: the cat will find out. */
export function CatIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M14 9V3L11 4H8L5 3V9L9.5 11L14 9ZM14 9L20 12L22 18L20 21H4L2 19L4 17L2 15L4 13M7 21V9.88889M11 15V21L16.0435 16H18M8 7L8.00707 7.00707M11 7L11.0071 7.00707" />
    </svg>
  )
}

export function BackToPortfolio() {
  return (
    <a
      href={PORTFOLIO_URL}
      className="group inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-slate-900/80 px-3 py-1.5 text-sm text-cyan-300 transition-colors hover:border-cyan-300 hover:text-cyan-100"
    >
      <CatIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
      <span>Back to portfolio</span>
    </a>
  )
}

export default function ProjectFooter() {
  return (
    <footer className="border-t border-cyan-500/20 bg-slate-950/80 px-6 py-5 text-sm text-slate-400">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <CatIcon className="h-7 w-7 shrink-0 text-cyan-300" />
          <p>
            <span className="font-medium text-slate-200">Calculator App</span> by Francisco Sucatti.
            <br />
            Built with Next.js, Framer Motion, and Tailwind CSS.
          </p>
        </div>
        <nav aria-label="Project links" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <a className="hover:text-cyan-200" href={PORTFOLIO_URL}>Portfolio</a>
          <a className="hover:text-cyan-200" href="https://github.com/Fsucatti/Calculator" target="_blank" rel="noopener noreferrer">Source code</a>
          <a className="hover:text-cyan-200" href="https://www.linkedin.com/in/fsucatti" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </nav>
      </div>
    </footer>
  )
}
