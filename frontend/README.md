# CargoShare frontend

Next.js app. It never writes to the database: data comes from the FastAPI backend.

## Run it

```
nvm install                       # installs the Node version in .nvmrc
npm install -g pnpm@12.14.0       # once per Node version
pnpm install
cp .env.example .env.local        # then fill in the values
pnpm dev                          # http://localhost:3000
```

`pnpm install` refuses any Node version outside `devEngines` in `package.json`.

## Check it

```
pnpm lint && pnpm typecheck && pnpm format:check && pnpm build
```

## Where things go

| Path                     | What belongs there                                               |
| ------------------------ | ---------------------------------------------------------------- |
| `src/app/`               | Pages and layouts (one folder per route)                         |
| `src/components/<area>/` | Components, grouped by area. They receive their content as props |
| `src/lib/constants.ts`   | Fixed values: text, header values, key prefixes                  |
| `src/lib/`               | Other shared helpers                                             |
| `src/env.ts`             | Checks the environment variables at start and build              |
| `src/proxy.ts`           | Runs before every page: Content-Security-Policy nonce            |

## Code rules

- Import with `@/`, not relative paths. Only exception: `src/env.ts` (the comment there says why).
- Arrow functions: `const Name = () => ...`, with `export default Name;` on its own line.
- No hardcoded text or fixed values in components; use `src/lib/constants.ts`.
- ESLint finds bugs and Prettier handles formatting; `eslint-config-prettier` stops the two from conflicting.
