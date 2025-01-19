import { Command } from 'commander';
import { readFileSync } from 'fs';
import { interpret } from './interpreter';

const program = new Command();

program
  .version('0.1.0')
  .description('Nyx Programming Language CLI')
  .argument('<file>', 'Nyx source file to execute')
  .action((file) => {
    const code = readFileSync(file, 'utf-8');
    interpret(code);
  });

program.parse(process.argv);
