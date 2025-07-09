#!/usr/bin/env bun

import { intro, outro, log } from '@clack/prompts';
import { main } from '../src/core/index.ts';

async function run() {
  try {
    intro('🧙‍♂️ Commit Wizard');
    
    await main();
    
    outro('Até logo! ✨');
  } catch (error) {
    log.error(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    process.exit(1);
  }
}

if (import.meta.main) {
  run();
} 