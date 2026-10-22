import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { readdir,readFile,writeFile,mkdir,rm,cp } from 'node:fs/promises';
import { resolve,relative,dirname } from 'node:path';
const directory=process.cwd();
async function files(path){const entries=await readdir(path,{withFileTypes:true});return (await Promise.all(entries.map(entry=>entry.isDirectory()?files(resolve(path,entry.name)):resolve(path,entry.name)))).flat();}
const sourceFiles=(await files(resolve(directory,'src'))).filter(path=>/\.(ts|tsx)$/.test(path)&&!path.endsWith('.d.ts'));
await rm(resolve(directory,'dist'),{recursive:true,force:true});
await build({entryPoints:sourceFiles,outdir:resolve(directory,'dist'),outbase:resolve(directory,'src'),format:'esm',platform:'neutral',target:'es2022',jsx:'automatic',sourcemap:true,bundle:false,logLevel:'warning'});
execFileSync('pnpm',['exec','tsc','-p','tsconfig.build.json'],{stdio:'inherit'});
const imports=/(from\s*["']|import\s*["'])(\.{1,2}\/[^"']+)(["'])/g;
for(const path of await files(resolve(directory,'dist'))){if(!/\.(js|ts)$/.test(path))continue;const source=await readFile(path,'utf8');await writeFile(path,source.replace(imports,(_,prefix,target,suffix)=>prefix+(/\.(tsx?|jsx?)$/.test(target)?target.replace(/\.(tsx?|jsx?)$/,'.js'):/\.[a-z]+$/.test(target)?target:target+'.js')+suffix));}
await cp(resolve(directory,'../../LICENSE'),resolve(directory,'LICENSE'));
console.log(`Built ${JSON.parse(await readFile(resolve(directory,'package.json'),'utf8')).name}: ${sourceFiles.length} modules + declarations.`);
