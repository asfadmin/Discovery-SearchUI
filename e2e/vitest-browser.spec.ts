import { expect, test } from 'vitest';
import { page } from 'vitest/browser';

test('hero section looks correct', async () => {
  // ...the rest of the test

  // capture and compare screenshot
  await expect(page).toMatchScreenshot('hero-section');
});
