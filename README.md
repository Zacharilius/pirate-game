https://kenney.nl/assets/pirate-pack


# Rsbuild Project

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get Started

Start the dev server:

```bash
pnpm dev
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Publish

publishes the repo as a rsbuild package that can be consumed by other rsbuild packages.

```bash
pnpm publish
```

In other application, add this to your rsbuild.config.ts
```bash
  source: {
    entry: {
      index: './src/index.tsx',  // Other application
      'priates-game': './node_modules/@zacharilius/priates-game/src/index.ts',
    },
  },
```