#!/usr/bin/env node

import { Command } from "commander";
import { readFileSync } from "node:fs";
import process from "node:process";
import { interpret } from "./interpreter";
import { parse } from "./ast";

if (require.main === module) {
  const program = new Command();

  program
    .version("1.0.0-b.1")
    .description("Nyx Programming Language CLI")
    .argument("<file>", "Nyx source file to execute")
    .action((file) => {
      const code = readFileSync(file, "utf-8");
      const ast = parse(code);
      interpret(ast);
    });

  program.parse(process.argv);
}
