import type { Config } from '../config/index.ts';

export interface CommitSuggestion {
  message: string;
  type: 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'test' | 'chore' | 'build' | 'ci';
  confidence: number;
}

export interface OpenAIResponse {
  success: boolean;
  suggestion?: CommitSuggestion;
  error?: string;
}

/**
 * Constrói o prompt para a OpenAI baseado no diff e configurações
 */
export function buildPrompt(diff: string, config: Config, filenames: string[]): string {
  const language = config.language === 'pt' ? 'português' : 'english';
  const styleInstructions = getStyleInstructions(config.commitStyle, config.language);
  
  let prompt = `Você é um assistente especializado em gerar mensagens de commit Git.

CONTEXTO:
- Idioma: ${language}
- Estilo: ${config.commitStyle}
${config.prompt.customInstructions ? `- Instruções customizadas: ${config.prompt.customInstructions}` : ''}

ARQUIVOS MODIFICADOS:
${filenames.map(file => `- ${file}`).join('\n')}

INSTRUÇÕES:
${styleInstructions}

Analise o diff abaixo e gere UMA mensagem de commit que:
1. Seja clara e concisa
2. Descreva o que foi alterado
3. Siga o estilo ${config.commitStyle}
4. Use ${language}
5. Retorne APENAS a mensagem do commit, sem explicações adicionais ou formatação

DIFF:
\`\`\`
${diff}
\`\`\`

Mensagem de commit:`;

  return prompt;
}

/**
 * Obtém instruções específicas baseadas no estilo de commit
 */
function getStyleInstructions(style: string, language: string): string {
  const instructions = {
    pt: {
      conventional: `- Use formato: tipo(escopo): descrição
- Tipos válidos: feat, fix, docs, style, refactor, test, chore, build, ci
- Exemplo: "feat(auth): adicionar validação de email"
- Mantenha a primeira linha com até 50 caracteres`,
      
      simple: `- Use formato simples e direto
- Comece com verbo no infinitivo
- Exemplo: "corrigir validação de formulário"
- Máximo 50 caracteres`,
      
      detailed: `- Primeira linha: resumo em até 50 caracteres
- Se necessário, adicione corpo explicativo
- Use presente do indicativo
- Seja descritivo mas conciso`
    },
    en: {
      conventional: `- Use format: type(scope): description
- Valid types: feat, fix, docs, style, refactor, test, chore, build, ci
- Example: "feat(auth): add email validation"
- Keep first line under 50 characters`,
      
      simple: `- Use simple and direct format
- Start with imperative verb
- Example: "fix form validation"
- Maximum 50 characters`,
      
      detailed: `- First line: summary under 50 characters
- Add explanatory body if needed
- Use imperative mood
- Be descriptive but concise`
    }
  };
  
  const lang = language === 'pt' ? 'pt' : 'en';
  return instructions[lang][style as keyof typeof instructions.pt] || instructions[lang].conventional;
}

/**
 * Extrai o tipo de commit da mensagem gerada pela OpenAI
 */
export function extractCommitTypeFromMessage(message: string): CommitSuggestion['type'] | null {
  const messageLower = message.toLowerCase();
  
  // Padrões para detectar tipos de commit
  const typePatterns = {
    feat: /^(feat|feature)(\([^)]+\))?:/i,
    fix: /^(fix|bugfix)(\([^)]+\))?:/i,
    docs: /^(docs|documentation)(\([^)]+\))?:/i,
    style: /^(style|format)(\([^)]+\))?:/i,
    refactor: /^(refactor|refactoring)(\([^)]+\))?:/i,
    test: /^(test|testing)(\([^)]+\))?:/i,
    chore: /^(chore|maintenance)(\([^)]+\))?:/i,
    build: /^(build|ci)(\([^)]+\))?:/i,
    ci: /^(ci|continuous-integration)(\([^)]+\))?:/i
  };

  for (const [type, pattern] of Object.entries(typePatterns)) {
    if (pattern.test(message)) {
      return type as CommitSuggestion['type'];
    }
  }

  return null;
}

/**
 * Detecta o tipo de commit baseado no diff
 */
export function detectCommitType(diff: string, filenames: string[]): CommitSuggestion['type'] {
  const diffLower = diff.toLowerCase();
  const filesStr = filenames.join(' ').toLowerCase();
  
  // Testes
  if (filesStr.includes('test') || filesStr.includes('spec') || diffLower.includes('test(')) {
    return 'test';
  }
  
  // Documentação
  if (filesStr.includes('readme') || filesStr.includes('.md') || filesStr.includes('docs')) {
    return 'docs';
  }
  
  // Build/CI
  if (filesStr.includes('package.json') || filesStr.includes('dockerfile') || 
      filesStr.includes('.yml') || filesStr.includes('.yaml') || 
      filesStr.includes('webpack') || filesStr.includes('tsconfig')) {
    return 'build';
  }
  
  // Styles
  if (filesStr.includes('.css') || filesStr.includes('.scss') || 
      diffLower.includes('style') || diffLower.includes('format')) {
    return 'style';
  }
  
  // Fixes
  if (diffLower.includes('fix') || diffLower.includes('bug') || 
      diffLower.includes('error') || diffLower.includes('issue')) {
    return 'fix';
  }
  
  // Features (padrão para novas funcionalidades)
  if (diffLower.includes('add') || diffLower.includes('new') || 
      diffLower.includes('create') || diffLower.includes('implement')) {
    return 'feat';
  }
  
  // Refactor
  if (diffLower.includes('refactor') || diffLower.includes('restructure') || 
      diffLower.includes('rename')) {
    return 'refactor';
  }
  
  // Default
  return 'chore';
}

/**
 * Consome a API da OpenAI para gerar mensagem de commit
 */
export async function generateCommitMessage(
  diff: string, 
  config: Config, 
  filenames: string[]
): Promise<OpenAIResponse> {
  try {
    if (!config.openai.apiKey) {
      return {
        success: false,
        error: 'Chave da OpenAI não encontrada. Configure OPENAI_API_KEY nas variáveis de ambiente.'
      };
    }

    const prompt = buildPrompt(diff, config, filenames);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openai.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.openai.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any;
      return {
        success: false,
        error: `Erro da OpenAI (${response.status}): ${errorData.error?.message || 'Erro desconhecido'}`
      };
    }

    const data = await response.json() as any;
    let message = data.choices?.[0]?.message?.content?.trim();

    if (!message) {
      return {
        success: false,
        error: 'OpenAI retornou resposta vazia'
      };
    }

    // Remover backticks se presentes
    message = message.replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    // Remover quebras de linha extras
    message = message.trim();

    // Extrair tipo da mensagem gerada pela OpenAI
    const extractedType = extractCommitTypeFromMessage(message);
    const fallbackType = detectCommitType(diff, filenames);

    return {
      success: true,
      suggestion: {
        message,
        type: extractedType || fallbackType,
        confidence: 0.8 // Placeholder - pode ser melhorado
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `Erro ao conectar com OpenAI: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}

/**
 * Gera mensagem com retry em caso de falha
 */
export async function generateWithRetry(
  diff: string,
  config: Config,
  filenames: string[],
  maxRetries: number = 3
): Promise<OpenAIResponse> {
  let lastError = '';
  
  for (let i = 0; i < maxRetries; i++) {
    const result = await generateCommitMessage(diff, config, filenames);
    
    if (result.success) {
      return result;
    }
    
    lastError = result.error || 'Erro desconhecido';
    
    // Aguardar antes de tentar novamente (exponential backoff)
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  return {
    success: false,
    error: `Falha após ${maxRetries} tentativas. Último erro: ${lastError}`
  };
} 