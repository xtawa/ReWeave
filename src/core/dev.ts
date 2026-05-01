import { spawn } from 'child_process';
import chokidar from 'chokidar';

console.log("Starting ReWeave Dev...");

const isWindows = process.platform === 'win32';

let isBuilding = false;
let hasPendingBuild = false;

function runBuild(): Promise<void> {
    if (isBuilding) {
        hasPendingBuild = true;
        return Promise.resolve();
    }
    isBuilding = true;
    console.log("Change detected. Rebuilding...");

    return new Promise<void>((resolve) => {
        const build = spawn('npx', ['tsx', 'src/core/build.tsx'], { stdio: 'inherit', shell: isWindows });

        build.on('close', (code) => {
            isBuilding = false;
            if (code === 0) {
                console.log("Build successful.");
            } else {
                console.error("Build failed.");
            }

            if (hasPendingBuild) {
                hasPendingBuild = false;
                runBuild();
            }
            resolve();
        });

        build.on('error', (err) => {
            isBuilding = false;
            console.error("Failed to start build process:", err.message);
            resolve();
        });
    });
}

// Initial build, then start preview server
console.log("Running initial build...");
runBuild().then(() => {
    console.log("Starting Preview Server...");
    spawn('npx', ['vite', 'preview', '--port', '3000'], { stdio: 'inherit', shell: isWindows });
});

// Watcher
const watcher = chokidar.watch(['./src', './public'], {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true
});

watcher.on('change', (path) => {
    runBuild();
});
