# Admin

A modern admin dashboard built with React, Vite, Tailwind CSS, and TypeScript.

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | ^19 | UI framework |
| [Vite](https://vite.dev/) | ^8 | Build tool & dev server |
| [TypeScript](https://www.typescriptlang.org/) | ^6 | Type safety |
| [react-router-dom](https://reactrouter.com/) | ^7 | Client-side routing |
| [Zustand](https://zustand-demo.pmnd.rs/) | ^5 | Global state management |
| [Tailwind CSS](https://tailwindcss.com/) | ^4 | Utility-first styling |
| [SCSS (Sass)](https://sass-lang.com/) | latest | CSS preprocessor for component styles |
| [ESLint](https://eslint.org/) | ^10 | Code linting & coding conventions |
| [Prettier](https://prettier.io/) | latest | Code formatting |

## Requirements

- **Node.js** `>=24.0.0`
- **npm** `>=10`

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run format` | Format source files with Prettier |
| `npm run format:check` | Check formatting without writing changes |

## Project Structure

```
admin/
├── public/                  # Static assets served at root
├── src/
│   ├── assets/              # Images, SVGs, fonts
│   ├── components/
│   │   └── ui/              # Reusable UI primitives
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Page layout wrappers
│   │   ├── MainLayout.tsx
│   │   └── MainLayout.module.scss
│   ├── pages/               # Route-level page components
│   │   ├── Home/
│   │   │   ├── Home.tsx
│   │   │   └── Home.module.scss
│   │   └── NotFound/
│   │       ├── Home.tsx
│   │       └── NotFound.module.scss
│   ├── router/
│   │   └── Home.tsx        # React Router configuration
│   ├── stores/
│   │   └── user.store.ts   # Zustand global store
│   ├── styles/
│   │   ├── _variables.scss  # Design tokens (colors, spacing, etc.)
│   │   ├── _mixins.scss     # Reusable SCSS mixins
│   │   └── main.scss        # Global styles + Tailwind entry point
│   ├── types/               # Shared TypeScript type definitions
│   ├── utils/               # Helper functions
│   ├── App.tsx
│   └── main.tsx
├── .eslintrc / eslint.config.js
├── .gitignore
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Styling Conventions

- **Tailwind CSS** for utility classes directly in JSX.
- **SCSS Modules** (`*.module.scss`) for component-scoped styles.
- **Global styles** live in `src/styles/main.scss`.
- **Design tokens** (colors, spacing, breakpoints) are defined in `src/styles/_variables.scss` and consumed via `@use`.
- **Mixins** (responsive helpers, flex utils, etc.) live in `src/styles/_mixins.scss`.

## State Management

Global state is managed by [Zustand](https://zustand-demo.pmnd.rs/). Stores live in `src/stores/` and follow the `use<StoreName>Store` naming convention. The `devtools` and `persist` middlewares are enabled by default.

## Path Aliases

The `@` alias maps to `src/`, allowing clean imports:

```ts
import userStore from '@/stores/userStore'
import MainLayout from '@/layouts/MainLayout'
```

## ESLint Config

Rules are defined in `eslint.config.js` using the flat config format and cover:

- TypeScript strict rules via `typescript-eslint`
- React best practices via `eslint-plugin-react` and `eslint-plugin-react-hooks`
- General JS best practices (prefer-const, eqeqeq, no-var, etc.)
