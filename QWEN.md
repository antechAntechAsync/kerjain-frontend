# KerjaIn Frontend - Project Context

## Project Overview

**KerjaIn (SkillMatch SMK)** is a recruitment platform frontend module specifically designed for HR professionals and recruiters. This MVP provides a streamlined, professional interface for managing the complete hiring pipeline.

### Core Functionality
- **Job Management**: Create and manage job postings with dynamic skill proficiency selectors
- **Candidate Discovery**: Review applicants with match scoring based on skill alignment
- **Company Profile**: Manage organizational data (industry, website, description)
- **Dashboard**: Executive overview with statistics and interactive charts showing applicant growth

### Technology Stack
- **Framework**: React 19.2.0 with Vite 7.3.1
- **Styling**: TailwindCSS 3.4.19 with custom design system
- **Routing**: React Router DOM 7.13.2
- **Data Visualization**: Recharts 3.8.0
- **Icons**: Lucide React 1.6.0
- **Package Manager**: npm (with bun.lockb present)

## Architecture

### Directory Structure
```
src/
├── components/
│   ├── auth/           # Authentication components (ProtectedRoute)
│   └── ui/             # Shared UI component library
├── features/
│   ├── auth/           # Authentication feature (LoginPage)
│   └── hr/             # HR-specific features
│       ├── components/ # HR-specific components (CandidateCard)
│       ├── layout/     # HR dashboard layout
│       └── pages/      # HR pages (Dashboard, Jobs, Candidates, Company)
├── App.jsx             # Main routing configuration
├── main.jsx            # Application entry point
└── index.css           # Global styles with Tailwind directives
```

### Design System

#### Color Palette
- **Primary**: `#1d283a` (Dark blue-gray)
- **Secondary**: `#3c83f6` (Blue)
- **Accent**: `#20d3ee` (Cyan)
- **Text**: `#344256` (Slate)
- **Background**: `#f8fafc` (Light slate)

#### Typography
- **Headings**: Plus Jakarta Sans
- **Body**: Inter

#### UI Components (Located in `src/components/ui/`)
- **Button**: Variants (`primary`, `secondary`, `outline`, `ghost`) and sizes (`sm`, `md`, `lg`)
- **Card**: Compositional components (`Card`, `CardHeader`, `CardTitle`, `CardContent`)
- **Form Controls**: `Input`, `Select`, `Textarea` with standardized focus states

**Important**: Reuse these UI components for Student and Admin modules to maintain visual consistency.

## Building and Running

### Development
```bash
# Using Bun (recommended - faster)
bun install          # Install dependencies
bun run dev          # Start Vite dev server (http://localhost:5173/)

# Or using npm
npm install          # Install dependencies
npm run dev          # Start Vite dev server (http://localhost:5173/)
```

### Production
```bash
# Using Bun
bun run build        # Build for production
bun run preview      # Preview production build

# Or using npm
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
# Using Bun
bun run lint         # Run ESLint
bun run lint:fix     # Auto-fix ESLint errors
bun run format       # Format code with Prettier

# Or using npm
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint errors
npm run format       # Format code with Prettier
```

## Development Conventions

### Authentication
- Mock authentication using localStorage token (`kerjain_token`)
- Protected routes use `ProtectedRoute` component
- No real credentials needed - clicking "Sign In" creates a mock session

### Routing Structure
- `/` → Redirects to `/hr`
- `/auth/login` → Login page
- `/hr/*` → Protected HR dashboard routes
  - `/hr` → Dashboard overview
  - `/hr/jobs` → Job listings
  - `/hr/jobs/create` → Create new job
  - `/hr/jobs/:jobId/candidates` → Candidate discovery for specific job
  - `/hr/company` → Company profile management

### Code Style
- ESLint configured with React Hooks and React Refresh plugins
- Unused variables pattern: `^[A-Z_]` ignored (for React components)
- ES2020+ syntax with module system
- JSX syntax with React 19

### Component Patterns
- Feature-based organization (auth, hr modules)
- Shared UI components in dedicated `components/ui/` directory
- Layout components separate from page components
- Mock data used for development (e.g., chart data, statistics)

### Styling Approach
- Utility-first with TailwindCSS
- Custom theme extensions in `tailwind.config.js`
- Global styles in `index.css` using Tailwind layers
- Responsive design with mobile-first approach

## Key Files Reference

- **`package.json`**: Dependencies and npm scripts
- **`vite.config.js`**: Vite configuration with React SWC plugin
- **`tailwind.config.js`**: Custom theme configuration
- **`eslint.config.js`**: ESLint rules and plugins
- **`src/App.jsx`**: Main routing setup
- **`src/main.jsx`**: Application entry point
- **`src/index.css`**: Global styles and Tailwind imports
- **`src/components/ui/`**: Reusable UI component library
- **`src/components/auth/ProtectedRoute.jsx`**: Route protection logic
- **`src/features/hr/`**: HR module implementation

## Notes for Future Development

- This is the HR module; Student and Admin modules are planned
- Maintain strict adherence to the established design system
- Reuse UI components from `src/components/ui/` for consistency
- Mock authentication will be replaced with real backend integration
- Chart data and statistics are currently mocked
