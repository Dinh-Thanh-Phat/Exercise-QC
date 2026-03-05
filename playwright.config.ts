import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  testMatch: '**/*.spec.ts',

  fullyParallel: false,

  retries: process.env.CI ? 2 : 0,

  workers: 1,

  timeout: 60 * 1000,

  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/report.json' }],
    ['./reporters/excel-reporter.ts'],
  ],

  use: {
    baseURL: 'https://app.incard.biz/convert-linkedin-profile/',

    headless: true,

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});