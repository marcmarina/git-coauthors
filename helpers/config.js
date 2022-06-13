import fs from 'fs';
import path from 'path';

function getPackageJson() {
  const data = fs.readFileSync(path.resolve('package.json'), 'utf-8');

  return JSON.parse(data);
}

export default function config() {
  const packageJson = getPackageJson();

  return {
    version: packageJson.version,
  };
}
