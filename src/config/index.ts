import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

export interface Config {
  openai: {
    model: string;
    maxTokens: number;
    temperature: number;
    apiKey?: string;
  };
  language: string;
  commitStyle: 'conventional' | 'simple' | 'detailed';
  autoCommit: boolean;
  splitCommits: boolean;
  dryRun: boolean;
  prompt: {
    includeFileNames: boolean;
    includeDiffStats: boolean;
    customInstructions: string;
  };
}

const DEFAULT_CONFIG: Config = {
  openai: {
    model: 'gpt-4o',
    maxTokens: 150,
    temperature: 0.7,
  },
  language: 'pt',
  commitStyle: 'conventional',
  autoCommit: false,
  splitCommits: false,
  dryRun: false,
  prompt: {
    includeFileNames: true,
    includeDiffStats: true,
    customInstructions: '',
  },
};

export function loadConfig(configPath?: string): Config {
  const defaultConfigPath = join(process.cwd(), '.commit-wizardrc');
  const actualConfigPath = configPath || defaultConfigPath;
  let config = { ...DEFAULT_CONFIG };

  // Carregar configuração do arquivo
  if (existsSync(actualConfigPath)) {
    try {
      const fileContent = readFileSync(actualConfigPath, 'utf-8');
      const userConfig = JSON.parse(fileContent);
      config = mergeConfig(config, userConfig);
    } catch (error) {
      console.warn(`⚠️  Erro ao ler .commit-wizardrc: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  // Adicionar chave da OpenAI das variáveis de ambiente
  config.openai.apiKey = process.env.OPENAI_API_KEY;

  return config;
}

function mergeConfig(defaultConfig: Config, userConfig: any): Config {
  return {
    ...defaultConfig,
    ...userConfig,
    openai: {
      ...defaultConfig.openai,
      ...userConfig.openai,
    },
    prompt: {
      ...defaultConfig.prompt,
      ...userConfig.prompt,
    },
  };
}

export function validateConfig(config: Config): string[] {
  const errors: string[] = [];

  if (!config.openai.apiKey) {
    errors.push('OPENAI_API_KEY não encontrada nas variáveis de ambiente');
  }

  if (config.openai.maxTokens < 10 || config.openai.maxTokens > 4000) {
    errors.push('maxTokens deve estar entre 10 e 4000');
  }

  if (config.openai.temperature < 0 || config.openai.temperature > 2) {
    errors.push('temperature deve estar entre 0 e 2');
  }

  if (!['pt', 'en', 'es', 'fr'].includes(config.language)) {
    errors.push('language deve ser pt, en, es ou fr');
  }

  if (!['conventional', 'simple', 'detailed'].includes(config.commitStyle)) {
    errors.push('commitStyle deve ser conventional, simple ou detailed');
  }

  return errors;
} 