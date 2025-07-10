#!/usr/bin/env node

/**
 * Script para simular upload para Codecov
 * Mostra as informações que seriam enviadas
 */

import fs from 'fs';
import path from 'path';

function simulateCodecovUpload() {
  const lcovPath = path.join(process.cwd(), 'coverage', 'lcov.info');
  
  if (!fs.existsSync(lcovPath)) {
    console.error('❌ Arquivo lcov.info não encontrado');
    console.log('Execute: bun run test:coverage');
    process.exit(1);
  }
  
  const lcovContent = fs.readFileSync(lcovPath, 'utf8');
  const files = lcovContent.split('end_of_record\n').filter(line => line.trim());
  
  console.log('📊 Simulando upload para Codecov...');
  console.log('='.repeat(50));
  
  let totalLines = 0;
  let totalHits = 0;
  
  files.forEach(file => {
    const lines = file.split('\n');
    const sfLine = lines.find(line => line.startsWith('SF:'));
    const lfLine = lines.find(line => line.startsWith('LF:'));
    const lhLine = lines.find(line => line.startsWith('LH:'));
    
    if (sfLine && lfLine && lhLine) {
      const fileName = sfLine.substring(3);
      const linesFound = parseInt(lfLine.substring(3));
      const linesHit = parseInt(lhLine.substring(3));
      
      totalLines += linesFound;
      totalHits += linesHit;
      
      const coverage = ((linesHit / linesFound) * 100).toFixed(1);
      const status = coverage >= 80 ? '🟢' : coverage >= 50 ? '🟡' : '🔴';
      
      console.log(`${status} ${fileName}: ${coverage}% (${linesHit}/${linesFound})`);
    }
  });
  
  const totalCoverage = ((totalHits / totalLines) * 100).toFixed(1);
  console.log('');
  console.log('📈 RESUMO');
  console.log('='.repeat(50));
  console.log(`📊 Cobertura Total: ${totalCoverage}%`);
  console.log(`📋 Linhas Cobertas: ${totalHits}`);
  console.log(`❌ Linhas Não Cobertas: ${totalLines - totalHits}`);
  console.log(`📄 Total de Linhas: ${totalLines}`);
  console.log('');
  
  if (process.env.CODECOV_TOKEN) {
    console.log('✅ CODECOV_TOKEN configurado');
    console.log('📤 Upload seria realizado para: https://codecov.io');
  } else {
    console.log('⚠️  CODECOV_TOKEN não configurado');
    console.log('📝 Para configurar: export CODECOV_TOKEN=seu_token_aqui');
  }
  
  console.log('');
  console.log('🎯 Para upload real, configure o CODECOV_TOKEN e execute:');
  console.log('   curl -X POST --data-binary @coverage/lcov.info \\');
  console.log('        https://codecov.io/upload/v1?token=$CODECOV_TOKEN');
}

// Executar se chamado diretamente
simulateCodecovUpload(); 