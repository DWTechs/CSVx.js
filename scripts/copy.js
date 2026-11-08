import fs from 'node:fs';

const mail = 'https://github.com/DWTechs/CSVx.js';
const CRLF = '\r\n';
const rel = './';
const src = `${rel}build/`;
const dest = `${rel}dist/`;
const files = [
  {
    src: `${rel}src/csvx.d.ts`,
    dest: `${dest}csvx.d.ts`,
  },
  {
    src: `${src}csvx.mjs`,
    dest: `${dest}csvx.js`,
  },
];

fs.mkdirSync(dest, { recursive: true });
const license = fs.readFileSync(`${rel}LICENSE`, 'utf8');

for (const file of files) {
  const fileContent = fs.readFileSync(file.src, 'utf8');
  fs.writeFileSync(
    file.dest,
    `/*${CRLF}${license}${CRLF}${mail}${CRLF}*/${CRLF}${CRLF}${fileContent}`
  );
}
