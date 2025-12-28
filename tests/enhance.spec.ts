import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://incard.biz';
const USER = {
  email: 'thanhphat12tna234@gmail.com',
  password: 'Password123@',
};

test('Delete card successfully', async ({ page }) => {
  await login(page);
  await navigateToDashboard(page);
  await deleteCards(page, 1);
});

test('Logout successfully with popup handling', async ({ page }) => {
  await login(page);
  await navigateToDashboard(page);
  await logoutWithPopupHandling(page);
});

/* ===================== HELPERS ===================== */

async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`);

  await page.getByRole('textbox', { name: 'Nhập email' }).fill(USER.email);
  await page.getByRole('textbox', { name: 'Nhập mật khẩu' }).fill(USER.password);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL(/dashboard|dasboard#/);
}

async function navigateToDashboard(page: Page) {
  // await page.getByRole('link', { name: ' Danh Thiếp Điện Tử' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
}

async function deleteCards(page: Page, numberOfCards: number) {
  const deleteButton = page.locator('.bs-pass-para').first();
  const confirmButton = page.getByRole('button', { name: 'Yes' });

  await page.getByRole('link', {name: 'Danh Thiếp Điện Tử'}).click();

  for(let i = 0; i < numberOfCards; i++) {
    await deleteButton.click();
    await confirmButton.click()
  }
}

async function logoutWithPopupHandling(page: Page) {
  const createCardPopupBtn = page.locator(
    'button.btn-tao-danh-thiep-ngay'
  );

  // Try to detect popup within a short timeout
  try {
    await createCardPopupBtn.waitFor({ state: 'visible', timeout: 3000 });
    await page.keyboard.press('Escape');
  } catch {
    // Popup does not appear, continue logout flow
  }

  // Open user dropdown
  await page.getByText('Xin chào, Dinh Thanh Phat').click();

  // Click logout
  await page.getByRole('link', { name: 'Đăng xuất' }).click();

  // Verify user is redirected after logout
  await expect(page).toHaveURL('https://www.incard.biz/vi/', { timeout: 10000 });
}


