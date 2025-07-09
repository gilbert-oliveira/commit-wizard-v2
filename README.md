# 🧙‍♂️ Commit Wizard

CLI inteligente que gera mensagens de commit automaticamente usando IA da OpenAI, baseado nas mudanças do seu código.

## ✨ Funcionalidades

- 🤖 **Geração Inteligente**: Analisa `git diff --staged` e gera mensagens com OpenAI
- 🎨 **Estilos Flexíveis**: Conventional Commits, Simple ou Detailed
- 🌍 **Multilíngue**: Português, Inglês, Espanhol, Francês
- ✏️ **Interface Interativa**: Preview, edição, cópia e confirmação
- 📋 **Cópia para Clipboard**: Copie a mensagem sem commitar
- ⚙️ **Altamente Configurável**: `.commit-wizardrc` personalizável
- 🔄 **Retry Automático**: Tolerância a falhas de rede

## 🚀 Instalação

```bash
# Instalar globalmente
bun install -g commit-wizard

# Ou usar via npx
npx commit-wizard
```

## 📋 Pré-requisitos

1. **Chave da OpenAI**: Configure `OPENAI_API_KEY` nas variáveis de ambiente
2. **Bun.js**: Runtime JavaScript/TypeScript
3. **Git**: Repositório inicializado com arquivos staged

## 🛠️ Configuração

Crie um arquivo `.commit-wizardrc` na raiz do projeto:

```json
{
  "openai": {
    "model": "gpt-4o",
    "maxTokens": 150,
    "temperature": 0.7
  },
  "language": "pt",
  "commitStyle": "conventional",
  "autoCommit": false,
  "splitCommits": false,
  "dryRun": false,
  "prompt": {
    "includeFileNames": true,
    "includeDiffStats": true,
    "customInstructions": ""
  }
}
```

### Variáveis de Ambiente

```bash
# Obrigatória
OPENAI_API_KEY=sua_chave_openai_aqui

# Opcionais (sobrescrevem .commit-wizardrc)
COMMIT_WIZARD_MODEL=gpt-4o
COMMIT_WIZARD_LANGUAGE=pt
COMMIT_WIZARD_MAX_TOKENS=150
```

## 📖 Como Usar

1. **Faça suas alterações** no código
2. **Adicione ao stage**: `git add .` ou `git add arquivo.js`
3. **Execute o Wizard**: `commit-wizard`
4. **Interaja** com as opções:
   - ✅ Commit imediato
   - ✏️ Editar mensagem
   - 📋 Copiar para clipboard
   - ❌ Cancelar

## 🎯 Estilos de Commit

### Conventional
```
feat(auth): adicionar validação de email
fix(api): corrigir endpoint de usuários
docs(readme): atualizar instruções de instalação
```

### Simple
```
adicionar validação de email
corrigir endpoint de usuários
atualizar instruções de instalação
```

### Detailed
```
Adicionar validação de email no formulário

- Implementar regex para formato válido
- Adicionar mensagens de erro customizadas
- Melhorar UX do formulário de login
```

## 🌟 Exemplos

```bash
# Uso básico
commit-wizard

# Com configuração inline via env
OPENAI_API_KEY=sk-xxx commit-wizard

# Verificar se há arquivos staged primeiro
git status
git add src/
commit-wizard
```

## 🔧 Desenvolvimento

```bash
# Clonar e instalar
git clone <repo>
cd commit-wizard
bun install

# Executar em modo dev
bun run dev

# Build para produção
bun run build

# Executar testes
bun test
```

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue antes de submeter PRs grandes.

---

**Desenvolvido com ❤️ usando Bun.js e OpenAI**
