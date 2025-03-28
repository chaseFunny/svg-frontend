/* eslint-disable @typescript-eslint/no-require-imports */
const { generateService } = require("@umijs/openapi");
require("dotenv").config({ path: [".env", ".env.local", ".env.development", ".env.production"] });

generateService({
  requestLibPath: "import { request } from '@/lib/request'",
  schemaPath: process.env.API_BASE_URL_DEV + "/docs-json",
  serversPath: "./src/services",
  projectName: "svg",
});
