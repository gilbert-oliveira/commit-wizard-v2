# Demonstração do Smart Split

Este exemplo mostra como o Smart Split funciona na prática.

## Cenário: Desenvolvimento de Sistema de Autenticação

Imagine que você está desenvolvendo um sistema de autenticação e fez várias mudanças relacionadas:

### Arquivos Modificados

```bash
$ git status --porcelain
M  src/auth/login.ts
M  src/auth/register.ts
M  src/auth/types.ts
M  src/components/LoginForm.tsx
M  src/components/RegisterForm.tsx
M  src/utils/validation.ts
M  src/config/api.ts
M  tests/auth.test.ts
M  docs/auth.md
```

### Executando Smart Split

```bash
$ commit-wizard --smart-split
```

### Saída Esperada

```
🧠 Modo Smart Split ativado - Agrupando arquivos por contexto
🤖 Analisando contexto das mudanças...

✅ 4 grupo(s) identificado(s):
  1. Sistema de Autenticação (5 arquivo(s))
     📄 src/auth/login.ts, src/auth/register.ts, src/auth/types.ts, src/components/LoginForm.tsx, src/components/RegisterForm.tsx
  2. Utilitários de Validação (1 arquivo(s))
     📄 src/utils/validation.ts
  3. Configuração de API (1 arquivo(s))
     📄 src/config/api.ts
  4. Testes e Documentação (2 arquivo(s))
     📄 tests/auth.test.ts, docs/auth.md

🔄 Processando grupo 1/4: Sistema de Autenticação
🤖 Gerando commit para: Sistema de Autenticação
💭 Mensagem: "feat(auth): implementar sistema de login e registro

- Adicionar componentes LoginForm e RegisterForm
- Implementar tipos TypeScript para autenticação
- Integrar formulários com API de autenticação"

✅ Commit realizado com sucesso!
🔗 Hash: a1b2c3d4

Continuar com os próximos grupos? (y/N)
```

### Resultado Final

Após processar todos os grupos, você terá 4 commits organizados:

1. **feat(auth): implementar sistema de login e registro**
   - Arquivos relacionados ao sistema de autenticação

2. **feat(validation): adicionar utilitários de validação**
   - Utilitários de validação reutilizáveis

3. **feat(config): configurar endpoints de API**
   - Configuração da API

4. **test(auth): adicionar testes e documentação**
   - Testes e documentação do sistema

## Vantagens do Smart Split

### 1. Histórico Organizado
```bash
$ git log --oneline
a1b2c3d feat(auth): implementar sistema de login e registro
b2c3d4e feat(validation): adicionar utilitários de validação
c3d4e5f feat(config): configurar endpoints de API
d4e5f6g test(auth): adicionar testes e documentação
```

### 2. Revert Seletivo
```bash
# Reverter apenas a configuração de API
git revert c3d4e5f

# Reverter apenas os testes
git revert d4e5f6g
```

### 3. Code Review Focado
- Cada commit tem um propósito claro
- Reviewers podem focar em mudanças específicas
- Mudanças relacionadas ficam juntas

## Comparação: Com vs Sem Smart Split

### Sem Smart Split (Commit Único)
```bash
$ git log --oneline
a1b2c3d feat: implementar sistema de autenticação completo
```

**Problemas:**
- Commit muito grande
- Difícil de reverter partes específicas
- Code review complexo
- Histórico pouco informativo

### Com Smart Split
```bash
$ git log --oneline
a1b2c3d feat(auth): implementar sistema de login e registro
b2c3d4e feat(validation): adicionar utilitários de validação
c3d4e5f feat(config): configurar endpoints de API
d4e5f6g test(auth): adicionar testes e documentação
```

**Vantagens:**
- Commits pequenos e focados
- Fácil revert seletivo
- Code review eficiente
- Histórico informativo

## Configuração Recomendada

### .commit-wizardrc
```json
{
  "openai": {
    "model": "gpt-4o",
    "maxTokens": 1000,
    "temperature": 0.3
  },
  "language": "pt",
  "commitStyle": "conventional",
  "splitCommits": true,
  "dryRun": false,
  "prompt": {
    "includeFileNames": true,
    "includeDiffStats": true,
    "customInstructions": "Foque em agrupar arquivos por funcionalidade ou correção específica"
  }
}
```

## Dicas de Uso

### 1. Use para Features Grandes
```bash
# Desenvolvimento de feature completa
git add .
commit-wizard --smart-split
```

### 2. Use para Correções Complexas
```bash
# Correção que afeta múltiplos componentes
git add .
commit-wizard --smart-split
```

### 3. Preview Antes do Commit
```bash
# Ver como ficaria organizado
commit-wizard --smart-split --dry-run
```

### 4. Modo Automático
```bash
# Para CI/CD ou scripts
commit-wizard --smart-split --yes
```

## Troubleshooting

### Grupos Muito Pequenos
Se a IA criar grupos com apenas 1 arquivo:
- Considere usar split manual
- Ajuste a temperatura no config
- Adicione instruções customizadas

### Grupos Muito Grandes
Se a IA agrupar tudo junto:
- Verifique se as mudanças são realmente relacionadas
- Use split manual para mais controle
- Ajuste as instruções customizadas

### Erro de Análise
Se a IA falhar na análise:
- Verifique a conexão com a internet
- Confirme que a API key está configurada
- Tente com menos arquivos primeiro 