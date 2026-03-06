import { Page, expect } from '@playwright/test';

export async function loginDashboard(
  page: Page,
  baseUrl: string,
  email: string,
  password: string
) {
  await page.goto(baseUrl);

  await page.locator("//button[@class='text-[#527063] hover:text-primary font-medium text-xs sm:text-sm transition-colors']").click()

  // Click "Get Started with LinkedIn"
  const linkedinBtn = page.locator('button:has-text("Get Started with LinkedIn")');
  await linkedinBtn.waitFor({ state: 'visible', timeout: 15000 });
  await linkedinBtn.click();

  // LinkedIn login page
  await page.locator('#username').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  // Verify redirect về home
  await expect(page).toHaveURL(/home/, { timeout: 30000 });
}