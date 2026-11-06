# Calculator App

A calculator with keyboard input, memory, history, and a programmer mode that shows binary and hexadecimal.

**Built with:** Next.js, Framer Motion and Tailwind CSS.

## Run it locally

You need Node 22. `next build` can fail on Node 26.

```bash
npm install
npm run dev
```

To run the tests:

```bash
npm test
```

## Change things

| To change | Edit |
|---|---|
| Buttons, layout and memory | `src/components/Calculator.tsx` |
| How expressions are calculated | `src/lib/evaluate.ts` |
