const { execSync } = require("node:child_process");
const os = require("node:os");

const platform = os.platform();
const distPath = "dist/cli.js";

console.log("Building the project...");
execSync("bun run build");
console.log("Build completed");

if (platform === "linux" || platform === "darwin") {
  execSync(`chmod +x ${distPath}`);
  console.log("Set executable permissions for dist/cli.js");
} else if (platform === "win32") {
  console.log("Windows detected, no need to set executable permissions");
} else {
  console.log("Unknown platform, no changes made");
}
