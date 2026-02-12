# OrbitDesk Frontend Architecture

This project follows a **Feature-Based Architecture**.  
Each feature contains all the code required for that business domain, including API calls, components, hooks, and types.

## 📂 Folder Structure

```text
src/
├── features/                # 🚨 THE CORE: Domain-specific modules
│   ├── auth/                # Authentication (Login, Register, ProtectedRoute)
│   ├── tickets/             # Ticket Management (CRUD, details, comments)
│   ├── contacts/            # CRM/Contacts (Users, Organizations)
│   ├── groups/              # Agent Groups
│   ├── organizations/       # Organization Management
│   ├── settings/            # Settings & Preferences
│   └── knowledge-base/      # Knowledge Base Articles
│
├── components/              # GLOBAL Shared Design System (Dumb components)
│   ├── ui/                  # Atoms: Button, Input, Badge, Loader
│   └── layout/              # Structural: PageContainer
│
├── layouts/                 # Application Shells
│   ├── AppLayout.jsx        # Sidebar + Navbar + Content (Authenticated)
│   └── AuthLayout.jsx       # Center card + Background (Public)
│
├── lib/                     # Third-party library configurations (Singletons)
│   └── axios.js             # Centralized Axios with Interceptors
│
├── pages/                   # Route Integration Layer (Thin Wrappers)
│   ├── dashboard/           # DashboardPage
│   └── tickets/             # TicketsListPage, TicketDetailPage
│
├── routes/                  # Router Definition
│   └── AppRoutes.jsx        # Main routing logic with Lazy Loading
│
└── store/                   # Global State (retaining Redux for compatibility)
    └── slices/              # Redux Slices (updated to use new API structure)
```

## 🏗 Key Principles

1.  **Colocation**: Things that change together live together. API calls for tickets are in `features/tickets/api`, not mixed with user services.
2.  **Shared vs Feature**:
    *   **Shared**: `src/components/ui` contains reusable UI elements (Buttons, Inputs) that know *nothing* about business logic.
    *   **Feature**: `src/features/*` contains "Smart" components that connect to the API or Store.
3.  **Strict Layering**:
    *   Pages import Features.
    *   Features import UI Components.
    *   Features import Hooks/API.
4.  **Absolute Imports**: Use `@/` to import from `src`. Example: `import { Button } from '@/components/ui/Button'`.

## 🚀 How to Add a New Feature

1.  Create `src/features/new-feature`.
2.  Add `api/`, `components/`, `hooks/`.
3.  Create data fetching logic (services/hooks).
4.  Create components using the data.
5.  Create a page in `src/pages` that uses the feature component.
6.  Add route to `src/routes/AppRoutes.jsx`.
