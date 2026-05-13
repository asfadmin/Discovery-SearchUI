import { defineConfig, devices } from '@playwright/test';
import { defineCoverageReporterConfig } from '@bgotink/playwright-coverage';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env['CI'],
  timeout: 45_000,
  /* Retry on CI only */
  retries: process.env['CI'] ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // workers: process.env['CI'] ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env['CI']
    ? 'blob'
    : !process.env['COVERAGE']
      ? 'html'
      : [
          ['list'],
          [
            '@bgotink/playwright-coverage',
            defineCoverageReporterConfig({
              /* Path to the root files should be resolved from, most likely your repository root */
              sourceRoot: __dirname,
              /* Files to ignore in coverage, useful
           - if you're testing the demo app of a component library and want to exclude the demo sources
           - or part of the code is generated
           - or if you're running into any of the other many reasons people have for excluding files */
              // exclude: ['path/to/ignored/code/**'],
              /* Directory in which to write coverage reports */
              resultDir: 'results/e2e-coverage',
              /* Configure the reports to generate.
           The value is an array of istanbul reports, with optional configuration attached. */
              reports: [
                /* Create an HTML view at <resultDir>/index.html */
                ['html'],
                /* Create <resultDir>/coverage.lcov for consumption by tooling */
                [
                  'lcovonly',
                  {
                    file: 'coverage.lcov',
                  },
                ],
                /* Log a coverage summary at the end of the test run */
                [
                  'text-summary',
                  {
                    file: null,
                  },
                ],
              ],
              /* Configure watermarks, see https://github.com/istanbuljs/nyc#high-and-low-watermarks */
              // watermarks: {},
            }),
          ],
        ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env['PLAYWRIGHT_TEST_BASE_URL'] ?? 'http://localhost:4200',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env['CI'] ? 'on-first-retry' : 'on',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.2,
    },
    timeout: 30_000,
  },
  // globalSetup: './e2e/auth.setup',
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        timezoneId: 'America/New_York',
        bypassCSP: true,
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
        timezoneId: 'America/New_York',
        bypassCSP: true,
      },
    },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
