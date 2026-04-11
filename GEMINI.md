# KerjaIn (SkillMatch SMK) - HR Frontend Module

## Project Overview
KerjaIn is a recruitment platform tailored for HR professionals and Recruiters, specifically focusing on SkillMatch SMK. This frontend module facilitates job management, candidate discovery with match scoring, company profile management, and dashboard analytics.

### Main Technologies
- **Framework**: React 19 (Vite-based)
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Charts**: Recharts
- **State/Auth**: Currently uses a mock authentication pipeline.

### Architecture
The project follows a feature-based directory structure:
- `src/components/ui`: Centralized, reusable UI Kit (Button, Card, Input, etc.).
- `src/features`: Contains domain-specific logic and UI.
  - `auth`: Login and authentication logic.
  - `hr`: Core HR functionality (Dashboard, Jobs, Candidates, Profile).
- `src/components/auth`: Authentication-related components like `ProtectedRoute`.

---

## Building and Running

### Prerequisites
- Node.js installed.

### Commands
- **Install Dependencies**: `npm install`
- **Development Server**: `npm run dev` (Runs at `http://localhost:5173/`)
- **Build for Production**: `npm run build`
- **Linting**: `npm run lint`
- **Preview Production Build**: `npm run preview`

---

## Development Conventions

### 1. UI Consistency
Always prioritize using the shared UI components in `src/components/ui`. These are pre-styled with the project's design system:
- **Primary Color**: `#1d283a`
- **Secondary Color**: `#3c83f6`
- **Accent Color**: `#20d3ee`
- **Fonts**: `Plus Jakarta Sans` (Headings), `Inter` (Body).

### 2. Feature-Based Organization
When adding new functionality, create a new directory under `src/features` with the following subdirectories as needed:
- `components/`: Feature-specific components.
- `pages/`: Page-level components.
- `hooks/`: Feature-specific custom hooks.
- `services/`: API calls and external integrations.

### 3. Styling Guidelines
- Use Tailwind CSS utility classes.
- Avoid writing raw CSS in `App.css` or `index.css` unless absolutely necessary for global resets or complex animations.
- Respect the responsive breakpoints provided by Tailwind.

### 4. Routing
- Define routes in `src/App.jsx`.
- Use `ProtectedRoute` for any route requiring authentication.
- Currently, the application redirects from `/` to `/hr`.

### 5. Mock Data
- The application currently relies on mock data for development. When implementing real API calls, ensure they are abstracted into services within the respective feature directories.
