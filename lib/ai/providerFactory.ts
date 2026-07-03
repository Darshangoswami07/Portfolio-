import { AIProviderConfig, AIProvider } from './types';
import { AIProvider as AIProviderEnum } from '@prisma/client';
import { OpenAIProvider } from './openaiProvider';
import { AnthropicProvider } from './anthropicProvider';
import { GoogleProvider } from './googleProvider';
import { GroqProvider } from './groqProvider';
import { OpenRouterProvider } from './openrouterProvider';

type ProviderEnvConfig = {
  provider: AIProviderEnum;
  apiKey: string | undefined;
  config: Omit<AIProviderConfig, 'apiKey'>;
};

const PROVIDER_ENV: ProviderEnvConfig[] = [
  {
    provider: AIProviderEnum.OPENAI,
    apiKey: process.env.OPENAI_API_KEY,
    config: {
      organization: process.env.OPENAI_ORG_ID,
    },
  },
  {
    provider: AIProviderEnum.GOOGLE,
    apiKey: process.env.GOOGLE_API_KEY,
    config: {},
  },
  {
    provider: AIProviderEnum.ANTHROPIC,
    apiKey: process.env.ANTHROPIC_API_KEY,
    config: {},
  },
  {
    provider: AIProviderEnum.GROQ,
    apiKey: process.env.GROQ_API_KEY,
    config: {},
  },
  {
    provider: AIProviderEnum.OPENROUTER,
    apiKey: process.env.OPENROUTER_API_KEY,
    config: {
      baseURL: process.env.OPENROUTER_BASE_URL,
    },
  },
];

function normalizeProviderName(value: string | undefined): AIProviderEnum | null {
  const normalized = value?.trim().toUpperCase();
  if (!normalized) {
    return null;
  }

  return Object.values(AIProviderEnum).includes(normalized as AIProviderEnum)
    ? (normalized as AIProviderEnum)
    : null;
}

function getConfiguredProvider(preferredProvider: AIProviderEnum | null): ProviderEnvConfig | null {
  const preferred = PROVIDER_ENV.find((entry) => entry.provider === preferredProvider);
  if (preferred?.apiKey?.trim()) {
    return preferred;
  }

  return PROVIDER_ENV.find((entry) => Boolean(entry.apiKey?.trim())) ?? null;
}

export class AIProviderFactory {
  static createProvider(provider: AIProviderEnum, config: AIProviderConfig): AIProvider {
    switch (provider) {
      case AIProviderEnum.OPENAI:
        return new OpenAIProvider(config);
      case AIProviderEnum.ANTHROPIC:
        return new AnthropicProvider(config);
      case AIProviderEnum.GOOGLE:
        return new GoogleProvider(config);
      case AIProviderEnum.GROQ:
        return new GroqProvider(config);
      case AIProviderEnum.OPENROUTER:
        return new OpenRouterProvider(config);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  static getProviderFromEnv(): AIProvider {
    const preferredProvider = normalizeProviderName(process.env.AI_PROVIDER);
    const selectedProvider = getConfiguredProvider(preferredProvider);

    if (!selectedProvider) {
      throw new Error(
        'No AI provider API key is configured. Set one of OPENAI_API_KEY, GOOGLE_API_KEY, ANTHROPIC_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY.'
      );
    }

    if (preferredProvider && selectedProvider.provider !== preferredProvider) {
      console.warn(
        `[AIProviderFactory] Preferred provider ${preferredProvider} has no API key. Falling back to ${selectedProvider.provider}.`
      );
    }

    return this.createProvider(selectedProvider.provider, {
      ...selectedProvider.config,
      apiKey: selectedProvider.apiKey!.trim(),
    });
  }
}
