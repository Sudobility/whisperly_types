/**
 * @sudobility/whisperly_types
 * TypeScript types for Whisperly API - Localization SaaS platform
 */

// Re-export common types from @sudobility/types
export type {
  ApiResponse,
  BaseResponse,
  NetworkClient,
  Optional,
  PaginatedResponse,
  PaginationInfo,
  PaginationOptions,
  // Rate limit types (canonical definitions in @sudobility/types)
  RateLimits,
  RateLimitTier,
  RateLimitResets,
  RateLimitsConfigData,
  RateLimitUsage,
  RateLimitsConfigResponse,
  RateLimitHistoryEntry,
  RateLimitHistoryData,
  RateLimitHistoryResponse,
  // Generic response/health types (canonical definitions in @sudobility/types)
  ApiInfoResponse,
  HealthResponse,
  HealthCheckData,
} from '@sudobility/types';

export { RateLimitPeriodType } from '@sudobility/types';
// Response constructors are the canonical ones from @sudobility/types.
export { successResponse, errorResponse } from '@sudobility/types';

import type {
  Optional,
  BaseResponse,
  HealthCheckData,
} from '@sudobility/types';

// =============================================================================
// Date Type Aliases
// =============================================================================

/**
 * A string representing a date/time in ISO 8601 format.
 *
 * Expected format: `"YYYY-MM-DDTHH:mm:ss.sssZ"` (e.g., `"2024-01-15T12:00:00.000Z"`).
 * For date-only fields, the format is `"YYYY-MM-DD"` (e.g., `"2024-01-15"`).
 *
 * This is a type alias for `string` and is fully compatible with plain string assignments.
 * It serves as documentation to indicate that the value should conform to ISO 8601.
 */
export type ISODateString = string;

// =============================================================================
// Entity Types (database models)
// =============================================================================

/**
 * Represents a Whisperly platform user, mapped from Firebase Authentication.
 *
 * The primary key is {@link User.firebase_uid | firebase_uid}, which corresponds
 * to the Firebase Auth UID. Users are created upon first sign-in.
 */
export interface User {
  /** Primary key. Firebase Authentication UID for this user. */
  firebase_uid: string;
  /** User's email address from Firebase Auth. Null if not provided. */
  email: string | null;
  /** User's display name from Firebase Auth. Null if not provided. */
  display_name: string | null;
  /** Timestamp when the user record was created. Null if not yet persisted. */
  created_at: Date | null;
  /** Timestamp when the user record was last updated. Null if never updated. */
  updated_at: Date | null;
}

/**
 * User-level settings, primarily for organization/entity configuration.
 *
 * Each user can have multiple settings records for different organizations.
 * The {@link UserSettings.firebase_uid | firebase_uid} links back to the {@link User}.
 */
export interface UserSettings {
  /** Primary key. Auto-generated unique identifier. Null before persistence. */
  id: string | null;
  /** Foreign key referencing {@link User.firebase_uid}. */
  firebase_uid: string;
  /** Display name for the organization. Null if not set. */
  organization_name: string | null;
  /**
   * URL-safe path/slug for the organization.
   * @deprecated Legacy field for personal organization paths. Will be replaced by entity-based routing.
   */
  organization_path: string;
  /** Whether this is the user's default organization/settings. */
  is_default: boolean;
  /** Timestamp when the settings record was created. Null if not yet persisted. */
  created_at: Date | null;
  /** Timestamp when the settings record was last updated. Null if never updated. */
  updated_at: Date | null;
}

/**
 * A localization project within an entity/organization.
 *
 * Projects are the primary organizational unit for translations. Each project
 * has its own API key, language configuration, and dictionaries.
 *
 * Primary key: {@link Project.id | id}. Scoped to an entity via {@link Project.entity_id | entity_id}.
 */
export interface Project {
  /** Primary key. Auto-generated unique identifier. */
  id: string;
  /** Foreign key referencing the owning entity/organization. */
  entity_id: string;
  /** URL-safe machine name for the project (e.g., "my-app"). Used in API routes. */
  project_name: string;
  /** Human-readable display name for the project (e.g., "My Application"). */
  display_name: string;
  /** Optional project description. Null if not provided. */
  description: string | null;
  /** Optional translation instructions/context provided to the translation service. Null if not set. */
  instructions: string | null;
  /** Default source language code (e.g., "en"). Null if auto-detect is used. */
  default_source_language: string | null;
  /** Default target language codes (e.g., ["ja", "es"]). Null if not configured. */
  default_target_languages: string[] | null;
  /** List of allowed IP addresses for API access. Null if unrestricted. */
  ip_allowlist: string[] | null;
  /** API key for authenticating translation requests. Null if not yet generated. */
  api_key: string | null;
  /** Whether the project is active and accepting requests. Null treated as active. */
  is_active: boolean | null;
  /** Timestamp when the project was created. Null if not yet persisted. */
  created_at: Date | null;
  /** Timestamp when the project was last updated. Null if never updated. */
  updated_at: Date | null;
}

/**
 * A dictionary container within a project, holding translation term entries.
 *
 * Each project has one dictionary that contains {@link DictionaryEntry} records
 * for term-level translation overrides.
 *
 * Primary key: {@link Dictionary.id | id}. Scoped to a project via {@link Dictionary.project_id | project_id}.
 */
export interface Dictionary {
  /** Primary key. Auto-generated unique identifier. */
  id: string;
  /** Foreign key referencing the owning entity/organization. */
  entity_id: string;
  /** Foreign key referencing the parent {@link Project}. */
  project_id: string;
  /** Timestamp when the dictionary was created. Null if not yet persisted. */
  created_at: Date | null;
  /** Timestamp when the dictionary was last updated. Null if never updated. */
  updated_at: Date | null;
}

/**
 * An individual translation entry within a {@link Dictionary}.
 *
 * Each entry represents a single term in a single language. Multiple entries
 * with the same dictionary form a complete set of translations for a term.
 *
 * Primary key: {@link DictionaryEntry.id | id}.
 */
export interface DictionaryEntry {
  /** Primary key. Auto-generated unique identifier. */
  id: string;
  /** Foreign key referencing the parent {@link Dictionary}. */
  dictionary_id: string;
  /** ISO 639-1 language code (e.g., "en", "ja", "es"). */
  language_code: string;
  /** The translated text for this language. */
  text: string;
  /** Timestamp when the entry was created. Null if not yet persisted. */
  created_at: Date | null;
  /** Timestamp when the entry was last updated. Null if never updated. */
  updated_at: Date | null;
}

/**
 * Flattened dictionary translations mapping language codes to translated text.
 *
 * Used as the payload format for dictionary create/update operations.
 *
 * @example
 * ```typescript
 * const translations: DictionaryTranslations = {
 *   "en": "hello",
 *   "es": "hola",
 *   "ja": "\u3053\u3093\u306b\u3061\u306f"
 * };
 * ```
 */
export type DictionaryTranslations = Record<string, string>;

/**
 * A single usage/analytics record tracking a translation API request.
 *
 * Primary key: {@link UsageRecord.uuid | uuid}. Scoped to an entity and project.
 */
export interface UsageRecord {
  /** Primary key. UUID for this usage record. */
  uuid: string;
  /** Foreign key referencing the entity/organization that made the request. */
  entity_id: string;
  /** Foreign key referencing the {@link Project} the request was made against. */
  project_id: string;
  /** Timestamp when the API request occurred. */
  timestamp: Date;
  /** Number of translation requests in this record (typically 1). */
  request_count: number;
  /** Number of individual strings translated. */
  string_count: number;
  /** Total character count across all translated strings. */
  character_count: number;
  /** Whether the translation request was successful. */
  success: boolean;
  /** Error message if the request failed. Null on success. */
  error_message: string | null;
}

// =============================================================================
// Request Body Types
// =============================================================================

/**
 * Request body for creating a new user.
 *
 * The {@link UserCreateRequest.firebase_uid | firebase_uid} is required and must match
 * the authenticated Firebase user.
 */
export interface UserCreateRequest {
  /** Firebase Authentication UID. Must match the authenticated user. */
  firebase_uid: string;
  /** User's email address. */
  email: Optional<string>;
  /** User's display name. */
  display_name: Optional<string>;
}

/**
 * Request body for updating an existing user's profile.
 *
 * All fields are optional; only provided fields will be updated.
 */
export interface UserUpdateRequest {
  /** Updated email address. */
  email: Optional<string>;
  /** Updated display name. */
  display_name: Optional<string>;
}

/**
 * Request body for updating user settings (organization configuration).
 *
 * All fields are optional; only provided fields will be updated.
 */
export interface UserSettingsUpdateRequest {
  /** Updated organization display name. */
  organization_name: Optional<string>;
  /**
   * Updated organization URL path/slug.
   * @deprecated Legacy field. Will be replaced by entity-based routing.
   */
  organization_path: Optional<string>;
}

/**
 * Request body for creating a new project.
 *
 * {@link ProjectCreateRequest.project_name | project_name} and
 * {@link ProjectCreateRequest.display_name | display_name} are required.
 * All other fields are optional.
 */
export interface ProjectCreateRequest {
  /** URL-safe machine name for the project. Must be unique within the entity. */
  project_name: string;
  /** Human-readable display name for the project. */
  display_name: string;
  /** Optional project description. */
  description: Optional<string>;
  /** Optional translation instructions/context for the translation service. */
  instructions: Optional<string>;
  /** Default source language code (e.g., "en"). Omit for auto-detection. */
  default_source_language: Optional<string>;
  /** Default target language codes (e.g., ["ja", "es"]). */
  default_target_languages: Optional<string[]>;
  /** List of allowed IP addresses for API access. Omit for unrestricted. */
  ip_allowlist: Optional<string[]>;
}

/**
 * Request body for updating an existing project.
 *
 * All fields are optional; only provided fields will be updated.
 * Fields that accept `null` can be explicitly cleared.
 */
export interface ProjectUpdateRequest {
  /** Updated URL-safe machine name. */
  project_name: Optional<string>;
  /** Updated human-readable display name. */
  display_name: Optional<string>;
  /** Updated description. Pass `null` to clear. */
  description: Optional<string>;
  /** Updated translation instructions. Pass `null` to clear. */
  instructions: Optional<string>;
  /** Updated default source language. Pass `null` to clear (auto-detect). */
  default_source_language: Optional<string | null>;
  /** Updated default target languages. Pass `null` to clear. */
  default_target_languages: Optional<string[] | null>;
  /** Updated IP allowlist. Pass `null` to remove restrictions. */
  ip_allowlist: Optional<string[] | null>;
  /** Whether the project should be active. */
  is_active: Optional<boolean>;
}

/**
 * Request body for creating dictionary translations.
 * Accepts a direct `{ language_code: text }` mapping, not wrapped in an envelope.
 *
 * @example
 * ```typescript
 * const request: DictionaryCreateRequest = { "en": "hello", "es": "hola" };
 * ```
 */
export type DictionaryCreateRequest = DictionaryTranslations;

/**
 * Request body for updating dictionary translations.
 * Accepts a direct `{ language_code: text }` mapping, not wrapped in an envelope.
 *
 * @example
 * ```typescript
 * const request: DictionaryUpdateRequest = { "en": "goodbye", "es": "adi\u00f3s" };
 * ```
 */
export type DictionaryUpdateRequest = DictionaryTranslations;

// =============================================================================
// Query Parameter Types
// =============================================================================

/**
 * Query parameters for listing projects.
 *
 * All parameters are passed as query string values (strings), not typed booleans.
 */
export interface ProjectQueryParams {
  /** Filter by active status. Pass `"true"` or `"false"` as a string. */
  is_active: Optional<string>;
}

/**
 * Query parameters for usage analytics endpoints.
 *
 * All parameters are passed as query string values. Date fields should be
 * in `"YYYY-MM-DD"` format (e.g., `"2024-01-01"`). When both `start_date`
 * and `end_date` are provided, the range is inclusive on both ends.
 */
export interface UsageAnalyticsQueryParams {
  /** Filter analytics to a specific project by ID. */
  project_id: Optional<string>;
  /** Start date filter in `"YYYY-MM-DD"` format (inclusive). */
  start_date: Optional<string>;
  /** End date filter in `"YYYY-MM-DD"` format (inclusive). */
  end_date: Optional<string>;
  /** Filter by success status. Pass `"true"` or `"false"` as a string. */
  success: Optional<string>;
}

// =============================================================================
// Translation API Types
// =============================================================================

/**
 * Request body for the translation API endpoint.
 *
 * Submits one or more strings for translation into the specified target languages.
 */
export interface TranslationRequest {
  /** Array of text strings to translate. Must contain at least one string. */
  strings: string[];
  /** Array of target ISO 639-1 language codes (e.g., ["ja", "es"]). Must contain at least one. */
  target_languages: string[];
  /** Source language code. If omitted, the source language is auto-detected. */
  source_language: Optional<string>;
  /** Skip dictionary term matching/replacement. Set to true when translating dictionary entries. */
  skip_dictionaries?: boolean;
}

/**
 * Response from the translation API endpoint.
 *
 * Contains translations organized by target language, with each language
 * mapping to an array of translated strings in the same order as the input.
 */
export interface TranslationResponse {
  /** Translations keyed by target language code. Each value is an array matching the input `strings` order. */
  translations: Record<string, string[]>;
  /** List of dictionary terms that were matched and used during translation. */
  dictionary_terms_used: string[];
  /** Unique identifier for this translation request, used for tracking and debugging. */
  request_id: string;
}

// =============================================================================
// Dictionary Callback Types (GET endpoint for translation service)
// =============================================================================

/**
 * Request parameters for the dictionary lookup callback endpoint.
 *
 * Used by the external translation service to look up dictionary terms via GET request.
 */
export interface DictionaryLookupRequest {
  /** The term to look up in the dictionary. */
  term: string;
  /** Comma-separated list of language codes to look up (e.g., "ja,es,fr"). */
  languages: string;
}

/**
 * Response from the dictionary lookup callback endpoint.
 *
 * Returns the term and its translations in each requested language.
 * Languages without a translation return `null`.
 */
export interface DictionaryLookupResponse {
  /** The term that was looked up. */
  term: string;
  /** Translations keyed by language code. `null` if no translation exists for that language. */
  translations: Record<string, string | null>;
}

// =============================================================================
// Dictionary Search Response
// =============================================================================

/**
 * Response from the dictionary search endpoint.
 *
 * Returns the dictionary ID and all translations for a matched term.
 */
export interface DictionarySearchResponse {
  /** The ID of the dictionary containing the matched term. */
  dictionary_id: string;
  /** All translations for the matched term, keyed by language code. */
  translations: DictionaryTranslations;
}

/**
 * A single item in the dictionary list response.
 *
 * Extends {@link DictionarySearchResponse} with timestamp fields from the database.
 * Returned by the GET dictionary list endpoint.
 */
export interface DictionaryListItem extends DictionarySearchResponse {
  /** Timestamp when the dictionary was created. Null if not yet persisted. */
  created_at: Date | null;
  /** Timestamp when the dictionary was last updated. Null if never updated. */
  updated_at: Date | null;
}

// =============================================================================
// Analytics Types
// =============================================================================

/**
 * Aggregate usage statistics for a given time period.
 *
 * Provides totals, success/failure breakdowns, and the period boundaries.
 */
export interface UsageAggregate {
  /** Total number of translation requests in the period. */
  total_requests: number;
  /** Total number of individual strings translated. */
  total_strings: number;
  /** Total character count across all translated strings. */
  total_characters: number;
  /** Number of successful translation requests. */
  successful_requests: number;
  /** Number of failed translation requests. */
  failed_requests: number;
  /** Success rate as a decimal between 0 and 1 (e.g., 0.95 = 95%). */
  success_rate: number;
  /** Start of the analytics period in ISO 8601 date format (e.g., "2024-01-01"). */
  period_start: ISODateString;
  /** End of the analytics period in ISO 8601 date format (e.g., "2024-01-31"). */
  period_end: ISODateString;
}

/**
 * Usage statistics broken down by project.
 */
export interface UsageByProject {
  /** The project ID. */
  project_id: string;
  /** The project's machine name. */
  project_name: string;
  /** Number of translation requests for this project. */
  request_count: number;
  /** Number of individual strings translated for this project. */
  string_count: number;
  /** Total character count for this project. */
  character_count: number;
  /** Success rate as a decimal between 0 and 1. */
  success_rate: number;
}

/**
 * Usage statistics broken down by date.
 */
export interface UsageByDate {
  /** The date in ISO 8601 date format (e.g., "2024-01-15"). */
  date: ISODateString;
  /** Number of translation requests on this date. */
  request_count: number;
  /** Number of individual strings translated on this date. */
  string_count: number;
  /** Total character count on this date. */
  character_count: number;
}

/**
 * Complete analytics response containing aggregate, per-project, and per-date breakdowns.
 */
export interface AnalyticsResponse {
  /** Overall aggregate statistics for the queried period. */
  aggregate: UsageAggregate;
  /** Usage breakdown by project. */
  by_project: UsageByProject[];
  /** Usage breakdown by date. */
  by_date: UsageByDate[];
}

// =============================================================================
// Project Languages Types
// =============================================================================

/**
 * Represents a supported language with its display metadata.
 */
export interface AvailableLanguage {
  /** ISO 639-1 language code (e.g., "en", "ja"). */
  language_code: string;
  /** Human-readable language name (e.g., "English", "Japanese"). */
  language: string;
  /** Flag emoji for the language (e.g., "\uD83C\uDDFA\uD83C\uDDF8", "\uD83C\uDDEF\uD83C\uDDF5"). */
  flag: string;
}

/**
 * Response containing a project's configured languages.
 */
export interface ProjectLanguagesResponse {
  /** The project ID. */
  project_id: string;
  /** Comma-separated list of language codes (e.g., "en,zh,ja"). */
  languages: string;
}

// =============================================================================
// Translation Service Types (internal - for calling external service)
// =============================================================================

/** Request payload for external translation service */
export interface TranslationServicePayload {
  /** List of text strings to translate */
  texts: string[];
  /** List of target language codes (e.g., "es", "fr", "de", "zh", "ja") */
  target_language_codes: string[];
  /** Optional context to help with translation */
  context?: string;
  /** Whether to preserve formatting like line breaks */
  preserve_formatting?: boolean;
  /** Source language code (optional, auto-detected if not provided) */
  source_language_code?: string;
}

/** Response from external translation service */
export interface TranslationServiceResponse {
  /** Map from target language code to array of translated strings (one per input text) */
  translations: Record<string, string[]>;
  /** Detected source language code */
  detected_source_language?: string;
}

// =============================================================================
// Response Helper Functions
// =============================================================================

// `successResponse` / `errorResponse` are the canonical constructors from
// `@sudobility/types`, re-exported at the top of this file — not defined here.

// =============================================================================
// API Response Type Aliases (for FE client convenience)
// =============================================================================

/** API response containing an array of {@link Project} objects. */
export type ProjectListResponse = BaseResponse<Project[]>;

/** API response containing a single {@link Project}. */
export type ProjectResponse = BaseResponse<Project>;

/** API response containing {@link UserSettings}. */
export type UserSettingsResponse = BaseResponse<UserSettings>;

/** API response containing {@link DictionaryTranslations}. */
export type DictionaryResponse = BaseResponse<DictionaryTranslations>;

/** API response containing a {@link DictionarySearchResponse}. */
export type DictionarySearchApiResponse =
  BaseResponse<DictionarySearchResponse>;

/** API response containing an array of {@link DictionaryListItem} objects. */
export type DictionaryListApiResponse = BaseResponse<DictionaryListItem[]>;

/** API response containing a {@link DictionaryLookupResponse}. */
export type DictionaryLookupApiResponse =
  BaseResponse<DictionaryLookupResponse>;

/** API response containing an {@link AnalyticsResponse}. */
export type AnalyticsApiResponse = BaseResponse<AnalyticsResponse>;

/** API response containing a {@link TranslationResponse}. */
export type TranslationApiResponse = BaseResponse<TranslationResponse>;

/** API response containing an array of {@link AvailableLanguage} objects. */
export type AvailableLanguagesApiResponse = BaseResponse<AvailableLanguage[]>;

/** API response containing a {@link ProjectLanguagesResponse}. */
export type ProjectLanguagesApiResponse =
  BaseResponse<ProjectLanguagesResponse>;

/** API response containing {@link HealthCheckData}. */
export type HealthCheckResponse = BaseResponse<HealthCheckData>;

// =============================================================================
// Health check response — `HealthCheckData` is the generic payload from
// @sudobility/types ({ status, version }), re-exported at the top of this file.
// =============================================================================
