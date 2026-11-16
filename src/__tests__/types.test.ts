import { describe, it, expect } from 'vitest';
import { successResponse } from '../index';
import type {
  User,
  UserSettings,
  UsageRecord,
  Project,
  UserCreateRequest,
  UserUpdateRequest,
  UserSettingsUpdateRequest,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  DictionaryCreateRequest,
  DictionaryUpdateRequest,
  DictionarySearchResponse,
  DictionaryTranslations,
  ProjectQueryParams,
  UsageAnalyticsQueryParams,
  DictionaryLookupRequest,
  UsageAggregate,
  UsageByProject,
  UsageByDate,
  AnalyticsResponse,
  RateLimitsConfigData,
  RateLimitTier,
  RateLimitHistoryData,
  RateLimitsConfigResponse,
  RateLimitHistoryResponse,
  ISODateString,
  TranslationServicePayload,
  TranslationServiceResponse,
  HealthCheckData,
  ProjectListResponse,
  ProjectResponse,
  UserSettingsResponse,
  DictionaryResponse,
  DictionarySearchApiResponse,
  DictionaryLookupApiResponse,
  AnalyticsApiResponse,
  TranslationApiResponse,
  AvailableLanguagesApiResponse,
  ProjectLanguagesApiResponse,
  HealthCheckResponse,
} from '../index';
import { RateLimitPeriodType } from '../index';

describe('Entity Types', () => {
  describe('User', () => {
    it('has correct shape with all fields', () => {
      const user: User = {
        firebase_uid: 'firebase-abc',
        email: 'test@example.com',
        display_name: 'Test User',
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(user.firebase_uid).toBe('firebase-abc');
      expect(user.email).toBe('test@example.com');
    });

    it('allows null for optional fields', () => {
      const user: User = {
        firebase_uid: 'firebase-abc',
        email: null,
        display_name: null,
        created_at: null,
        updated_at: null,
      };

      expect(user.email).toBeNull();
      expect(user.display_name).toBeNull();
    });
  });

  describe('UserSettings', () => {
    it('has correct shape', () => {
      const settings: UserSettings = {
        id: 'settings-123',
        firebase_uid: 'firebase-abc',
        organization_name: 'My Org',
        organization_path: 'my-org',
        is_default: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(settings.organization_path).toBe('my-org');
      expect(settings.is_default).toBe(false);
    });

    it('allows null for optional fields', () => {
      const settings: UserSettings = {
        id: null,
        firebase_uid: 'firebase-abc',
        organization_name: null,
        organization_path: 'default-path',
        is_default: true,
        created_at: null,
        updated_at: null,
      };

      expect(settings.id).toBeNull();
      expect(settings.organization_name).toBeNull();
    });
  });

  describe('UsageRecord', () => {
    it('has correct shape', () => {
      const record: UsageRecord = {
        uuid: 'usage-123',
        entity_id: 'entity-456',
        project_id: 'proj-789',
        timestamp: new Date(),
        request_count: 5,
        string_count: 100,
        character_count: 2500,
        success: true,
        error_message: null,
      };

      expect(record.request_count).toBe(5);
      expect(record.success).toBe(true);
    });

    it('captures error information', () => {
      const record: UsageRecord = {
        uuid: 'usage-124',
        entity_id: 'entity-456',
        project_id: 'proj-789',
        timestamp: new Date(),
        request_count: 1,
        string_count: 0,
        character_count: 0,
        success: false,
        error_message: 'Rate limit exceeded',
      };

      expect(record.success).toBe(false);
      expect(record.error_message).toBe('Rate limit exceeded');
    });
  });

  describe('Project', () => {
    it('has correct shape', () => {
      const project: Project = {
        id: 'project-123',
        entity_id: 'entity-456',
        project_name: 'translate',
        display_name: 'Translation Project',
        description: 'A translation project',
        instructions: 'Translate formally',
        default_source_language: 'en',
        default_target_languages: ['ja', 'es'],
        ip_allowlist: null,
        api_key: 'ak_test_123',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(project.project_name).toBe('translate');
      expect(project.entity_id).toBe('entity-456');
    });
  });
});

describe('Request Types', () => {
  describe('UserCreateRequest', () => {
    it('has correct shape', () => {
      const request: UserCreateRequest = {
        firebase_uid: 'firebase-abc',
        email: 'test@example.com',
        display_name: 'Test User',
      };

      expect(request.firebase_uid).toBe('firebase-abc');
    });

    it('allows undefined for optional fields', () => {
      const request: UserCreateRequest = {
        firebase_uid: 'firebase-abc',
        email: undefined,
        display_name: undefined,
      };

      expect(request.email).toBeUndefined();
    });
  });

  describe('UserUpdateRequest', () => {
    it('has correct shape', () => {
      const request: UserUpdateRequest = {
        email: 'new@example.com',
        display_name: 'New Name',
      };

      expect(request.email).toBe('new@example.com');
    });
  });

  describe('UserSettingsUpdateRequest', () => {
    it('has correct shape', () => {
      const request: UserSettingsUpdateRequest = {
        organization_name: 'New Org',
        organization_path: 'new-org',
      };

      expect(request.organization_path).toBe('new-org');
    });
  });

  describe('ProjectCreateRequest', () => {
    it('has correct shape with required and optional fields', () => {
      const request: ProjectCreateRequest = {
        project_name: 'my-project',
        display_name: 'My Project',
        description: 'A test project',
        instructions: 'Translate formally',
      };

      expect(request.project_name).toBe('my-project');
      expect(request.display_name).toBe('My Project');
    });
  });

  describe('ProjectUpdateRequest', () => {
    it('allows partial updates', () => {
      const request: ProjectUpdateRequest = {
        display_name: 'Updated Name',
        project_name: undefined,
        description: undefined,
        instructions: undefined,
        is_active: true,
      };

      expect(request.display_name).toBe('Updated Name');
      expect(request.is_active).toBe(true);
    });
  });

  describe('DictionaryCreateRequest', () => {
    it('has correct shape (is DictionaryTranslations)', () => {
      const request: DictionaryCreateRequest = {
        ja: '\u3053\u3093\u306b\u3061\u306f',
        es: 'hola',
      };

      expect(request['ja']).toBe('\u3053\u3093\u306b\u3061\u306f');
      expect(request['es']).toBe('hola');
    });
  });

  describe('DictionaryUpdateRequest', () => {
    it('has correct shape (is DictionaryTranslations)', () => {
      const request: DictionaryUpdateRequest = {
        ja: '\u4eca\u65e5\u306f',
        de: 'hallo',
      };

      expect(request['ja']).toBe('\u4eca\u65e5\u306f');
      expect(request['de']).toBe('hallo');
    });
  });

  describe('DictionarySearchResponse', () => {
    it('has correct shape', () => {
      const response: DictionarySearchResponse = {
        dictionary_id: 'dict-123',
        translations: {
          en: 'hello',
          ja: '\u3053\u3093\u306b\u3061\u306f',
          es: 'hola',
        },
      };

      expect(response.dictionary_id).toBe('dict-123');
      expect(response.translations['ja']).toBe(
        '\u3053\u3093\u306b\u3061\u306f'
      );
    });
  });
});

describe('Query Parameter Types', () => {
  describe('ProjectQueryParams', () => {
    it('has correct shape', () => {
      const params: ProjectQueryParams = {
        is_active: 'true',
      };

      expect(params.is_active).toBe('true');
    });
  });

  describe('UsageAnalyticsQueryParams', () => {
    it('has correct shape', () => {
      const params: UsageAnalyticsQueryParams = {
        project_id: 'proj-123',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        success: 'true',
      };

      expect(params.project_id).toBe('proj-123');
      expect(params.start_date).toBe('2024-01-01');
    });
  });
});

describe('Dictionary Callback Types', () => {
  describe('DictionaryLookupRequest', () => {
    it('has correct shape', () => {
      const request: DictionaryLookupRequest = {
        term: 'hello',
        languages: 'ja,es,fr',
      };

      expect(request.term).toBe('hello');
      expect(request.languages).toBe('ja,es,fr');
    });
  });
});

describe('Analytics Types', () => {
  describe('UsageAggregate', () => {
    it('has correct shape', () => {
      const aggregate: UsageAggregate = {
        total_requests: 1000,
        total_strings: 50000,
        total_characters: 250000,
        successful_requests: 950,
        failed_requests: 50,
        success_rate: 0.95,
        period_start: '2024-01-01',
        period_end: '2024-01-31',
      };

      expect(aggregate.total_requests).toBe(1000);
      expect(aggregate.success_rate).toBe(0.95);
    });
  });

  describe('UsageByProject', () => {
    it('has correct shape', () => {
      const usage: UsageByProject = {
        project_id: 'proj-123',
        project_name: 'my-project',
        request_count: 500,
        string_count: 25000,
        character_count: 125000,
        success_rate: 0.98,
      };

      expect(usage.project_name).toBe('my-project');
      expect(usage.request_count).toBe(500);
    });
  });

  describe('UsageByDate', () => {
    it('has correct shape', () => {
      const usage: UsageByDate = {
        date: '2024-01-15',
        request_count: 50,
        string_count: 2500,
        character_count: 12500,
      };

      expect(usage.date).toBe('2024-01-15');
    });
  });

  describe('AnalyticsResponse', () => {
    it('has correct shape', () => {
      const response: AnalyticsResponse = {
        aggregate: {
          total_requests: 100,
          total_strings: 5000,
          total_characters: 25000,
          successful_requests: 95,
          failed_requests: 5,
          success_rate: 0.95,
          period_start: '2024-01-01',
          period_end: '2024-01-31',
        },
        by_project: [
          {
            project_id: 'proj-1',
            project_name: 'project-1',
            request_count: 50,
            string_count: 2500,
            character_count: 12500,
            success_rate: 0.96,
          },
        ],
        by_date: [
          {
            date: '2024-01-01',
            request_count: 10,
            string_count: 500,
            character_count: 2500,
          },
        ],
      };

      expect(response.aggregate.total_requests).toBe(100);
      expect(response.by_project).toHaveLength(1);
      expect(response.by_date).toHaveLength(1);
    });
  });
});

describe('Rate Limit Types', () => {
  describe('RateLimitsConfigData', () => {
    it('has correct shape', () => {
      const config: RateLimitsConfigData = {
        tiers: [
          {
            entitlement: 'none',
            displayName: 'Free',
            limits: { hourly: 10, daily: 50, monthly: 200 },
          },
          {
            entitlement: 'pro',
            displayName: 'Pro',
            limits: { hourly: 500, daily: 5000, monthly: 50000 },
          },
        ],
        currentEntitlement: 'pro',
        currentLimits: { hourly: 500, daily: 5000, monthly: 50000 },
        currentUsage: { hourly: 100, daily: 1000, monthly: 10000 },
      };

      expect(config.currentEntitlement).toBe('pro');
      expect(config.tiers).toHaveLength(2);
      expect(config.currentUsage.monthly).toBe(10000);
    });

    it('supports optional resets field', () => {
      const config: RateLimitsConfigData = {
        tiers: [],
        currentEntitlement: 'none',
        currentLimits: { hourly: 10, daily: 50, monthly: 200 },
        currentUsage: { hourly: 0, daily: 0, monthly: 0 },
        resets: {
          hourly: '2024-01-15T15:00:00Z',
          daily: '2024-01-16T00:00:00Z',
          monthly: '2024-02-01T00:00:00Z',
        },
      };

      expect(config.resets?.monthly).toBe('2024-02-01T00:00:00Z');
    });
  });

  describe('RateLimitHistoryData', () => {
    it('has correct shape', () => {
      const history: RateLimitHistoryData = {
        periodType: RateLimitPeriodType.DAY,
        entries: [
          {
            periodStart: '2024-01-15T00:00:00Z',
            periodEnd: '2024-01-16T00:00:00Z',
            requestCount: 42,
            limit: 50,
          },
        ],
        totalEntries: 1,
      };

      expect(history.periodType).toBe('day');
      expect(history.entries).toHaveLength(1);
      expect(history.entries[0].requestCount).toBe(42);
    });
  });

  describe('RateLimitTier', () => {
    it('has correct shape', () => {
      const tier: RateLimitTier = {
        entitlement: 'pro',
        displayName: 'Pro',
        limits: { hourly: 500, daily: 5000, monthly: 50000 },
      };

      expect(tier.entitlement).toBe('pro');
      expect(tier.limits.monthly).toBe(50000);
    });
  });

  describe('RateLimitPeriodType', () => {
    it('has all expected values', () => {
      expect(RateLimitPeriodType.HOUR).toBe('hour');
      expect(RateLimitPeriodType.DAY).toBe('day');
      expect(RateLimitPeriodType.MONTH).toBe('month');
    });
  });
});

describe('ISODateString', () => {
  it('is assignable from regular strings', () => {
    const dateStr: ISODateString = '2024-01-15T12:00:00.000Z';
    expect(dateStr).toBe('2024-01-15T12:00:00.000Z');
  });

  it('works in UsageAggregate period fields', () => {
    const aggregate: UsageAggregate = {
      total_requests: 10,
      total_strings: 100,
      total_characters: 500,
      successful_requests: 10,
      failed_requests: 0,
      success_rate: 1.0,
      period_start: '2024-01-01',
      period_end: '2024-01-31',
    };

    expect(aggregate.period_start).toBe('2024-01-01');
    expect(aggregate.period_end).toBe('2024-01-31');
  });

  it('works in UsageByDate date field', () => {
    const entry: UsageByDate = {
      date: '2024-06-15',
      request_count: 5,
      string_count: 50,
      character_count: 250,
    };

    expect(entry.date).toBe('2024-06-15');
  });

  it('works in RateLimitsConfigData resets fields', () => {
    const config: RateLimitsConfigData = {
      tiers: [],
      currentEntitlement: 'pro',
      currentLimits: { hourly: 500, daily: 5000, monthly: 50000 },
      currentUsage: { hourly: 0, daily: 0, monthly: 0 },
      resets: {
        hourly: '2024-01-15T16:00:00Z',
        daily: '2024-01-16T00:00:00Z',
        monthly: '2024-02-01T00:00:00Z',
      },
    };

    expect(config.resets?.monthly).toBe('2024-02-01T00:00:00Z');
    expect(config.resets?.hourly).toBe('2024-01-15T16:00:00Z');
  });
});

describe('DictionaryTranslations edge cases', () => {
  it('handles empty translations object', () => {
    const translations: DictionaryTranslations = {};
    expect(Object.keys(translations)).toHaveLength(0);
  });

  it('handles single language translation', () => {
    const translations: DictionaryTranslations = {
      en: 'hello',
    };
    expect(Object.keys(translations)).toHaveLength(1);
    expect(translations['en']).toBe('hello');
  });

  it('handles many languages', () => {
    const translations: DictionaryTranslations = {
      en: 'hello',
      es: 'hola',
      fr: 'bonjour',
      de: 'hallo',
      ja: '\u3053\u3093\u306b\u3061\u306f',
      zh: '\u4f60\u597d',
      ko: '\uc548\ub155\ud558\uc138\uc694',
    };
    expect(Object.keys(translations)).toHaveLength(7);
  });
});

describe('Translation Service Types', () => {
  describe('TranslationServicePayload', () => {
    it('has correct shape with required fields', () => {
      const payload: TranslationServicePayload = {
        texts: ['Hello', 'World'],
        target_language_codes: ['ja', 'es'],
      };

      expect(payload.texts).toHaveLength(2);
      expect(payload.target_language_codes).toContain('ja');
    });

    it('accepts optional fields', () => {
      const payload: TranslationServicePayload = {
        texts: ['Hello'],
        target_language_codes: ['ja'],
        context: 'greeting',
        preserve_formatting: true,
        source_language_code: 'en',
      };

      expect(payload.context).toBe('greeting');
      expect(payload.preserve_formatting).toBe(true);
      expect(payload.source_language_code).toBe('en');
    });
  });

  describe('TranslationServiceResponse', () => {
    it('has correct shape', () => {
      const response: TranslationServiceResponse = {
        translations: {
          ja: ['\u3053\u3093\u306b\u3061\u306f', '\u4e16\u754c'], // "Hello", "World" in Japanese
          es: ['Hola', 'Mundo'], // "Hello", "World" in Spanish
        },
        detected_source_language: 'en',
      };

      expect(Object.keys(response.translations)).toHaveLength(2);
      expect(response.translations['ja']).toHaveLength(2);
      expect(response.translations['es']).toHaveLength(2);
      expect(response.detected_source_language).toBe('en');
    });
  });
});

describe('Health Check Types', () => {
  describe('HealthCheckData', () => {
    it('has correct shape', () => {
      const data: HealthCheckData = {
        version: '1.0.0',
        status: 'healthy',
      };

      expect(data.version).toBe('1.0.0');
      expect(data.status).toBe('healthy');
    });
  });
});

describe('Response Type Aliases', () => {
  it('ProjectListResponse composes correctly with BaseResponse', () => {
    const response: ProjectListResponse = successResponse<Project[]>([
      {
        id: 'proj-1',
        entity_id: 'entity-1',
        project_name: 'test-project',
        display_name: 'Test Project',
        description: null,
        instructions: null,
        default_source_language: null,
        default_target_languages: null,
        ip_allowlist: null,
        api_key: null,
        is_active: true,
        created_at: null,
        updated_at: null,
      },
    ]);

    expect(response.success).toBe(true);
    expect(response.data).toHaveLength(1);
    expect(response.data![0].project_name).toBe('test-project');
  });

  it('ProjectResponse composes correctly with BaseResponse', () => {
    const response: ProjectResponse = successResponse<Project>({
      id: 'proj-1',
      entity_id: 'entity-1',
      project_name: 'test-project',
      display_name: 'Test Project',
      description: null,
      instructions: null,
      default_source_language: null,
      default_target_languages: null,
      ip_allowlist: null,
      api_key: null,
      is_active: true,
      created_at: null,
      updated_at: null,
    });

    expect(response.success).toBe(true);
    expect(response.data!.id).toBe('proj-1');
  });

  it('UserSettingsResponse composes correctly with BaseResponse', () => {
    const response: UserSettingsResponse = successResponse({
      id: 'settings-1',
      firebase_uid: 'uid-1',
      organization_name: 'My Org',
      organization_path: 'my-org',
      is_default: true,
      created_at: null,
      updated_at: null,
    });

    expect(response.success).toBe(true);
    expect(response.data!.firebase_uid).toBe('uid-1');
  });

  it('RateLimitsConfigResponse composes correctly with BaseResponse', () => {
    const response: RateLimitsConfigResponse =
      successResponse<RateLimitsConfigData>({
        tiers: [
          {
            entitlement: 'pro',
            displayName: 'Pro',
            limits: { hourly: 500, daily: 5000, monthly: 50000 },
          },
        ],
        currentEntitlement: 'pro',
        currentLimits: { hourly: 500, daily: 5000, monthly: 50000 },
        currentUsage: { hourly: 50, daily: 1000, monthly: 10000 },
      });

    expect(response.success).toBe(true);
    expect(response.data!.currentEntitlement).toBe('pro');
  });

  it('RateLimitHistoryResponse composes correctly with BaseResponse', () => {
    const response: RateLimitHistoryResponse =
      successResponse<RateLimitHistoryData>({
        periodType: RateLimitPeriodType.DAY,
        entries: [
          {
            periodStart: '2024-01-15T00:00:00Z',
            periodEnd: '2024-01-16T00:00:00Z',
            requestCount: 42,
            limit: 50,
          },
        ],
        totalEntries: 1,
      });

    expect(response.success).toBe(true);
    expect(response.data!.entries).toHaveLength(1);
  });

  it('DictionaryResponse composes correctly with BaseResponse', () => {
    const response: DictionaryResponse =
      successResponse<DictionaryTranslations>({
        en: 'hello',
        es: 'hola',
      });

    expect(response.success).toBe(true);
    expect(response.data!['en']).toBe('hello');
  });

  it('DictionarySearchApiResponse composes correctly with BaseResponse', () => {
    const response: DictionarySearchApiResponse = successResponse({
      dictionary_id: 'dict-1',
      translations: { en: 'hello', es: 'hola' },
    });

    expect(response.success).toBe(true);
    expect(response.data!.dictionary_id).toBe('dict-1');
  });

  it('DictionaryLookupApiResponse composes correctly with BaseResponse', () => {
    const response: DictionaryLookupApiResponse = successResponse({
      term: 'hello',
      translations: { en: 'hello', fr: null },
    });

    expect(response.success).toBe(true);
    expect(response.data!.term).toBe('hello');
    expect(response.data!.translations['fr']).toBeNull();
  });

  it('AnalyticsApiResponse composes correctly with BaseResponse', () => {
    const response: AnalyticsApiResponse = successResponse({
      aggregate: {
        total_requests: 100,
        total_strings: 500,
        total_characters: 2500,
        successful_requests: 95,
        failed_requests: 5,
        success_rate: 0.95,
        period_start: '2024-01-01',
        period_end: '2024-01-31',
      },
      by_project: [],
      by_date: [],
    });

    expect(response.success).toBe(true);
    expect(response.data!.aggregate.total_requests).toBe(100);
    expect(response.data!.by_project).toHaveLength(0);
  });

  it('TranslationApiResponse composes correctly with BaseResponse', () => {
    const response: TranslationApiResponse = successResponse({
      translations: { ja: ['hello translated'] },
      dictionary_terms_used: [],
      request_id: 'req-1',
    });

    expect(response.success).toBe(true);
    expect(response.data!.request_id).toBe('req-1');
  });

  it('AvailableLanguagesApiResponse composes correctly with BaseResponse', () => {
    const response: AvailableLanguagesApiResponse = successResponse([
      {
        language_code: 'en',
        language: 'English',
        flag: '\uD83C\uDDFA\uD83C\uDDF8',
      },
      {
        language_code: 'ja',
        language: 'Japanese',
        flag: '\uD83C\uDDEF\uD83C\uDDF5',
      },
    ]);

    expect(response.success).toBe(true);
    expect(response.data).toHaveLength(2);
  });

  it('ProjectLanguagesApiResponse composes correctly with BaseResponse', () => {
    const response: ProjectLanguagesApiResponse = successResponse({
      project_id: 'proj-1',
      languages: 'en,ja,es',
    });

    expect(response.success).toBe(true);
    expect(response.data!.languages).toBe('en,ja,es');
  });

  it('HealthCheckResponse composes correctly with BaseResponse', () => {
    const response: HealthCheckResponse = successResponse({
      name: 'whisperly-api',
      version: '1.0.0',
      status: 'healthy',
    });

    expect(response.success).toBe(true);
    expect(response.data!.status).toBe('healthy');
  });
});
