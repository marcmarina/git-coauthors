import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default function config() {
  const packageJson = require('../package.json');

  return {
    version: packageJson.version,
  };
}
