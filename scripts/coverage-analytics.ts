#!/usr/bin/env bun

/**
 * Coverage Analytics para Codecov
 * 
 * Este script fornece analytics avançados de cobertura de código
 * usando a API do Codecov com CODECOV_TOKEN
 */

import { config } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Carregar variáveis de ambiente
config();

interface CoverageData {
  total: number;
  covered: number;
  missed: number;
  percentage: number;
  files: FileCoverage[];
}

interface FileCoverage {
  name: string;
  total: number;
  covered: number;
  missed: number;
  percentage: number;
  lines: LineCoverage[];
}

interface LineCoverage {
  line: number;
  hits: number;
  coverage: 'covered' | 'uncovered' | 'partial';
}

interface CodecovAPIResponse {
  coverage: number;
  hits: number;
  misses: number;
  partials: number;
  lines: number;
  methods: number;
  sessions: number;
  branches: number;
  functions: number;
}

class CoverageAnalytics {
  private token: string;
  private baseUrl = 'https://codecov.io/api/v2';
  private repo: string;

  constructor() {
    this.token = process.env.CODECOV_TOKEN || '';
    this.repo = process.env.GITHUB_REPOSITORY || 'gilbert-oliveira/commit-wizard-v2';
    
    if (!this.token) {
      throw new Error('CODECOV_TOKEN não encontrado. Configure a variável de ambiente.');
    }
  }

  /**
   * Obtém dados de cobertura do Codecov
   */
  async getCoverageData(branch: string = 'main'): Promise<CoverageData> {
    try {
      const response = await fetch(`${this.baseUrl}/gh/${this.repo}/reports/latest`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na API do Codecov: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as CodecovAPIResponse;
      
      return {
        total: data.lines,
        covered: data.hits,
        missed: data.misses,
        percentage: data.coverage,
        files: await this.getFileCoverage(branch)
      };
    } catch (error) {
      console.error('❌ Erro ao obter dados de cobertura:', error);
      throw error;
    }
  }

  /**
   * Obtém cobertura por arquivo
   */
  async getFileCoverage(branch: string = 'main'): Promise<FileCoverage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/gh/${this.repo}/reports/latest/files`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter cobertura por arquivo: ${response.status}`);
      }

      const data = await response.json() as any;
      return data.files || [];
    } catch (error) {
      console.error('❌ Erro ao obter cobertura por arquivo:', error);
      return [];
    }
  }

  /**
   * Gera relatório de analytics
   */
  async generateAnalyticsReport(branch: string = 'main'): Promise<void> {
    console.log('📊 Gerando relatório de analytics de cobertura...\n');

    try {
      const coverageData = await this.getCoverageData(branch);
      
      console.log('🎯 RESUMO DE COBERTURA');
      console.log('='.repeat(50));
      console.log(`📈 Cobertura Total: ${coverageData.percentage.toFixed(2)}%`);
      console.log(`📊 Linhas Cobertas: ${coverageData.covered}`);
      console.log(`❌ Linhas Não Cobertas: ${coverageData.missed}`);
      console.log(`📋 Total de Linhas: ${coverageData.total}`);
      console.log('');

      // Análise por arquivo
      if (coverageData.files.length > 0) {
        console.log('📁 ANÁLISE POR ARQUIVO');
        console.log('='.repeat(50));
        
        const sortedFiles = coverageData.files
          .filter(file => file.percentage < 100)
          .sort((a, b) => a.percentage - b.percentage);

        sortedFiles.slice(0, 10).forEach(file => {
          const status = file.percentage >= 80 ? '🟢' : file.percentage >= 50 ? '🟡' : '🔴';
          console.log(`${status} ${file.name}: ${file.percentage.toFixed(1)}% (${file.covered}/${file.total})`);
        });

        if (sortedFiles.length > 10) {
          console.log(`... e mais ${sortedFiles.length - 10} arquivos`);
        }
        console.log('');
      }

      // Recomendações
      this.generateRecommendations(coverageData);
      
      // Salvar relatório
      await this.saveReport(coverageData, branch);

    } catch (error) {
      console.error('❌ Erro ao gerar relatório:', error);
      process.exit(1);
    }
  }

  /**
   * Gera recomendações baseadas na cobertura
   */
  private generateRecommendations(coverageData: CoverageData): void {
    console.log('💡 RECOMENDAÇÕES');
    console.log('='.repeat(50));

    if (coverageData.percentage < 80) {
      console.log('🔴 Cobertura abaixo do ideal (80%)');
      console.log('   → Adicione testes para arquivos com baixa cobertura');
      console.log('   → Foque em arquivos com 0% de cobertura primeiro');
    }

    if (coverageData.percentage >= 90) {
      console.log('🟢 Excelente cobertura!');
      console.log('   → Mantenha a qualidade dos testes');
      console.log('   → Considere adicionar testes de edge cases');
    }

    const uncoveredFiles = coverageData.files.filter(f => f.percentage === 0);
    if (uncoveredFiles.length > 0) {
      console.log(`⚠️  ${uncoveredFiles.length} arquivos sem cobertura`);
      console.log('   → Priorize testes para estes arquivos');
    }

    console.log('');
  }

  /**
   * Salva relatório em arquivo
   */
  private async saveReport(coverageData: CoverageData, branch: string): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      branch,
      summary: {
        total: coverageData.total,
        covered: coverageData.covered,
        missed: coverageData.missed,
        percentage: coverageData.percentage
      },
      files: coverageData.files
        .filter(f => f.percentage < 100)
        .sort((a, b) => a.percentage - b.percentage)
        .slice(0, 20)
    };

    const reportPath = join(process.cwd(), 'coverage', 'analytics-report.json');
    
    try {
      const fs = await import('fs/promises');
      await fs.mkdir(join(process.cwd(), 'coverage'), { recursive: true });
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 Relatório salvo em: ${reportPath}`);
    } catch (error) {
      console.error('❌ Erro ao salvar relatório:', error);
    }
  }

  /**
   * Verifica tendências de cobertura
   */
  async checkCoverageTrends(): Promise<void> {
    console.log('📈 Verificando tendências de cobertura...\n');

    try {
      // Obter dados dos últimos commits
      const response = await fetch(`${this.baseUrl}/gh/${this.repo}/commits`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter histórico: ${response.status}`);
      }

      const data = await response.json() as any;
      const commits = data.commits?.slice(0, 10) || [];

      if (commits.length > 0) {
        console.log('📊 ÚLTIMOS 10 COMMITS');
        console.log('='.repeat(50));
        
        commits.forEach((commit: any) => {
          const coverage = commit.totals?.coverage || 0;
          const status = coverage >= 80 ? '🟢' : coverage >= 50 ? '🟡' : '🔴';
          console.log(`${status} ${commit.commitid?.slice(0, 8)}: ${coverage.toFixed(1)}%`);
        });
      }

    } catch (error) {
      console.error('❌ Erro ao verificar tendências:', error);
    }
  }

  /**
   * Compara cobertura entre branches
   */
  async compareBranches(branch1: string = 'main', branch2: string = 'develop'): Promise<void> {
    console.log(`📊 Comparando cobertura: ${branch1} vs ${branch2}\n`);

    try {
      const [coverage1, coverage2] = await Promise.all([
        this.getCoverageData(branch1),
        this.getCoverageData(branch2)
      ]);

      console.log('BRANCH COMPARISON');
      console.log('='.repeat(50));
      console.log(`${branch1}: ${coverage1.percentage.toFixed(2)}%`);
      console.log(`${branch2}: ${coverage2.percentage.toFixed(2)}%`);
      
      const diff = coverage1.percentage - coverage2.percentage;
      const status = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️';
      console.log(`Diferença: ${status} ${Math.abs(diff).toFixed(2)}%`);

    } catch (error) {
      console.error('❌ Erro ao comparar branches:', error);
    }
  }
}

// Função principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    const analytics = new CoverageAnalytics();

    switch (command) {
      case 'report':
        await analytics.generateAnalyticsReport(args[1] || 'main');
        break;
      
      case 'trends':
        await analytics.checkCoverageTrends();
        break;
      
      case 'compare':
        await analytics.compareBranches(args[1] || 'main', args[2] || 'develop');
        break;
      
      case 'full':
        await analytics.generateAnalyticsReport(args[1] || 'main');
        console.log('\n' + '='.repeat(50) + '\n');
        await analytics.checkCoverageTrends();
        console.log('\n' + '='.repeat(50) + '\n');
        await analytics.compareBranches(args[1] || 'main', args[2] || 'develop');
        break;
      
      default:
        console.log('📊 Coverage Analytics - Codecov');
        console.log('='.repeat(40));
        console.log('');
        console.log('Uso: bun run scripts/coverage-analytics.ts <comando> [opções]');
        console.log('');
        console.log('Comandos:');
        console.log('  report [branch]     - Gerar relatório de cobertura');
        console.log('  trends              - Verificar tendências');
        console.log('  compare [b1] [b2]   - Comparar branches');
        console.log('  full [branch]       - Relatório completo');
        console.log('');
        console.log('Exemplos:');
        console.log('  bun run scripts/coverage-analytics.ts report main');
        console.log('  bun run scripts/coverage-analytics.ts compare main develop');
        console.log('  bun run scripts/coverage-analytics.ts full');
        console.log('');
        console.log('⚠️  Certifique-se de configurar CODECOV_TOKEN');
        break;
    }

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.main) {
  main();
} 