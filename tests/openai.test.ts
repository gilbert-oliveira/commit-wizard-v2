import { describe, it, expect } from 'bun:test';
import { 
  buildPrompt, 
  extractCommitTypeFromMessage, 
  detectCommitType 
} from '../core/openai.ts';
import type { Config } from '../config/index.ts';

describe('OpenAI Module', () => {
  const mockConfig: Config = {
    openai: {
      model: 'gpt-4o',
      maxTokens: 150,
      temperature: 0.7,
      apiKey: 'sk-test-key',
      timeout: 30000,
      retries: 2
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
      maxDiffSize: 8000
    },
    smartSplit: {
      enabled: true,
      minGroupSize: 1,
      maxGroups: 5,
      autoEdit: false,
      confidenceThreshold: 0.7,
      preferredGroupTypes: ['feat', 'fix', 'refactor', 'test', 'docs']
    },
    ui: {
      theme: 'auto',
      showProgress: true,
      animateProgress: true,
      compactMode: false
    },
    cache: {
      enabled: true,
      ttl: 60,
      maxSize: 100
    },
    hooks: {
      preCommit: [],
      postCommit: [],
      preGenerate: [],
      postGenerate: []
    },
    advanced: {
      maxFileSize: 1024,
      excludePatterns: ['*.log', '*.tmp'],
      includePatterns: [],
      enableDebug: false,
      logLevel: 'info'
    }
  };

  describe('buildPrompt', () => {
    it('should build prompt with Portuguese language', () => {
      const diff = '+console.log("test");';
      const filenames = ['test.js'];
      
      const prompt = buildPrompt(diff, mockConfig, filenames);
      
      expect(prompt).toContain('português');
      expect(prompt).toContain('conventional');
      expect(prompt).toContain('test.js');
      expect(prompt).toContain(diff);
    });

    it('should build prompt with English language', () => {
      const englishConfig = { ...mockConfig, language: 'en' };
      const diff = '+console.log("test");';
      const filenames = ['test.js'];
      
      const prompt = buildPrompt(diff, englishConfig, filenames);
      
      expect(prompt).toContain('english');
      expect(prompt).toContain('conventional');
      expect(prompt).toContain('test.js');
      expect(prompt).toContain(diff);
    });

    it('should include custom instructions when provided', () => {
      const customConfig = { 
        ...mockConfig, 
        prompt: { 
          ...mockConfig.prompt, 
          customInstructions: 'Always use emojis' 
        } 
      };
      const diff = '+console.log("test");';
      const filenames = ['test.js'];
      
      const prompt = buildPrompt(diff, customConfig, filenames);
      
      expect(prompt).toContain('Always use emojis');
    });
  });

  describe('extractCommitTypeFromMessage', () => {
    it('should extract feat type correctly', () => {
      const message = 'feat(auth): add user authentication';
      const type = extractCommitTypeFromMessage(message);
      expect(type).toBe('feat');
    });

    it('should extract fix type correctly', () => {
      const message = 'fix: resolve login issue';
      const type = extractCommitTypeFromMessage(message);
      expect(type).toBe('fix');
    });

    it('should extract docs type correctly', () => {
      const message = 'docs(readme): update installation guide';
      const type = extractCommitTypeFromMessage(message);
      expect(type).toBe('docs');
    });

    it('should return null for non-conventional messages', () => {
      const message = 'update some files';
      const type = extractCommitTypeFromMessage(message);
      expect(type).toBeNull();
    });

    it('should handle case insensitive matching', () => {
      const message = 'FEAT: add new feature';
      const type = extractCommitTypeFromMessage(message);
      expect(type).toBe('feat');
    });
  });

  describe('detectCommitType', () => {
    it('should detect test type for test files', () => {
      const diff = '+describe("test", () => {});';
      const filenames = ['test.spec.js', 'utils.test.ts'];
      
      const type = detectCommitType(diff, filenames);
      expect(type).toBe('test');
    });

    it('should detect docs type for markdown files', () => {
      const diff = '+# New Documentation';
      const filenames = ['README.md', 'docs/guide.md'];
      
      const type = detectCommitType(diff, filenames);
      expect(type).toBe('docs');
    });

    it('should detect build type for package.json', () => {
      const diff = '+"dependency": "^1.0.0"';
      const filenames = ['package.json'];
      
      const type = detectCommitType(diff, filenames);
      expect(type).toBe('build');
    });

    it('should detect style type for CSS files', () => {
      const diff = '+.button { color: red; }';
      const filenames = ['styles.css', 'main.scss'];
      
      const type = detectCommitType(diff, filenames);
      expect(type).toBe('style');
    });

    it('should detect fix type for bug-related changes', () => {
      const diff = '+// fix: resolve bug in authentication';
      const filenames = ['auth.js'];
      
      const type = detectCommitType(diff, filenames);
      expect(type).toBe('fix');
    });

    it('should detect feat type for new features', () => {
      const diff = '+// add new user registration feature';
      const filenames = ['user.js'];
      
      const type = detectCommitType(diff, filenames);
      expect(type).toBe('feat');
    });

    it('should default to chore for unrecognized changes', () => {
      const diff = '+// some random change';
      const filenames = ['random.js'];
      
      const type = detectCommitType(diff, filenames);
      expect(type).toBe('chore');
    });
  });
}); 