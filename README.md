# Wardrobe App

A React application built with TypeScript and Biome for linting/formatting.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Biome** - Fast linter and formatter

## API Integration

The app is configured to proxy API requests to `https://localhost:8443`. API documentation is available at:
- https://localhost:8443/swagger-ui/index.html

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Code Quality

### Linting

Check for linting issues:

```bash
npm run lint
```

Auto-fix linting issues:

```bash
npm run lint:fix
```

### Formatting

Format all files:

```bash
npm run format
```

## Project Structure

```
wardrobe/
├── src/
│   ├── App.tsx          # Main App component
│   ├── App.css          # App styles
│   ├── main.tsx         # Entry point
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # Vite type definitions
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── biome.json           # Biome configuration
└── package.json         # Project dependencies
```

## Configuration

### Vite

The Vite configuration (`vite.config.ts`) includes:
- React plugin for Fast Refresh
- Dev server on port 3000
- API proxy to `https://localhost:8443`

### Biome

Biome is configured with:
- Single quotes for JavaScript/TypeScript
- Double quotes for JSX
- 2-space indentation
- Recommended rules enabled
- Auto import organization

### TypeScript

TypeScript is configured with:
- Strict mode enabled
- ES2020 target
- React JSX support
- Path resolution via bundler

