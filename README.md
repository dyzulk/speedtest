# React Vite Speedtest

A high-performance, real-time internet speed test web application built with React 19, TypeScript, and Vite. Powered by the official `@cloudflare/speedtest` SDK, the engine conducts network telemetry directly against Cloudflare's global edge infrastructure to measure bandwidth, latency, jitter, and packet loss.

## Key Features

- **Cloudflare Edge Engine**: Executes multi-threaded network diagnostics directly against Cloudflare edge servers using `@cloudflare/speedtest`.
- **GSAP Speedometer Gauge**: High-performance SVG circular gauge with dynamic stroke fills, zero rotational drift, and sharp architectural aesthetics matching the Shadcn UI Sera design system.
- **Real-Time Telemetry Interpolation**: Custom animation hooks (`useRealtimeValue` and `useSpeedometerAnimation`) preventing UI stutter during high-frequency bandwidth telemetry streams.
- **Comprehensive Metrics Suite**: Measures download speed, upload speed, unloaded and loaded latency (ping), jitter, and packet loss with automated connection stability classification.
- **Hybrid Offline Storage**: Automatic persistence of speed test records to IndexedDB using Dexie and Drizzle ORM schemas for localized historical tracking.
- **React 19 & React Compiler**: Optimized application runtime utilizing automatic memoization (`babel-plugin-react-compiler`) and Vite instant HMR.
- **Tailwind CSS v4 & Theme Toggle**: Modern styling pipeline paired with `next-themes` for seamless light and dark mode switching.

## Tech Stack

| Category | Technology |
| --- | --- |
| Core Framework | React 19, TypeScript, Vite 8 |
| Compiler & Plugins | Babel React Compiler, `@vitejs/plugin-react` |
| Engine & SDK | `@cloudflare/speedtest` |
| Animation Engine | GSAP (GreenSock), `@gsap/react` |
| Styling & UI | Tailwind CSS v4, Shadcn UI (Sera Preset), Lucide React |
| Database & Storage | Dexie (IndexedDB), Drizzle ORM |
| Deployment & Hosting | Cloudflare Pages, Wrangler CLI |

## Project Structure

The codebase follows a modular structure focused on Developer Experience (DX) and clear separation of concerns:

```text
speedtest/
├── functions/               # Cloudflare Pages Functions & API routing
├── public/                  # Static assets and favicons
├── src/
│   ├── components/
│   │   ├── sections/        # Major application views
│   │   │   ├── DiagnosticsSection.tsx  # Stability diagnostics & packet loss reporting
│   │   │   ├── FooterSection.tsx       # Application footer with branding telemetry
│   │   │   ├── HeaderSection.tsx       # Navigation header & theme controls
│   │   │   ├── HistorySection.tsx      # Test history data table (Lazy loaded)
│   │   │   ├── MetricsSection.tsx      # Real-time metrics grid
│   │   │   ├── SpeedometerSection.tsx  # Gauge presentation wrapper
│   │   │   └── speedometer/           # SVG Gauge component & action triggers
│   │   └── ui/              # Primitive UI components (Shadcn primitives)
│   ├── contexts/            # React Context providers (Theme & Settings)
│   ├── db/                  # Drizzle ORM schema definitions
│   ├── gsap/                # GSAP library setup and plugin registrations
│   ├── hooks/               # Custom hooks (useSpeedtest, useRealtimeValue, etc.)
│   ├── lib/                 # Utility functions and Dexie database helpers
│   ├── types/               # TypeScript type definitions and state interfaces
│   ├── App.tsx              # Main layout shell and lifecycle logging
│   └── main.tsx             # Application bootstrapper
├── drizzle.config.ts        # Drizzle ORM configuration
├── vite.config.ts           # Vite bundler configuration
└── wrangler.jsonc           # Cloudflare Pages deployment deployment configuration
```

## Getting Started

### Prerequisites

Ensure you have the following tools installed locally:

- Node.js (v20.0.0 or higher recommended)
- pnpm (v9.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/speedtest.git
   cd speedtest
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Local Development

Launch the Vite development server with hot module replacement:

```bash
pnpm dev
```

Open your browser and navigate to `http://localhost:5173`.

### Type Checking & Linting

To validate TypeScript types across the codebase without emitting code:

```bash
pnpm typecheck
```

To run ESLint across all source files:

```bash
pnpm lint
```

### Production Build & Local Edge Preview

To compile the application and preview it inside a local Cloudflare Pages environment:

```bash
pnpm preview
```

This command runs `pnpm run build` and boots up `wrangler pages dev ./dist --port 5173`.

### Deployment

Deploy the application directly to Cloudflare Pages:

```bash
pnpm deploy
```

## Available Scripts

The following scripts are defined in `package.json`:

| Command | Description |
| --- | --- |
| `pnpm dev` | Starts the Vite development server. |
| `pnpm build` | Compiles TypeScript types and builds production bundle into `dist/`. |
| `pnpm typecheck` | Runs `tsc --noEmit` to verify type safety. |
| `pnpm lint` | Executes ESLint to verify code quality. |
| `pnpm preview` | Builds production artifacts and runs local Cloudflare Pages worker preview. |
| `pnpm deploy` | Builds production artifacts and deploys bundle to Cloudflare Pages via Wrangler. |
| `pnpm db:generate` | Generates database migration files using Drizzle Kit. |
| `pnpm cf-typegen` | Generates TypeScript definitions for Cloudflare environment bindings. |

## Engineering Highlights

### Telemetry Synchronization & State Management
Network measurements stream directly from `@cloudflare/speedtest` socket events. The orchestrator hook `useSpeedtest` synchronizes latency testing, download probing, and upload tests into discrete execution stages (`idle`, `latency`, `download`, `upload`, `completed`). This state machine guarantees that bandwidth measurements run without telemetry cross-contamination.

### GSAP-Driven SVG Speedometer
Rather than relying on heavy third-party Canvas elements or rotating DOM components that suffer from rotational pivot displacement, the speedometer gauge uses a fixed SVG arc. Speed telemetry is dynamically mapped to SVG stroke dash offsets via GSAP (`gsap` and `@gsap/react`), yielding fluid 60fps gauge fill animations even under high CPU network processing load.

## License

Distributed under the MIT License. See `LICENSE` for more information.
