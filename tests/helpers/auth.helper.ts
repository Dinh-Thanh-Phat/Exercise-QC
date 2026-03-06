import { Page, expect } from '@playwright/test';

export async function loginDashboard(
  page: Page,
  baseUrl: string,
  email: string,
  password: string
) {
  // Session đã có từ storageState, không cần login lại
  await page.goto(baseUrl);

  await expect(page).toHaveURL(/home/, {
    timeout: 15000,
  });
}