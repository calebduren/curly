import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const dir = mkdtempSync(join(tmpdir(), 'typograph-consumer-'));
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
      '@calebduren/typograph',
    ],
    root,
  ),
);
for (const f of pack.files)
  assert.match(
    f.path,
    /^(dist\/|(?:prose|typeset|typography)\.css$|README\.md$|LICENSE$|THIRD_PARTY_NOTICES\.md$|CHANGELOG\.md$|package\.json$)/,
  );
writeFileSync(
  join(dir, 'package.json'),
  JSON.stringify({ name: 'typograph-clean-consumer', private: true, type: 'module' }),
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
import {smarten,analyze} from '@calebduren/typograph';
import remarkTypograph from '@calebduren/typograph/remark';
import rehypeTypograph from '@calebduren/typograph/rehype';
import {createQuoteStream} from '@calebduren/typograph/stream';
import {createTypeset} from '@calebduren/typograph/typography';
import {principles} from '@calebduren/typograph/principles';
assert.equal(smarten('"Hello."'),'“Hello.”');
assert.equal(analyze('6"').changes.length,0);
const tree={type:'root',children:[{type:'paragraph',children:[{type:'text',value:'"Hello."'}]}]};
remarkTypograph()(tree);
assert.equal(tree.children[0].children[0].value,'“Hello.”');
const html={type:'root',children:[{type:'element',tagName:'p',children:[{type:'text',value:'"Hi."'}]}]};
rehypeTypograph()(html);
assert.equal(html.children[0].children[0].value,'“Hi.”');
const stream=createQuoteStream();
assert.equal(stream.write('"Hello'), '');
assert.equal(stream.end('."'), '“Hello.”');
assert.match(readFileSync(import.meta.resolve('@calebduren/typograph/prose.css').replace('file://',''),'utf8'),/typograph-prose/);
assert.equal(createTypeset()['--typeset-size'],'1.125rem');
assert.ok(principles.some(p=>p.id==='case'));
assert.match(readFileSync(import.meta.resolve('@calebduren/typograph/typography.css').replace('file://',''),'utf8'),/font-synthesis: none/);
console.log('ESM, adapters, streaming, CSS, typography, principles: passed');
`;
writeFileSync(join(dir, 'consumer.mjs'), checks);
writeFileSync(
  join(dir, 'consumer.cjs'),
  `const assert=require('node:assert/strict');const {smarten}=require('@calebduren/typograph');assert.equal(smarten('"Hello."'),'“Hello.”');for(const name of ['remark','rehype','stream','typography','principles'])assert.ok(require('@calebduren/typograph/'+name));console.log('CommonJS: passed');`,
);
const typed = `import {smarten,type TypographOptions} from '@calebduren/typograph';import remarkTypograph from '@calebduren/typograph/remark';import rehypeTypograph from '@calebduren/typograph/rehype';import {createQuoteStream} from '@calebduren/typograph/stream';
import {createTypeset} from '@calebduren/typograph/typography';
import {principles} from '@calebduren/typograph/principles';const options:TypographOptions={primes:true};const result:string=smarten('hello',options);remarkTypograph({annotate:true});rehypeTypograph();createQuoteStream().end();`;
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
  readFileSync(join(dir, 'node_modules/@calebduren/typograph/package.json'), 'utf8'),
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
