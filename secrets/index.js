import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, readFileSync } from 'fs';

const dir = dirname(fileURLToPath(import.meta.url));
const encoding = readFileSync(join(dir, './encoded'), 'utf8').split('\n')

function decode (encoded) {
    return Buffer.from(encoded, 'base64').toString('utf8');
}

for (let i = 0; i < encoding.length; i += 2) {
    writeFileSync(join(dir, `../${decode(encoding[i])}`), decode(encoding[i + 1]), 'utf8');
}