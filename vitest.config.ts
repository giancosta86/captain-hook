import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    watch: false,

    coverage: {
      include: ["src/**/*"],
      exclude: ["**/index.ts?(x)", "**/*.test.ts?(x)", "**/*.test.box.tsx"]
    }
  }
});
