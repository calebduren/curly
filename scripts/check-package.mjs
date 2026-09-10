import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const dir = mkdtempSync(join(tmpdir(), 'curly-consumer-'));
const cache = join(dir, 'npm-cache');
const exec = (command, args, cwd = dir) =>
  execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const [pack] = JSON.parse(
  exec(
    'npm',
    [
      'pack',
      '--json',
      '--ignore-scripts',
      '--cache',
      cache,
      '--pack-destination',
      dir,
      '-w',
      'cowboy-curly',
    ],
    root,
  ),
);
for (const f of pack.files)
  assert.match(f.path, /^(dist\/|prose\.css$|README\.md$|LICENSE$|CHANGELOG\.md$|package\.json$)/);
writeFileSync(
  join(dir, 'package.json'),
  JSON.stringify({ name: 'curly-clean-consumer', private: true, type: 'module' }),
);
exec('npm', [
  'install',
  '--offline',
  '--ignore-scripts',
  '--no-audit',
  '--no-fund',
  '--cache',
  cache,
  join(dir, pack.filename),
]);
const checks = `
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {smarten,analyze} from 'cowboy-curly';
import remarkCurly from 'cowboy-curly/remark';
import rehypeCurly from 'cowboy-curly/rehype';
import {createQuoteStream} from 'cowboy-curly/stream';
assert.equal(smarten('"Hello."'),'“Hello.”');
assert.equal(analyze('6"').changes.length,0);
const tree={type:'root',children:[{type:'paragraph',children:[{type:'text',value:'"Hello."'}]}]};
remarkCurly()(tree);
assert.equal(tree.children[0].children[0].value,'“Hello.”');
const html={type:'root',children:[{type:'element',tagName:'p',children:[{type:'text',value:'"Hi."'}]}]};
rehypeCurly()(html);
assert.equal(html.children[0].children[0].value,'“Hi.”');
const stream=createQuoteStream();
assert.equal(stream.write('"Hello'), '');
assert.equal(stream.end('."'), '“Hello.”');
assert.match(readFileSync(import.meta.resolve('cowboy-curly/prose.css').replace('file://',''),'utf8'),/curly-prose/);
console.log('ESM, adapters, streaming, CSS: passed');
`;
writeFileSync(join(dir, 'consumer.mjs'), checks);
writeFileSync(
  join(dir, 'consumer.cjs'),
  `const assert=require('node:assert/strict');const {smarten}=require('cowboy-curly');assert.equal(smarten('"Hello."'),'“Hello.”');for(const name of ['remark','rehype','stream'])assert.ok(require('cowboy-curly/'+name));console.log('CommonJS: passed');`,
);
const typed = `import {smarten,type CurlyOptions} from 'cowboy-curly';import remarkCurly from 'cowboy-curly/remark';import rehypeCurly from 'cowboy-curly/rehype';import {createQuoteStream} from 'cowboy-curly/stream';const options:CurlyOptions={primes:true};const result:string=smarten('hello',options);remarkCurly({annotate:true});rehypeCurly();createQuoteStream().end();`;
writeFileSync(join(dir, 'consumer.mts'), typed);
writeFileSync(join(dir, 'consumer.cts'), typed);
console.log(exec(process.execPath, ['consumer.mjs']).trim());
console.log(exec(process.execPath, ['consumer.cjs']).trim());
exec(process.execPath, [
  join(root, 'node_modules/typescript/bin/tsc'),
  '--noEmit',
  '--strict',
  '--skipLibCheck',
  '--target',
  'ES2022',
  '--module',
  'NodeNext',
  '--moduleResolution',
  'NodeNext',
  'consumer.mts',
  'consumer.cts',
]);
console.log('TypeScript NodeNext (ESM and CommonJS): passed');
const packageManifest = JSON.parse(
  readFileSync(join(dir, 'node_modules/cowboy-curly/package.json'), 'utf8'),
);
assert.equal(Object.keys(packageManifest.dependencies ?? {}).length, 0);
mkdirSync(resolve('release'), { recursive: true });
copyFileSync(join(dir, pack.filename), resolve('release', pack.filename));
writeFileSync(
  resolve('release/package-check.json'),
  JSON.stringify(
    {
      version: packageManifest.version,
      tarball: pack.filename,
      integrity: pack.integrity,
      shasum: pack.shasum,
      bytes: pack.size,
      unpackedBytes: pack.unpackedSize,
      checks: [
        'ESM',
        'CommonJS',
        'remark',
        'rehype',
        'stream',
        'CSS',
        'TypeScript NodeNext ESM/CommonJS',
        'no runtime dependencies',
        'package file allowlist',
      ],
    },
    null,
    2,
  ) + '\n',
);
console.log('Clean consumer passed. Tested tarball: release/' + pack.filename);
