## Overview
- Add the community component from `https://21st.dev/r/tonyzebastian/img-sphere` using the shadcn CLI.
- Create a new page at `src/pages/New.jsx` and expose it at the route `#/new` inside the existing `HashRouter`.
- Keep all code under existing folders and conventions, and add console logs in the new files.

## Prerequisites
- Tailwind is already configured (`tailwind.config.js`, `src/styles/index.css`).
- No `components.json` exists yet; initialize shadcn for this Vite + React app so components are placed under `src/components/ui`.

## Install Component
1. Initialize shadcn (only if `components.json` is missing):
   - Run: `npx shadcn@latest init`
   - Choose: React + Vite, base dir `src/components`, subdir `ui`, accept TypeScript components (TSX) for compatibility.
2. Add the component:
   - Run: `npx shadcn@latest add https://21st.dev/r/tonyzebastian/img-sphere`
   - Accept any prompted dependencies; the CLI will install/import them automatically into the project.

## Create Page `/New`
- File: `src/pages/New.jsx`
- Content:
  - Import the installed component from `src/components/ui` (exact export name from the generated file, likely default export).
  - Render inside a responsive container with Tailwind classes.
  - Include `console.log('New page mounted')` and a simple interaction log when the component loads (to meet the project rule).

## Add Route
- File: `src/App.jsx`
- Under `MainApp` routes, add:
  - `Route path="/new" element={<ProtectedRoute allowedRoles={["admin","cashier","member"]}><New /></ProtectedRoute>} />`
- Import: `import New from './pages/New'`
- This keeps the route accessible to all authenticated roles under the existing `Layout` and `HashRouter`.

## Styling & Assets
- Use the component’s built-in Tailwind classes. No separate CSS file unless the generated component requires one.
- If it ships additional assets or utility files, they remain under `src/components/ui` per shadcn conventions.

## Verification
- Start the dev server: `npm run dev -- --host`
- Navigate to `#/new` and verify the component renders and behaves as expected.
- Check the browser console for the logs added in `New.jsx` and any component-side logs.

## Notes
- We will follow existing code style (JSX + Tailwind) and keep files organized under `src/pages` and `src/components/ui`.
- No commits will be made unless you request them.
- If the generated component requires extra peer deps (e.g., `lucide-react`, Radix), they’ll be installed; `lucide-react` already exists in `package.json`.