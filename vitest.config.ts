import { defineConfig } from "vitest/config";
import { default as auroraVitest } from "@giancosta86/aurora/config/vitest";

export default defineConfig({
  ...auroraVitest,

  test: {
    ...auroraVitest.test,
    environment: "jsdom"
  }
});
