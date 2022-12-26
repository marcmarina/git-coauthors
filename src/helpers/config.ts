const packageJson = require('../../package.json');

type Config = {
  version: string;
};

const config: Config = {
  version: packageJson.version,
};

export default config;
