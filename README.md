# @sudobility/whisperly_types

Shared TypeScript type definitions and response helpers for the Whisperly
localization SaaS platform. Consumed by all other `whisperly_*` packages.

- **Runtime-light**: types erase at compile time; the only runtime exports are
  the `successResponse` / `errorResponse` helpers.
- **ESM-only** output (the package is `"type": "module"`).
- **Platform-agnostic**: usable from Web, React Native, and backend code.

## Installation

This package is published to **GitHub Packages** (not the public npm registry),
scoped under `@sudobility`. Consumers need an `.npmrc` that points the scope at
GitHub Packages and authenticates with a GitHub token that has `read:packages`:

```
@sudobility:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_PACKAGES_READ_TOKEN}
```

Then install:

```bash
bun add @sudobility/whisperly_types
```

`@sudobility/types` is a **peer dependency** (`^1.9.78`) and must be installed
alongside it.

## Usage

```typescript
import {
  Project,
  TranslationRequest,
  TranslationResponse,
  successResponse,
  errorResponse,
} from "@sudobility/whisperly_types";

const response = successResponse({ translations: { es: ["Hola"] } });
```

## Types

### Entity Types
`User`, `UserSettings`, `Project`, `Dictionary`, `DictionaryEntry`, `UsageRecord`

### Request Types
`ProjectCreateRequest`, `ProjectUpdateRequest`, `DictionaryCreateRequest`, `TranslationRequest`

### Response Types
`ProjectResponse`, `ProjectListResponse`, `TranslationApiResponse`, `AnalyticsApiResponse`, `DictionarySearchApiResponse`

### Response Helpers
- `successResponse<T>(data)` -- wrap data in `BaseResponse<T>`
- `errorResponse(error)` -- create error response

## Development

Uses **Bun** as the package manager/runner.

```bash
bun install          # Install dependencies
bun run build        # Compile ESM output + .d.ts to dist/
bun run typecheck    # tsc --noEmit
bun run lint         # ESLint (bun run lint:fix to autofix)
bun run format       # Prettier write (format:check to verify)
bun run test:run     # Run tests once with Vitest
bun run dev          # tsc --watch
bun run verify       # typecheck + lint + test + build (run before publishing)
```

## Related Packages

- `whisperly_client` -- API client SDK
- `whisperly_lib` -- Business logic with Zustand stores
- `whisperly_api` -- Backend API server
- `whisperly_app` -- Web application

## License

BUSL-1.1
