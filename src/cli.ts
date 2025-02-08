#!/usr/bin/env node

import { Command } from "commander";
import { readFileSync } from "node:fs";
import process from "node:process";
import { interpret } from "./interpreter.js";

async function main() {
  const program = new Command();

  program
    .version("1.0.0-b.1")
    .description("Nyx Programming Language CLI")
    .argument("<file>", "Nyx source file to execute")
    .action(async (file) => {
      const code = readFileSync(file, "utf-8");
      await interpret(code);
    });

  await program.parseAsync(process.argv);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}