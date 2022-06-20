import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const packageJson = require('../package.json');

const config = {
  version: packageJson.version,
};

export default config;
