#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { main } = require('../build/main');

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error('Usage: nyx <source-file>');
  process.exit(1);
}

const sourceFilePath = path.resolve(args[0]);

fs.readFile(sourceFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  main(data);
});
