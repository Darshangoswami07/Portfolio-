type AIProviderName = 'openai' | 'anthropic' | 'google' | 'groq' | 'openrouter';

type EnvStatus = 'configured' | 'missing' | 'placeholder' | 'invalid';

interface EnvCheck {
  key: string;
  status: EnvStatus;
}

const PLACEHOLDER_PATTERN =
  /^(your_|change-me|changeme|example|placeholder)|\[?YOUR[-_A-Z0-9]*\]?/i;

function readEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

function isPlaceholder(value: string | undefined): boolean {
  return Boolean(value && PLACEHOLDER_PATTERN.test(value));
}

function parseBoolean(value: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on'].includes(value?.toLowerCase() ?? '');
}

function checkRequired(key: string, validator?: (value: string) => boolean): EnvCheck {
  const value = readEnv(key);

  if (!value) {
    return { key, status: 'missing' };
  }

  if (isPlaceholder(value)) {
    return { key, status: 'placeholder' };
  }

  if (validator && !validator(value)) {
    return { key, status: 'invalid' };
  }

  return { key, status: 'configured' };
}

function isPostgresUrl(value: string): boolean {
  return value.startsWith('postgresql://') || value.startsWith('postgres://');
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhoneNumber(value: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(value);
}

const useMockDb = parseBoolean(readEnv('USE_MOCK_DB'));
const databaseUrl = readEnv('DATABASE_URL');
const databaseUrlValid =
  databaseUrl !== undefined && !isPlaceholder(databaseUrl) && isPostgresUrl(databaseUrl);

const preferredAiProvider = (readEnv('AI_PROVIDER')?.toLowerCase() || 'openai') as AIProviderName;
const supportedAiProviders: AIProviderName[] = [
  'openai',
  'anthropic',
  'google',
  'groq',
  'openrouter',
];

export const env = {
  database: {
    enabled: !useMockDb && databaseUrlValid,
    useMockDb,
    reason: useMockDb
      ? 'Prisma disabled because USE_MOCK_DB=true.'
      : !databaseUrl
      ? 'DATABASE_URL is not set.'
      : isPlaceholder(databaseUrl)
      ? 'DATABASE_URL contains a placeholder value.'
      : !isPostgresUrl(databaseUrl)
      ? 'DATABASE_URL must be a PostgreSQL connection string.'
      : undefined,
  },
  ai: {
    preferredProvider: supportedAiProviders.includes(preferredAiProvider)
      ? preferredAiProvider
      : 'openai',
    supportedProviders: supportedAiProviders,
  },
} as const;

let validated = false;

export function validateEnv(): void {
  if (validated) {
    return;
  }

  validated = true;

  const checks: EnvCheck[] = [
    checkRequired('DATABASE_URL', isPostgresUrl),
    checkRequired('DIRECT_URL', isPostgresUrl),
    checkRequired('EMAIL_USER', isEmail),
    checkRequired('EMAIL_PASS'),
    checkRequired('TWILIO_ACCOUNT_SID'),
    checkRequired('TWILIO_AUTH_TOKEN'),
    checkRequired('TWILIO_WHATSAPP_FROM', isPhoneNumber),
    checkRequired('ADMIN_WHATSAPP_NUMBER', isPhoneNumber),
  ];

  const aiChecks: EnvCheck[] = [
    checkRequired('OPENAI_API_KEY'),
    checkRequired('GOOGLE_API_KEY'),
    checkRequired('ANTHROPIC_API_KEY'),
    checkRequired('GROQ_API_KEY'),
    checkRequired('OPENROUTER_API_KEY'),
  ];

  const missingOrInvalid = checks.filter((check) => check.status !== 'configured');
  const configuredAiProviders = aiChecks
    .filter((check) => check.status === 'configured')
    .map((check) => check.key.replace('_API_KEY', '').toLowerCase());

  console.info('[env] Backend configuration diagnostics');
  console.info(
    `[env] Database: ${
      env.database.enabled
        ? 'configured'
        : env.database.useMockDb
        ? 'mock mode enabled'
        : `not ready (${env.database.reason})`
    }`
  );
  console.info(
    `[env] Email: ${
      checks.find((check) => check.key === 'EMAIL_USER')?.status === 'configured' &&
      checks.find((check) => check.key === 'EMAIL_PASS')?.status === 'configured'
        ? 'configured'
        : 'not configured'
    }`
  );
  console.info(
    `[env] WhatsApp: ${
      checks.find((check) => check.key === 'TWILIO_ACCOUNT_SID')?.status === 'configured' &&
      checks.find((check) => check.key === 'TWILIO_AUTH_TOKEN')?.status === 'configured' &&
      checks.find((check) => check.key === 'TWILIO_WHATSAPP_FROM')?.status === 'configured' &&
      checks.find((check) => check.key === 'ADMIN_WHATSAPP_NUMBER')?.status === 'configured'
        ? 'configured'
        : 'not configured'
    }`
  );
  console.info(
    `[env] AI providers with keys: ${
      configuredAiProviders.length > 0 ? configuredAiProviders.join(', ') : 'none'
    }`
  );

  if (missingOrInvalid.length > 0) {
    console.warn(
      `[env] Missing or invalid backend variables: ${missingOrInvalid
        .map((check) => `${check.key}:${check.status}`)
        .join(', ')}`
    );
  }
}

validateEnv();
