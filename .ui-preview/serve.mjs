import {build} from 'esbuild';
import http from 'node:http';
import fs from 'node:fs';
await build({entryPoints:['.ui-preview/entry.tsx'],bundle:true,outdir:'.ui-preview/dist',format:'esm',plugins:[{name:'preview-sanity',setup(b){b.onResolve({filter:/^sanity$/},()=>({path:'sanity',namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},()=>({contents:'export function useClient(){throw new Error("Preview only")}',loader:'js'}));}}]});
const html='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/entry.css"><style>body{margin:0;font-family:Arial,sans-serif}html,body,#root{height:100%}</style></head><body><div id="root"></div><script type="module" src="/entry.js"></script></body></html>';
http.createServer((req,res)=>{const file=req.url==='/entry.js'?'entry.js':req.url==='/entry.css'?'entry.css':null;res.setHeader('Content-Type',file?(file.endsWith('js')?'text/javascript':'text/css'):'text/html');res.end(file?fs.readFileSync('.ui-preview/dist/'+file):html)}).listen(4399,'127.0.0.1',()=>console.log('UI preview http://127.0.0.1:4399'));
