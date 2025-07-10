#!/bin/bash

# Script para configurar Coverage Analytics do Codecov
# Uso: ./scripts/setup-coverage-analytics.sh

set -e

echo "🚀 Configurando Coverage Analytics do Codecov..."
echo "================================================"

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script na raiz do projeto"
    exit 1
fi

# Verificar se o CODECOV_TOKEN está configurado
if [ -z "$CODECOV_TOKEN" ]; then
    echo "⚠️  CODECOV_TOKEN não encontrado"
    echo ""
    echo "Para configurar o token:"
    echo "1. Acesse: https://codecov.io/gh/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/')"
    echo "2. Vá em Settings > Repository Upload Token"
    echo "3. Copie o token e configure:"
    echo "   export CODECOV_TOKEN=seu_token_aqui"
    echo ""
    echo "Ou adicione ao .env:"
    echo "CODECOV_TOKEN=seu_token_aqui"
    echo ""
    read -p "Deseja continuar sem o token? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verificar se o Bun está instalado
if ! command -v bun &> /dev/null; then
    echo "❌ Bun não encontrado. Instale o Bun primeiro:"
    echo "curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo "✅ Bun encontrado: $(bun --version)"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
bun install

# Verificar se o c8 está instalado
if ! bun list | grep -q "c8"; then
    echo "📦 Instalando c8 para cobertura..."
    bun add -D c8
fi

# Criar diretório de coverage se não existir
mkdir -p coverage

# Testar configuração
echo ""
echo "🧪 Testando configuração..."
if bun run test:coverage > /dev/null 2>&1; then
    echo "✅ Testes de cobertura funcionando"
else
    echo "❌ Erro nos testes de cobertura"
    echo "Execute: bun run test:coverage"
    exit 1
fi

# Testar analytics se o token estiver configurado
if [ -n "$CODECOV_TOKEN" ]; then
    echo ""
    echo "📊 Testando analytics..."
    if bun run coverage:analytics > /dev/null 2>&1; then
        echo "✅ Analytics funcionando"
    else
        echo "⚠️  Analytics pode ter problemas (verificar token)"
    fi
else
    echo "⚠️  Analytics não testado (token não configurado)"
fi

# Configurar Git hooks (opcional)
echo ""
read -p "Deseja configurar Git hooks para cobertura? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔧 Configurando Git hooks..."
    
    # Criar diretório .git/hooks se não existir
    mkdir -p .git/hooks
    
    # Hook pre-commit para verificar cobertura
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🧪 Executando testes de cobertura..."
bun run test:coverage
if [ $? -ne 0 ]; then
    echo "❌ Testes falharam. Commit abortado."
    exit 1
fi
echo "✅ Testes passaram"
EOF
    
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hook configurado"
fi

# Mostrar comandos úteis
echo ""
echo "🎯 Comandos úteis:"
echo "=================="
echo "bun run test:coverage          - Executar testes com cobertura"
echo "bun run coverage:report        - Gerar relatório de analytics"
echo "bun run coverage:trends        - Verificar tendências"
echo "bun run coverage:compare       - Comparar branches"
echo "bun run coverage:full          - Relatório completo"
echo ""

# Verificar se o projeto está conectado ao Codecov
if [ -n "$CODECOV_TOKEN" ]; then
    echo "🔗 Verificando conexão com Codecov..."
    REPO_URL=$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/')
    echo "📊 Dashboard: https://codecov.io/gh/$REPO_URL"
    echo "📈 Analytics: https://codecov.io/gh/$REPO_URL/analytics"
fi

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o CODECOV_TOKEN se ainda não fez"
echo "2. Execute: bun run test:coverage"
echo "3. Execute: bun run coverage:report"
echo "4. Configure o workflow no GitHub Actions"
echo ""

# Verificar se há um workflow configurado
if [ -f ".github/workflows/coverage-analytics.yml" ]; then
    echo "✅ Workflow de analytics já configurado"
else
    echo "⚠️  Workflow de analytics não encontrado"
    echo "   Verifique se o arquivo .github/workflows/coverage-analytics.yml existe"
fi

echo ""
echo "🚀 Coverage Analytics configurado com sucesso!" 