import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:1337/');
  await page.goto('http://127.0.0.1:1337/');
});