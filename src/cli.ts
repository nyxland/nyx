import { Command } from "commander";
import { readFileSync } from "node:fs";
import process from "node:process";
import { interpret } from "./interpreter";

const program = new Command();

program
  .version("1.0.0-b.1")
  .description("Nyx Programming Language CLI")
  .argument("<file>", "Nyx source file to execute")
  .action((file) => {
    const code = readFileSync(file, "utf-8");
    interpret(code);
  });

program.parse(process.argv);
