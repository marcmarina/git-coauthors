const packageJson = require('../../package.json');

type Config = {
  version: string;
};

export const config: Config = {
  version: packageJson.version,
};
