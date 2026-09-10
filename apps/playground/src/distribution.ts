// Switch to the registry name once the first npm publication is verified.
export const packageVersion = '1.0.1';
export const packageArchive = `https://github.com/calebduren/curly/releases/download/v${packageVersion}/cowboy-curly-${packageVersion}.tgz`;
export const installCommand = `npm install ${packageArchive}`;
export const distributionLabel = 'Install the GitHub release with npm.';
