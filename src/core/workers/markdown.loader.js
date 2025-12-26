
console.log("Loader starting");
import 'tsx/esm';
console.log("TSX imported");
await import('./markdown.worker.ts');
