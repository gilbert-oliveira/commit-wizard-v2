# Smart Split - Agrupamento Inteligente de Commits

## Visão Geral

O **Smart Split** é uma funcionalidade avançada do Commit Wizard que usa Inteligência Artificial para analisar o contexto das mudanças e agrupar arquivos relacionados em commits lógicos e separados.

## Como Funciona

### 1. Análise de Contexto
- A IA analisa todos os arquivos modificados e o diff geral
- Identifica relacionamentos lógicos entre as mudanças
- Agrupa arquivos que fazem parte da mesma funcionalidade ou correção

### 2. Agrupamento Inteligente
- **Funcionalidades**: Arquivos relacionados a uma nova feature
- **Correções**: Arquivos que fazem parte da mesma correção de bug
- **Refatorações**: Mudanças estruturais relacionadas
- **Testes**: Arquivos de teste associados às mudanças

### 3. Interface do Usuário
```
🧠 Modo Smart Split ativado - Agrupando arquivos por contexto
🤖 Analisando contexto das mudanças...
✅ 3 grupo(s) identificado(s):
  1. Sistema de Autenticação (2 arquivo(s))
     📄 src/auth/login.ts, src/auth/register.ts
  2. Componentes de UI (3 arquivo(s))
     📄 src/components/Button.tsx, src/components/Input.tsx, src/components/Modal.tsx
  3. Configuração de API (1 arquivo(s))
     📄 src/config/api.ts
```

## Uso

### Modo Interativo
```bash
commit-wizard --smart-split
```

O sistema irá:
1. Perguntar se você quer usar Smart Split ou Split Manual
2. Analisar o contexto das mudanças
3. Mostrar os grupos identificados
4. Permitir editar os grupos (futuro)
5. Processar cada grupo individualmente

### Modo Automático
```bash
commit-wizard --smart-split --yes
```

Executa o smart split automaticamente sem prompts.

### Modo Dry Run
```bash
commit-wizard --smart-split --dry-run
```

Mostra como os commits seriam organizados sem executá-los.

## Exemplos de Agrupamento

### Exemplo 1: Nova Funcionalidade
```
📁 src/auth/
  ├── login.ts (novo)
  ├── register.ts (novo)
  └── types.ts (novo)

📁 src/components/
  ├── LoginForm.tsx (novo)
  └── RegisterForm.tsx (novo)

📁 tests/
  └── auth.test.ts (novo)
```

**Grupos Identificados:**
1. **Sistema de Autenticação** (5 arquivos)
   - Todos os arquivos relacionados ao sistema de auth
2. **Testes de Autenticação** (1 arquivo)
   - Arquivo de teste separado

### Exemplo 2: Correção de Bug
```
📁 src/components/
  ├── Button.tsx (modificado)
  ├── Input.tsx (modificado)
  └── Modal.tsx (modificado)

📁 src/utils/
  └── validation.ts (modificado)
```

**Grupos Identificados:**
1. **Correção de Validação** (4 arquivos)
   - Todos os arquivos relacionados à correção do bug de validação

## Vantagens

### 1. Histórico Limpo
- Commits organizados por funcionalidade
- Fácil navegação no histórico do Git
- Revert de features específicas

### 2. Code Review Eficiente
- Pull requests mais focados
- Mudanças relacionadas agrupadas
- Contexto claro para reviewers

### 3. Debugging Melhorado
- Identificação rápida de commits problemáticos
- Bisect mais preciso
- Análise de impacto facilitada

## Configuração

### Arquivo .commit-wizardrc
```json
{
  "splitCommits": true,
  "openai": {
    "model": "gpt-4o",
    "maxTokens": 1000,
    "temperature": 0.3
  }
}
```

### Variáveis de Ambiente
```bash
export OPENAI_API_KEY="sua-chave-aqui"
```

## Limitações

1. **Dependência da OpenAI**: Requer conexão com internet
2. **Custo**: Usa tokens da OpenAI para análise
3. **Tempo**: Análise adicional pode demorar alguns segundos
4. **Precisão**: Depende da qualidade do modelo de IA

## Troubleshooting

### Erro: "Chave da OpenAI não encontrada"
```bash
export OPENAI_API_KEY="sua-chave-aqui"
```

### Erro: "Nenhum grupo foi criado"
- Verifique se há arquivos staged
- Tente com menos arquivos primeiro
- Verifique a conexão com a internet

### Grupos Muito Pequenos
- A IA tenta evitar grupos com apenas 1 arquivo
- Arquivos isolados são adicionados ao primeiro grupo
- Considere usar split manual para casos específicos

## Comparação: Smart Split vs Split Manual

| Característica | Smart Split | Split Manual |
|----------------|-------------|--------------|
| **Automação** | Totalmente automático | Manual por arquivo |
| **Contexto** | Analisa relacionamentos | Baseado apenas em arquivos |
| **Velocidade** | Mais lento (análise IA) | Mais rápido |
| **Precisão** | Alta (entende contexto) | Média (apenas arquivos) |
| **Flexibilidade** | Limitada | Total |
| **Custo** | Usa tokens OpenAI | Gratuito |

## Roadmap

### Próximas Funcionalidades
- [ ] Edição de grupos antes do commit
- [ ] Configuração de regras de agrupamento
- [ ] Histórico de agrupamentos bem-sucedidos
- [ ] Integração com ferramentas de CI/CD
- [ ] Suporte a múltiplos idiomas na análise

### Melhorias Planejadas
- [ ] Cache de análises similares
- [ ] Aprendizado com feedback do usuário
- [ ] Análise de impacto de mudanças
- [ ] Sugestões de branch naming 