# OrbitDesk Frontend Architecture

OrbitDesk FE is a React single-page application for a multi-tenant support desk (tickets, contacts, groups, organizations, knowledge base, SLA, and an admin console).

It uses a **hybrid, feature-oriented structure**: domain API modules and feature components live in `features/`, while most screens are still page-level components in `pages/` that talk to Redux slices and `services/`.

## Tech Stack

| Concern       | Choice                                                  |
| ------------- | ------------------------------------------------------- |
| Build         | Vite 7 (`@` alias → `src`), dev proxy for `/api` and `/uploads` → `localhost:5000` |
| UI            | React 19, MUI 9 (`@mui/material`, Emotion), lucide-react icons |
| State         | Redux Toolkit + react-redux                             |
| Routing       | react-router-dom 7                                      |
| HTTP          | Axios (single shared instance)                          |
| Rich text     | Tiptap 3                                                |
| Charts/Export | Recharts, xlsx                                          |
| Forms extras  | mui-tel-input (phone field in Signup), react-hot-toast  |
| Tooling       | ESLint 9 (flat config) + Prettier                       |

## Folder Structure

```text
src/
├── main.jsx                 # Entry: Redux Provider → AppThemeProvider → App
├── App.jsx                  # Router + app shell
├── index.css                # Global CSS / CSS variables
│
├── routes/
│   └── AppRoutes.jsx        # All routes; pages are lazy-loaded behind Suspense
│
├── pages/                   # Route-level screens
│   ├── auth/                # Login, Signup, ForgotPassword
│   ├── admin/               # Admin console pages (AdminUsers, AdminSla, ...)
│   └── *.jsx                # Dashboard, TicketsList, TicketDetail, Contacts, ...
│                            # plus their modals (AgentModal, GroupModal, ...)
│
├── features/                # Domain modules
│   ├── auth/                # api/auth.js, ProtectedRoute, AdminRoute
│   ├── tickets/             # api/tickets.js
│   ├── contacts/            # api/users.js
│   ├── groups/              # api/groups.js
│   ├── organizations/       # api/organizations.js
│   ├── knowledgeBase/       # api/knowledgeBase.js
│   └── settings/            # api/sla.js, SlaPolicyForm, SlaPolicyList
│
├── components/              # Shared, business-agnostic components
│   ├── ui/                  # Button, Input/Select/Textarea, Modal, DataTable, Badge, ...
│   ├── layout/              # Sidebar, TopNavbar, AdminLayout/Sidebar/Topbar, PageContainer
│   ├── ai/                  # ChatbotWidget, SmartReplyModal
│   ├── editor/              # RichTextEditor (Tiptap)
│   └── SearchDropdown.jsx
│
├── store/                   # Redux
│   ├── index.js             # configureStore
│   ├── hooks.js             # useAppDispatch / useAppSelector
│   └── slices/              # auth, tickets, ticketDetail, contacts, groups,
│                            # organizations, theme, ui
│
├── services/                # Standalone API clients (ai, auditLog, dashboard,
│                            # notification, rating, report, role, settings)
│
├── theme/                   # MUI theme
│   ├── tokens.js            # Design tokens
│   ├── theme.js             # buildTheme(mode)
│   └── AppThemeProvider.jsx # Reads mode from Redux, provides MUI theme
│
├── context/ThemeContext.jsx # Legacy theme context (Redux themeSlice is the source of truth)
├── lib/axios.js             # Shared Axios instance + interceptors
└── utils/                   # Constants/helpers (e.g. ticketConstants.js)
```

## Application Flow

```text
main.jsx
 └─ Redux <Provider store>
     └─ <AppThemeProvider>   (MUI theme from themeSlice: light | dark)
         └─ <App>
             └─ <AppRoutes>  (Suspense + lazy pages)
                 ├─ Public:    /, /login, /signup, /forgot-password
                 ├─ Protected: <ProtectedRoute> → /dashboard, /tickets, /contacts, ...
                 ├─ Admin:     <AdminRoute> → <AdminLayout> → /admin/*
                 └─ *          NotFound
```

- **Auth**: the JWT is held in an httpOnly cookie (`withCredentials: true`). `ProtectedRoute` and `AdminRoute` guard routes using `authSlice`. A `401` response clears the stored `user` and redirects to `/login`.
- **Data**: pages dispatch thunks from slices, which call `features/*/api` or `services/*`. Those use the shared Axios instance in `lib/axios.js` (`baseURL = VITE_API_URL`).
- **Theme**: the mode is stored in `themeSlice` (persisted in localStorage under `supportdesk-theme`). `AppThemeProvider` builds the MUI theme from it, and `data-theme` is set on `<html>` at boot for CSS-variable styling.

## Conventions

1. **Imports**: use the `@/` alias for anything under `src` (e.g. `import { Button } from "@/components/ui/Button"`).
2. **Shared UI**: `components/ui` must not contain business logic. Use the custom `Input`, `Select`, and `Textarea` for form fields so labels, sizing, and error states stay consistent.
3. **Styling**: MUI `sx` and theme tokens first. Avoid new global CSS; the few existing `.css` files are component-scoped legacy.
4. **Routes**: lazy-load every page in `AppRoutes.jsx` and wrap it with the right guard.
5. **API layer**: no raw `fetch` or ad-hoc Axios instances. Always use `lib/axios.js`.
6. **Layering**: pages → (slices | features | services) → `lib/axios`. Shared components never import from pages or features.
7. **Formatting**: Prettier (`npm run format`, `npm run format:check`) with double quotes and trailing commas. `eslint-config-prettier` keeps ESLint from conflicting. Run `npm run lint` before committing.

## Adding a New Feature

1. Create `src/features/<feature>/api/<feature>.js` using the shared `api` instance.
2. If state is shared across screens, add a slice in `src/store/slices/` and register it in `store/index.js`.
3. Add feature-specific components under `src/features/<feature>/components/`.
4. Create the page in `src/pages/` (or `pages/admin/` for admin screens).
5. Add a lazy import and `<Route>` in `src/routes/AppRoutes.jsx`, inside `ProtectedRoute` or `AdminRoute` as appropriate.
6. Add a navigation entry in `components/layout/Sidebar.jsx` (or `AdminSidebar.jsx`).

## Scripts

| Command                | Purpose                      |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start Vite dev server        |
| `npm run build`        | Production build to `dist/`  |
| `npm run preview`      | Preview the production build |
| `npm run lint`         | ESLint                       |
| `npm run format`       | Prettier write               |
| `npm run format:check` | Prettier check               |
