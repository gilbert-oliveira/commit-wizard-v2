import { main } from './core/index.ts';
import { parseArgs, showHelp, showVersion } from './utils/args.ts';

const args = process.argv.slice(2);
const parsedArgs = parseArgs(args);

// Modo auto combina --yes e --silent
if (parsedArgs.auto) {
  parsedArgs.yes = true;
  parsedArgs.silent = true;
}

// Mostrar ajuda
if (parsedArgs.help) {
  showHelp();
  process.exit(0);
}

// Mostrar versão
if (parsedArgs.version) {
  showVersion();
  process.exit(0);
}

// Executar commit wizard
main(parsedArgs).catch(error => {
  console.error('❌ Erro inesperado:', error);
  process.exit(1);
}); 