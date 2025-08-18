const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Srishti Farm Application...\n');

// Start server
console.log('📡 Starting backend server...');
const server = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit then start client
setTimeout(() => {
  console.log('🌐 Starting frontend client...');
  const client = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true
  });

  client.on('close', (code) => {
    console.log(`Client process exited with code ${code}`);
    server.kill();
  });
}, 3000);

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  server.kill();
  process.exit();
});
