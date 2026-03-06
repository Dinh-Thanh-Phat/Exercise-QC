import { Page, expect } from '@playwright/test';

export async function loginDashboard(
  page: Page,
  baseUrl: string,
  email: string,
  password: string
) {
  await page.goto(baseUrl);

  // Click "Get Started with LinkedIn"
  await page.getByRole('button', { name: /linkedin/i }).click();

  // LinkedIn login page
  await page.locator('#username').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  // Verify redirect về home
  await expect(page).toHaveURL(/home/, { timeout: 30000 });
}