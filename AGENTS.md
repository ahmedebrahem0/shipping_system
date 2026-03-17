# AGENTS.md - Shipping Frontend

## Project Overview

A Next.js 16 shipping management frontend with TypeScript, Redux Toolkit, React Hook Form, and Tailwind CSS. Interfaces with a .NET backend at `http://localhost:5050`.

---

## Commands

### Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
```

### Build
```bash
npm run build        # Production build
npm run start        # Start production server
```

### Linting
```bash
npm run lint         # Run ESLint on entire project
npx eslint src/app  # Lint specific directory
npx eslint file.ts   # Lint specific file
```

### Type Checking
```bash
npx tsc --noEmit     # TypeScript type check only
```

**Note:** No test framework is currently configured. Do not add tests without consulting the team.

---

## Code Style

### TypeScript
- Strict mode enabled in `tsconfig.json`
- Always define explicit types; avoid `any`
- Use `interface` for objects, `type` for unions/aliases
- Use `import type` for type-only imports

### Naming Conventions
- **Files:** kebab-case (e.g., `login-form.tsx`, `auth-slice.ts`)
- **Components:** PascalCase (e.g., `OrderTable.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useDeliveries.ts`)
- **Variables/Functions:** camelCase
- **Constants:** SCREAMING_SNAKE_CASE for config values, PascalCase for enums

### Imports
```typescript
// Use @ alias for src/
import { useAppDispatch } from "@/store/hooks";
import type { AuthUser } from "@/types/auth.types";
import { cn } from "@/lib/utils/cn";

// Order: external → internal → relative
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import styles from "./Component.module.css";
```

### React/Next.js
- Use Server Components by default; add `"use client"` only when needed
- Prefer functional components with hooks
- Extract reusable logic into custom hooks in `features/{feature}/hooks/`
- Use React Hook Form for all forms with Yup validation schemas

### Folder Structure (Feature-Based)
```
src/features/{feature}/
├── schema/           # Yup validation schemas
├── hooks/            # Custom React hooks
├── components/       # Feature-specific components
└── page.tsx          # Route page
```

### Styling
- Use Tailwind CSS for all styling
- Use `cn()` utility from `@/lib/utils/cn` to merge classes
- Follow shadcn/ui patterns for components
- Use CSS variables for theming (see `tailwind.config.js`)

### State Management
- Use Redux Toolkit for global state
- Use RTK Query for API calls (in `src/store/slices/api/`)
- Use local `useState` for component-only state

### Error Handling
- Use try/catch with async functions
- Display errors with Sonner toasts
- Show user-friendly error messages from API responses

### File Order (Per Feature)
1. Types (`types/`)
2. Schema (`features/*/schema/`)
3. Hooks (`features/*/hooks/`)
4. Components (`features/*/components/`)
5. Page (`features/*/page.tsx`)

---

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5050
```

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| next 16 | Framework |
| @reduxjs/toolkit | State management |
| react-hook-form | Forms |
| yup | Validation |
| tailwindcss | Styling |
| lucide-react | Icons |
| sonner | Toasts |

---

## API Integration

- Base URL: `NEXT_PUBLIC_API_URL` from env
- Auth: JWT Bearer token in `localStorage`
- Use RTK Query endpoints defined in `src/constants/api-endpoints.ts`
- Handle 401 errors with redirect to `/login`

---

## Routes

| Path | Description |
|------|-------------|
| `/login` | Authentication |
| `/dashboard` | Main dashboard |
| `/orders` | Order management |
| `/merchants` | Merchant management |
| `/deliveries` | Delivery management |
| `/branches` | Branch management |
| `/settings` | System settings |
| `/reports` | Reports |
| `/profile` | User profile |

---

## Important Notes

- This codebase uses Arabic comments in some places
- The backend uses numeric IDs for some entities, strings for others (check types)
- Role-based access: Admin, Employee, Merchant, Delivery
- Always run `npm run lint` before committing
