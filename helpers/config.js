import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(__dirname);

function getPackageJson() {
  const data = fs.readFileSync(
    path.resolve(__dirname, '..', 'package.json'),
    'utf-8',
  );

  return JSON.parse(data);
}

export default function config() {
  const packageJson = getPackageJson();

  return {
    version: packageJson.version,
  };
}
