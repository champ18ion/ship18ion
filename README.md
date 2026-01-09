# 🚀 ship18ion

> **"Production Readiness Inspector" for your apps.**

`ship18ion` (read as "ship-tion") is a CLI tool designed to prevent production disasters before they happen. It scans your codebase for environment configuration issues, leaked secrets, dangerous security misconfigurations, and build artifacts that shouldn't be there.

Think of it as `eslint` but for **deployability**.

![npm version](https://img.shields.io/npm/v/ship18ion)
![license](https://img.shields.io/npm/l/ship18ion)

## ✨ Features

- **🌱 Environment Hygiene**: 
  - Finds unused variables in your `.env` files.
  - Detects usage of `process.env.VAR` that are missing definitions.
  - Supports `.env`, `.env.production` and `import.meta.env` (Vite).
  
- **🔐 Secret Detection**:
  - Catches hardcoded secrets (AWS keys, Stripe keys, generic private keys).
  - Uses entropy heuristics to find potential secrets hidden in plain sight.
  - **Next.js Safety**: Warns if `NEXT_PUBLIC_` variables contain high-entropy strings (potential accidental leaks).

- **⚠️ Security & Config**:
  - Alerts on `debug: true` or `NODE_ENV` mismatches.
  - Detects dangerous CORS configurations (`origin: '*'`).
  - Finds hardcoded database connection strings.

- **📦 Build Safety**:
  - Prevents source maps (`.map`) from leaking into production builds.
  - Ensures `.env` files are not bundled into build output directories.
  - Checks for dev dependencies (like `eslint`) accidentally listed in `dependencies`.

- **🧹 Code Hygiene (New)**:
  - Warns on leftover `console.log()` calls.
  - Flags `FIXME` comments that need resolution.

- **📦 Dependencies (New)**:
  - Checks for duplicate packages (listed in both `dependencies` and `devDependencies`).

- **🐙 Git Safety (New)**:
  - Ensures critical files (`node_modules`, `.env`) and framework artifacts (`.next`) are git-ignored.
  - **Security**: alerts if dangerous keys (e.g. `serviceAccountKey.json`) exist but are *not* ignored.

- **👷 CI/CD Ready**: 
  - Zero config by default.
  - Returns exit code `1` on failure to block bad builds.

## 📦 Installation

You can use it directly with `npx`:

```bash
npx ship18ion check
```

Or install it as a dev dependency:

```bash
npm install --save-dev ship18ion
```

## 🚀 Usage

Run the check in your project root:

```bash
npx ship18ion
```

### CI Mode
For Continuous Integration pipelines (GitHub Actions, GitLab CI, etc.), use the `--ci` flag for minimal output and standard exit codes:

```bash
npx ship18ion check --ci
```

## ⚙️ Configuration

`ship18ion` works out of the box, but you can customize it by creating a `ship18ion.config.json` file in your root directory:

```json
{
  "env": {
    "required": ["DATABASE_URL", "JWT_SECRET"],
    "disallowed": ["DEBUG_TOKEN"]
  },
  "security": {
    "noCorsWildcard": true,
    "requireRateLimit": false
  },
  "ignore": [
    "**/legacy-code/**",
    "**/test-fixtures/**"
  ]
}
```

## 🛡️ Rules Breakdown

| Category | Rule | Description |
|----------|------|-------------|
| **Env** | `env-unused` | A variable is defined in `.env` but never referenced in code. |
| **Env** | `env-missing` | A variable is used in code (`process.env.X`) but not defined. |
| **Secrets** | `secret-pattern` | Matches regex for known keys (AWS, Stripe, OpenAI). |
| **Next.js** | `nextjs-public-secret` | High-entropy string found in `NEXT_PUBLIC_` variable. |
| **Security** | `security-cors` | Detects wildcard `Access-Control-Allow-Origin`. |
| **Git** | `git-dirty` | Warns if deploying with uncommitted changes. |
| **Git** | `git-ignore-missing` | Warns if `.gitignore` is missing critical entries (`node_modules`, `.env`). |
| **Git** | `git-ignore-auth` | **Critical**: Fails if `serviceAccountKey.json` etc are not ignored. |
| **Hygiene** | `hygiene-console-log` | Warns on `console.log` in production code. |
| **Hygiene** | `hygiene-fixme` | Warns on leftover `FIXME` comments. |
| **Package** | `package-duplicate` | Warns if a package is in both dependency lists. |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC
