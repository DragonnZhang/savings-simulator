# Quickstart: Savings Simulator

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Core Library

The core logic is in `packages/savings-core`.

**Run Unit Tests**:
```bash
npm test -w packages/savings-core
```

**Run CLI**:
```bash
npm run cli -w packages/savings-core -- --help
```

### Web Application

The interactive dashboard is in `apps/web`.

**Start Dev Server**:
```bash
npm run dev -w apps/web
```
Open [http://localhost:3000](http://localhost:3000)

## Build

**Build all workspaces**:
```bash
npm run build --workspaces
```
