import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { loadConfig, validateConfig, type Config } from '../config/index.ts';
import { writeFileSync, unlinkSync, existsSync } from 'fs';

describe('Config Module', () => {
  const testConfigPath = '.commit-wizardrc.test';
  
  beforeEach(() => {
    // Limpar arquivo de teste se existir
    if (existsSync(testConfigPath)) {
      unlinkSync(testConfigPath);
    }
  });
  
  afterEach(() => {
    // Limpar arquivo de teste
    if (existsSync(testConfigPath)) {
      unlinkSync(testConfigPath);
    }
  });

  describe('loadConfig', () => {
    it('should load default config when no file exists', () => {
      const config = loadConfig();
      
      expect(config.openai.model).toBe('gpt-4o');
      expect(config.language).toBe('pt');
      expect(config.commitStyle).toBe('conventional');
      expect(config.autoCommit).toBe(false);
      expect(config.splitCommits).toBe(false);
      expect(config.dryRun).toBe(false);
    });

    it('should merge user config with default config', () => {
      const userConfig = {
        language: 'en',
        commitStyle: 'simple',
        openai: {
          model: 'gpt-3.5-turbo',
          temperature: 0.5
        }
      };
      
      writeFileSync('.commit-wizardrc', JSON.stringify(userConfig));
      
      const config = loadConfig();
      
      expect(config.language).toBe('en');
      expect(config.commitStyle).toBe('simple');
      expect(config.openai.model).toBe('gpt-3.5-turbo');
      expect(config.openai.temperature).toBe(0.5);
      expect(config.openai.maxTokens).toBe(150); // Default value preserved
      
      unlinkSync('.commit-wizardrc');
    });
  });

  describe('validateConfig', () => {
    it('should return errors for invalid config', () => {
      const invalidConfig: Config = {
        openai: {
          model: 'gpt-4o',
          maxTokens: 5000, // Invalid: too high
          temperature: 3, // Invalid: too high
          apiKey: undefined
        },
        language: 'invalid' as any, // Invalid language
        commitStyle: 'invalid' as any, // Invalid style
        autoCommit: false,
        splitCommits: false,
        dryRun: false,
        prompt: {
          includeFileNames: true,
          includeDiffStats: true,
          customInstructions: ''
        }
      };
      
      const errors = validateConfig(invalidConfig);
      
      expect(errors).toContain('OPENAI_API_KEY não encontrada nas variáveis de ambiente');
      expect(errors).toContain('maxTokens deve estar entre 10 e 4000');
      expect(errors).toContain('temperature deve estar entre 0 e 2');
      expect(errors).toContain('language deve ser pt, en, es ou fr');
      expect(errors).toContain('commitStyle deve ser conventional, simple ou detailed');
    });

    it('should return no errors for valid config', () => {
      const validConfig: Config = {
        openai: {
          model: 'gpt-4o',
          maxTokens: 150,
          temperature: 0.7,
          apiKey: 'sk-test-key'
        },
        language: 'pt',
        commitStyle: 'conventional',
        autoCommit: false,
        splitCommits: false,
        dryRun: false,
        prompt: {
          includeFileNames: true,
          includeDiffStats: true,
          customInstructions: ''
        }
      };
      
      const errors = validateConfig(validConfig);
      
      expect(errors).toHaveLength(0);
    });
  });
}); 