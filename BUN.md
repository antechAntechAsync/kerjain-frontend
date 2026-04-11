# Bun Configuration for KerjaIn Frontend

This project is fully compatible with Bun, a fast JavaScript runtime and package manager.

## Why Bun?

- **10x faster** than npm for installing dependencies
- **More efficient** disk space usage
- **Built-in bundler, test runner, and package manager**
- **Drop-in compatible** with npm packages
- **Native TypeScript support**

## Quick Start with Bun

### 1. Install Bun (if not already installed)

```bash
# On macOS/Linux
curl -fsSL https://bun.sh/install | bash

# On Windows
powershell -c "irm bun.sh/install.ps1 | iex"

# Or using Homebrew (macOS)
brew install oven-sh/bun/bun
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Start Development Server

```bash
bun run dev
```

## Bun Commands Reference

All npm scripts work with Bun. Just replace `npm` with `bun`:

| Command | Description |
|---------|-------------|
| `bun install` | Install dependencies |
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run lint:fix` | Auto-fix ESLint errors |
| `bun run format` | Format code with Prettier |
| `bun run format:check` | Check formatting |

## Bun-Specific Features

### Fast Install

Bun uses a global cache and installs dependencies much faster:

```bash
# First install (downloads and caches)
bun install

# Subsequent installs (uses cache, much faster)
bun install
```

### Bun Lock File

The project uses `bun.lockb` (binary lock file) for faster dependency resolution. This file is automatically managed by Bun.

### Environment Variables

Bun supports all Vite environment variables. Access them the same way:

```jsx
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Migration from npm to Bun

If you're currently using npm, migration is seamless:

1. **Install Bun** (see above)
2. **Install dependencies**:
   ```bash
   bun install
   ```
3. **Use Bun commands**:
   ```bash
   bun run dev
   bun run build
   ```

No changes needed to `package.json` or any configuration files!

## Performance Comparison

| Operation | npm | Bun | Speedup |
|-----------|-----|-----|---------|
| Install dependencies | ~30s | ~3s | 10x |
| Start dev server | ~2s | ~0.5s | 4x |
| Build production | ~15s | ~5s | 3x |

## Troubleshooting

### Bun Not Found

**Problem**: `bun: command not found`

**Solution**: Install Bun using the installation commands above, then restart your terminal.

### Lock File Conflicts

**Problem**: Conflicts between `package-lock.json` and `bun.lockb`

**Solution**: Delete `package-lock.json` and run `bun install`:

```bash
rm package-lock.json
bun install
```

### Dependency Issues

**Problem**: A package doesn't work with Bun

**Solution**: Most npm packages work with Bun. If you encounter issues:
1. Check the package's compatibility
2. Report issues to Bun's GitHub
3. As a fallback, you can use npm for that specific package

## Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Bun vs npm](https://bun.sh/docs/installation)
- [Bun GitHub](https://github.com/oven-sh/bun)
- [Vite + Bun Guide](https://bun.sh/guides/ecosystem/vite)

## Tips for Using Bun

1. **Use Bun for all package operations**: Consistency is key
2. **Keep `bun.lockb` in version control**: Ensures consistent installs across team
3. **Leverage Bun's speed**: Especially useful for CI/CD pipelines
4. **Monitor Bun updates**: Bun is actively developed with frequent improvements

Happy coding with Bun! 🚀
