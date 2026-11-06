import type { Metadata } from "next"
import "./globals.css"

const description = "A stylish calculator with memory, history, and a programmer mode."

export const metadata: Metadata = {
  metadataBase: new URL("https://calculator-fsucatti.fsucatti-portfolio.workers.dev"),
  title: "Calculator App",
  description,
  // Preview shown when the link is shared in chats and social networks.
  openGraph: { type: "website", title: "Calculator App", description, images: [{ url: "/og.jpg", width: 800, height: 420 }] },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
