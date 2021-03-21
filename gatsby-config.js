/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */

// We register the TypeScript evaluator in gatsby-config so we don't need to do it in any other .js file. It automatically reads TypeScript config from tsconfig.json.
require("ts-node").register();

// Use a TypeScript version of gatsby-config.js.
module.exports = require("./config/gatsby-config.ts");
