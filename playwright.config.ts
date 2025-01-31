import { defineConfig, devices } from "playwright/test";

export default defineConfig({
  projects: [
    /*
     * use new headless
     * @see https://github.com/microsoft/playwright/issues/33566
     */
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chromium",
      },
    },
  ],
});
