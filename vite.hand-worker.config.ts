import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({publicDir:false,build:{outDir:'public/workers',emptyOutDir:true,lib:{entry:fileURLToPath(new URL('./src/hand-worker.ts',import.meta.url)),name:'NoahHandWorker',formats:['iife'],fileName:()=> 'hand-worker.js'},rollupOptions:{output:{inlineDynamicImports:true}}}});
