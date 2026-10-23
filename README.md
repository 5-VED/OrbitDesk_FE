# OrbitDesk Frontend (`OrbitDesk_FE`)

OrbitDesk is a modern, full-featured customer support and ticketing platform. This repository contains the React single-page frontend application built with Vite, Material UI (MUI), and Redux Toolkit.

---

## 🚀 Features

- **Dashboard & Analytics**: Workspace KPIs, ticket distribution metrics, resolution time tracking, and SLA compliance overviews.
- **Ticket Management**: Full lifecycle management of customer issues (status, priority, assignment, tagging, conversation history, and internal notes).
- **Rich Text Editor**: Powered by Tiptap with formatting, links, mentions, syntax highlighting, and media support.
- **Customer & Organization CRM**: Manage customers, contact profiles, user roles, and organizational hierarchies.
- **Agent & Team Groups**: Assign and route tickets to specialized agent groups.
- **Knowledge Base (KB)**: Internal and customer-facing documentation with category management.
- **Admin Console**: Dedicated administrative module for:
  - User & Role administration (RBAC)
  - SLA policy configuration
  - System health monitoring & audit logs
  - API key provisioning & webhook notification management
- **AI Assist Tools**: Smart replies, AI chatbot assistant, and draft recommendations.
- **Theming**: Dark and Light theme modes with customized MUI tokens and persistent user preferences.
- **Responsive Layout**: Collapsible persistent sidebar, top navbar with real-time notification alerts, and mobile drawer support.

---

## 🛠 Tech Stack

| Domain | Technology |
|---|---|
| **Runtime & Core** | [React 19](https://react.dev/), [Vite 7](https://vitejs.dev/) |
| **Component Library** | [Material UI (MUI v9)](https://mui.com/), [@emotion/react](https://emotion.sh/) |
| **State Management** | [Redux Toolkit (RTK)](https://redux-toolkit.js.org/) + `react-redux` |
| **Routing** | [React Router v7](https://reactrouter.com/) (Lazy loaded routes with Suspense) |
| **HTTP Client** | [Axios](https://axios-http.com/) (Singleton with credentials & interceptors) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Editor** | [Tiptap v3](https://tiptap.dev/) |
| **Charts & Export** | [Recharts](https://recharts.org/), [XLSX](https://sheetjs.com/) |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com/) |
| **Formatting & Linting** | [ESLint v9](https://eslint.org/) (Flat config), [Prettier](https://prettier.io/) |

---

## 📁 Directory Structure

```text
src/
├── components/          # Shared components
│   ├── ai/              # AI chatbot and smart reply modals
│   ├── editor/          # Tiptap RichTextEditor component & styles
│   ├── layout/          # PageContainer, Sidebar, TopNavbar, AdminLayout/Sidebar
│   └── ui/              # Atom components (Button, Input, Modal, DataTable, Badge, etc.)
├── features/            # Domain-specific modules & API integration
│   ├── auth/            # Auth API, ProtectedRoute, AdminRoute
│   ├── contacts/        # Users & customer contacts API
│   ├── groups/          # Agent groups API
│   ├── knowledgeBase/   # Knowledge base articles & categories API
│   ├── organizations/   # Organizations API
│   ├── settings/        # SLA policies API & forms
│   └── tickets/         # Tickets API
├── lib/                 # Core utility singletons (Axios client with interceptors)
├── pages/               # Route-level views (Dashboard, Tickets, Contacts, Admin, Auth)
├── routes/              # AppRoutes router definitions
├── services/            # Standalone API services (AI, AuditLog, Dashboard, Notifications, etc.)
├── store/               # Redux store and slices (auth, tickets, contacts, theme, ui, etc.)
├── theme/               # MUI Theme configuration, tokens, and AppThemeProvider
└── utils/               # App constants and helper utilities
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` recommended
- **npm**: `v10.x` or higher
- **Backend Service**: Make sure `OrbitDesk_BE` is running on `http://localhost:5000` (or configured via environment variables).

### 1. Installation

Clone the repository and install dependencies from the `OrbitDesk_FE` directory:

```bash
cd OrbitDesk_FE
npm install
```

### 2. Environment Variables

Create a `.env` file in the root of `OrbitDesk_FE` (or use the default):

```env
VITE_API_URL=/api/v1
```

*Note: In local development, Vite proxies requests starting with `/api` and `/uploads` directly to `http://localhost:5000` via `vite.config.js`.*

### 3. Running Locally

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Vite local development server with HMR. |
| `npm run build` | Compiles and builds production-ready static assets to `/dist`. |
| `npm run preview` | Serves the production build locally for verification. |
| `npm run lint` | Runs ESLint across the codebase. |
| `npm run format` | Runs Prettier to auto-format files. |
| `npm run format:check` | Checks code formatting against Prettier rules. |

---

## 🐳 Docker Deployment

A multi-stage Docker build is configured to build static assets and serve them via Nginx:

### Build Image
```bash
docker build -t orbitdesk-fe .
```

### Run Container
```bash
docker run -d -p 80:80 --name orbitdesk-fe-app orbitdesk-fe
```

---

## 🔐 Authentication & API Integration

- **Session Handling**: Authentication operates via secure, HTTP-only cookies (`withCredentials: true`).
- **Automatic Session Expiry**: Any `401 Unauthorized` response received by the Axios interceptor automatically clears user cache and redirects to `/login`.
- **Role-Based Guards**: Protected routes (`/dashboard`, `/tickets`, etc.) and Admin routes (`/admin/*`) are safeguarded by `ProtectedRoute` and `AdminRoute`.
