const baseConfig = require("../../tailwind.config.base.cjs");

module.exports = {
  ...baseConfig,
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
