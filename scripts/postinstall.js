const { execSync } = require('child_process');
const os = require('os');

const platform = os.platform();

if (platform === 'linux' || platform === 'darwin') {
  execSync('chmod +x dist/cli.js');
  console.log('Set executable permissions for dist/cli.js');
} else if (platform === 'win32') {
  console.log('Windows detected, no need to set executable permissions');
} else {
  console.log('Unknown platform, no changes made');
}
