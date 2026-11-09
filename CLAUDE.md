# CLAUDE.md - whisperly_types

> **Git policy — never auto-commit or auto-push.** Leave your work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when the user
> explicitly asks in that turn**. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it. Stay on the current branch; do not create
> feature branches for code changes.

## What this is

`@sudobility/whisperly_types` is the shared TypeScript types library for the
Whisperly localization SaaS platform. It defines the interfaces, request/response
types, and the `successResponse`/`errorResponse` helpers consumed by the other
whisperly packages (whisperly_api, whisperly_client, whisperly_lib, whisperly_app).

- **Types-only + two tiny helpers.** The only runtime JS is `successResponse` /
  `errorResponse`; everything else erases at compile time. Zero runtime deps.
- **ESM-only output.** Package is `"type": "module"`; build emits `dist/index.js`,
  `dist/index.d.ts` (+ source/declaration maps). There is **no CJS build** and no
  `require` export, despite older notes that mentioned one.
- **Single source file:** `src/index.ts`. Tests in `src/__tests__/`.

## Stack / tooling

- **Bun** is the package manager and runner (not npm/yarn): `bun install`,
  `bun run <script>`, `bun add <pkg>`.
- TypeScript 5.9 (strict), ESLint 9 + Prettier, Vitest 4.

## Commands (verified)

```bash
bun run build        # tsc -p tsconfig.esm.json → dist/ (ESM + .d.ts)
bun run typecheck    # tsc --noEmit
bun run lint         # eslint src/   (lint:fix to autofix)
bun run format       # prettier --write src/**/*.ts  (format:check to verify)
bun run test:run     # vitest run  (alias: test:unit)
bun run dev          # tsc --watch
bun run verify       # typecheck + lint + test:unit + build — run before publishing
```

`prepublishOnly` runs `clean && verify`.

## Packaging / distribution gotcha

- Published to **GitHub Packages**, NOT the public npm registry. `.npmrc` sets
  `@sudobility:registry=https://npm.pkg.github.com`. Installing (here or in any
  consumer) needs a GitHub token with `read:packages`; CI passes it as the
  `GH_PACKAGES_READ_TOKEN` secret.
- CI/CD (`.github/workflows/ci-cd.yml`) delegates to the reusable
  `johnqh/workflows` unified workflow with `publish-target: github`; it publishes
  on push to `main`/`develop`.
- `@sudobility/types` is a **peer dependency** (`^1.9.78`), also a devDependency
  so local builds/tests resolve it.

## Architecture (all in src/index.ts, section-commented)

1. **Re-exports from `@sudobility/types`** — `ApiResponse`, `BaseResponse`,
   `NetworkClient`, `Optional`, `PaginatedResponse`, `PaginationInfo`,
   `PaginationOptions`, and the canonical rate-limit types (`RateLimits`,
   `RateLimitTier`, `RateLimitResets`, `RateLimitsConfigData`, `RateLimitUsage`,
   `RateLimitsConfigResponse`, `RateLimitHistoryEntry`, `RateLimitHistoryData`,
   `RateLimitHistoryResponse`) plus the value enum `RateLimitPeriodType`.
   Rate-limit shapes live in `@sudobility/types`; this package does not define them.
2. **`ISODateString`** — alias for `string`, documents ISO-8601 date/datetime fields.
3. **Entity types** (DB models) — `User`, `UserSettings`, `Project`, `Dictionary`,
   `DictionaryEntry`, `UsageRecord`, and `DictionaryTranslations`
   (`Record<string, string>`, flattened `{ lang: text }`).
4. **Request body types** — `UserCreateRequest`, `UserUpdateRequest`,
   `UserSettingsUpdateRequest`, `ProjectCreateRequest`, `ProjectUpdateRequest`,
   `DictionaryCreateRequest`/`DictionaryUpdateRequest` (both ARE
   `DictionaryTranslations` — a direct `{ lang: text }` payload, not enveloped).
5. **Query param types** — `ProjectQueryParams`, `UsageAnalyticsQueryParams`
   (all fields are query-string values, i.e. `"true"`/`"false"`, dates `"YYYY-MM-DD"`).
6. **Translation API** — `TranslationRequest` (`strings[]`, `target_languages[]`,
   optional `source_language`, `skip_dictionaries?`), `TranslationResponse`.
7. **Dictionary callback / search** — `DictionaryLookupRequest`/`Response`,
   `DictionarySearchResponse`, `DictionaryListItem` (extends search response + timestamps).
8. **Analytics** — `UsageAggregate`, `UsageByProject`, `UsageByDate`, `AnalyticsResponse`.
9. **Project languages** — `AvailableLanguage`, `ProjectLanguagesResponse`.
10. **Translation service (internal)** — `TranslationServicePayload`,
    `TranslationServiceResponse` (shapes for the external translation service call).
11. **Response helpers** — `successResponse<T>(data)` → `BaseResponse<T>`
    (`success: true`, ISO timestamp); `errorResponse(msg)` → `BaseResponse<never>`
    (`success: false`).
12. **Response type aliases** — `BaseResponse<T>` wrappers:
    `ProjectListResponse`, `ProjectResponse`, `UserSettingsResponse`,
    `DictionaryResponse`, `DictionarySearchApiResponse`, `DictionaryListApiResponse`,
    `DictionaryLookupApiResponse`, `AnalyticsApiResponse`, `TranslationApiResponse`,
    `AvailableLanguagesApiResponse`, `ProjectLanguagesApiResponse`,
    `HealthCheckResponse`.
13. **Health check** — `HealthCheckData` (`name`, `version`, `status`).

## Conventions

- Entity types mirror the DB schema; timestamps are `Date | null`.
- Optional request fields use `Optional<T>` from `@sudobility/types`; update
  requests make fields `Optional<T>` (partial updates), and fields that can be
  cleared are `Optional<T | null>`.
- Response naming: `EntityResponse` (single), `EntityListResponse` (array),
  `*ApiResponse` for composite/special payloads.
- Serialized date fields on analytics/response types are `ISODateString` (string),
  not `Date`.

## Adding a type

1. Add the interface to the right section of `src/index.ts`.
2. If it's an API payload, add a `BaseResponse<T>` alias.
3. Add shape tests in `src/__tests__/types.test.ts`.
4. Run `bun run verify`.
