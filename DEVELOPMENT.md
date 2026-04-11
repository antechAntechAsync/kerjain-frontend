# Development Setup & Best Practices

## Configuration Files Overview

This project includes comprehensive configuration files to ensure code quality, consistency, and best practices across the development team.

### 1. ESLint Configuration (`eslint.config.js`)

**Purpose**: Enforce code quality and catch potential errors early.

**Key Rules**:
- **React Hooks**: Enforce rules of hooks and exhaustive dependencies
- **React Refresh**: Ensure fast refresh works correctly
- **Code Quality**: No unused variables, no console statements (except warn/error), prefer const over var
- **Best Practices**: Always use curly braces, no nested ternary operators, consistent return statements
- **Import/Export**: No duplicate imports, proper module organization

**Usage**:
```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Automatically fix linting errors
```

### 2. Prettier Configuration (`.prettierrc`)

**Purpose**: Ensure consistent code formatting across the project.

**Settings**:
- **Semicolons**: Enabled
- **Quotes**: Single quotes for strings, double quotes for JSX
- **Indentation**: 2 spaces
- **Line Width**: 100 characters
- **Trailing Commas**: ES5 compatible
- **End of Line**: LF (Unix-style)

**Usage**:
```bash
npm run format        # Format all files
npm run format:check  # Check formatting without modifying files
```

### 3. EditorConfig (`.editorconfig`)

**Purpose**: Maintain consistent coding styles across different editors and IDEs.

**Settings**:
- UTF-8 encoding
- LF line endings
- 2-space indentation for JS/JSX/CSS/HTML
- Trailing whitespace removal
- Final newline at end of files

### 4. VS Code Settings (`.vscode/settings.json`)

**Purpose**: Optimize VS Code for this project with automatic formatting and linting.

**Features**:
- Format on save enabled
- Auto-fix ESLint errors on save
- Organize imports on save
- Prettier as default formatter
- 100-character ruler
- Proper file associations for JSX

### 5. VS Code Extensions (`.vscode/extensions.json`)

**Recommended Extensions**:
- **ESLint**: Real-time linting
- **Prettier**: Code formatting
- **Tailwind CSS IntelliSense**: Tailwind class suggestions
- **ES7+ React/Redux/React-Native snippets**: React code snippets
- **Auto Rename Tag**: Auto rename paired HTML/XML tags
- **Path Intellisense**: Autocomplete filenames
- **Code Spell Checker**: Catch spelling errors
- **Error Lens**: Show inline errors

## Development Workflow

### Initial Setup

1. **Install dependencies**:
   ```bash
   # Menggunakan Bun (recommended - lebih cepat)
   bun install

   # Atau menggunakan npm
   npm install
   ```

2. **Install VS Code extensions** (recommended):
   - Open the project in VS Code
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Extensions: Show Recommended Extensions"
   - Install all recommended extensions

### Daily Development

1. **Start development server**:
   ```bash
   # Menggunakan Bun
   bun run dev

   # Atau menggunakan npm
   npm run dev
   ```

2. **Code with automatic formatting**:
   - VS Code will automatically format your code on save
   - ESLint errors will be highlighted and auto-fixed on save

3. **Manual quality checks**:
   ```bash
   # Menggunakan Bun
   bun run lint          # Check for code quality issues
   bun run lint:fix      # Auto-fix linting issues
   bun run format        # Format all files manually

   # Atau menggunakan npm
   npm run lint          # Check for code quality issues
   npm run lint:fix      # Auto-fix linting issues
   npm run format        # Format all files manually
   ```

4. **Build for production**:
   ```bash
   # Menggunakan Bun
   bun run build

   # Atau menggunakan npm
   npm run build
   ```

## Code Style Guidelines

### JavaScript/JSX

**Do**:
```jsx
// Use const/let, never var
const userName = 'John';
let count = 0;

// Use template literals
const greeting = `Hello, ${userName}!`;

// Use arrow functions
const handleClick = () => {
  console.log('Clicked');
};

// Destructure objects and arrays
const { name, email } = user;
const [first, second] = items;

// Use meaningful variable names
const isActive = true;
```

**Don't**:
```jsx
// Don't use var
var userName = 'John';

// Don't use string concatenation
const greeting = 'Hello, ' + userName + '!';

// Don't use function expressions for callbacks
button.onclick = function() {
  console.log('Clicked');
};

// Don't use nested ternary operators
const result = condition1 ? (condition2 ? 'A' : 'B') : 'C';
```

### React Components

**Do**:
```jsx
// Use functional components with hooks
function UserProfile({ name, email }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <div className="user-profile">
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}

// Export default at the bottom
export default UserProfile;
```

**Don't**:
```jsx
// Don't use class components (unless necessary)
class UserProfile extends React.Component {
  // ...
}

// Don't export inline
export default function UserProfile({ name }) {
  return <div>{name}</div>;
}
```

### Imports

**Do**:
```jsx
// Group imports: React → Third-party → Internal → Types
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Button, Card } from '../../components/ui';
import type { User } from '../../types';
```

**Don't**:
```jsx
// Don't mix import groups
import React from 'react';
import { Button } from '../../components/ui';
import { useState } from 'react';
import { Card } from '../../components/ui';
```

## Environment Variables

### Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in `.env`

3. Access variables in code:
   ```jsx
   const apiUrl = import.meta.env.VITE_API_BASE_URL;
   ```

### Available Variables

- `VITE_API_BASE_URL`: API endpoint URL
- `VITE_API_TIMEOUT`: Request timeout in milliseconds
- `VITE_APP_NAME`: Application name
- `VITE_APP_ENV`: Environment (development/production)
- `VITE_ENABLE_MOCK_AUTH`: Enable mock authentication
- `VITE_ENABLE_DEBUG_MODE`: Enable debug logging

## Git Workflow

### Commit Messages

Follow conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(hr): add candidate match scoring algorithm

fix(auth): resolve token expiration issue

docs(readme): update installation instructions

style(ui): format components with prettier
```

### Pre-commit Hooks (Optional)

To add pre-commit hooks for automatic linting and formatting:

1. Install husky:
   ```bash
   npm install --save-dev husky lint-staged
   ```

2. Initialize husky:
   ```bash
   npx husky init
   ```

3. Update `.husky/pre-commit`:
   ```bash
   npx lint-staged
   ```

4. Add to `package.json`:
   ```json
   "lint-staged": {
     "*.{js,jsx}": [
       "eslint --fix",
       "prettier --write"
     ],
     "*.{css,html,json,md}": [
       "prettier --write"
     ]
   }
   ```

## Troubleshooting

### ESLint Errors

**Problem**: ESLint shows errors that you don't agree with.

**Solution**:
- For specific lines, use inline comments:
  ```jsx
  // eslint-disable-next-line no-console
  console.log('Debug info');
  ```
- For entire file, add at the top:
  ```jsx
  /* eslint-disable no-console */
  ```

### Prettier Conflicts

**Problem**: Prettier and ESLint have conflicting rules.

**Solution**: The project is configured to avoid conflicts. If you encounter issues:
1. Run `bun run lint:fix` or `npm run lint:fix` first
2. Then run `bun run format` or `npm run format`
3. The order matters!

### VS Code Not Formatting

**Problem**: Code doesn't format on save.

**Solution**:
1. Ensure Prettier extension is installed
2. Check that `"editor.formatOnSave": true` is in settings
3. Try manual format: `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (Mac)

## Using Bun (Recommended)

Bun adalah package manager yang lebih cepat dan efisien untuk JavaScript/TypeScript projects. Project ini sudah mendukung Bun sepenuhnya.

### Keuntungan Menggunakan Bun:
- **10x lebih cepat** dari npm untuk install dependencies
- **Lebih efisien** dalam penggunaan disk space
- **Built-in bundler & test runner**
- **Compatible** dengan semua npm packages

### Perintah Bun:

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Build production
bun run build

# Preview production build
bun run preview

# Linting
bun run lint
bun run lint:fix

# Formatting
bun run format
bun run format:check
```

### Migrasi dari npm ke Bun:

Jika sebelumnya menggunakan npm, cukup ganti `npm` dengan `bun`:

```bash
# Sebelumnya
npm install
npm run dev

# Sekarang
bun install
bun run dev
```

Semua scripts di `package.json` tetap sama, hanya package manager yang berubah!

## Additional Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
