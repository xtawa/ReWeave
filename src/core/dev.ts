import { spawn } from 'child_process';
import path from 'path';
import chokidar from 'chokidar';

console.log("Starting ReWeave Dev...");

let isBuilding = false;

async function runBuild() {
    if (isBuilding) return;
    isBuilding = true;
    console.log("Change detected. Rebuilding...");

    const build = spawn('npx', ['tsx', 'src/core/build.tsx'], { stdio: 'inherit', shell: true });

    build.on('close', (code) => {
        isBuilding = false;
        if (code === 0) {
            console.log("Build successful.");
        } else {
            console.error("Build failed.");
        }
    });
}

// Initial build
runBuild();

// Watcher
const watcher = chokidar.watch('./src', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true
});

watcher.on('change', (path) => {
    runBuild();
});

// Start Preview Server
console.log("Starting Preview Server...");
spawn('npx', ['vite', 'preview', '--port', '3000'], { stdio: 'inherit', shell: true });
