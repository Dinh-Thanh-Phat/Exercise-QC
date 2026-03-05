import { test, expect, Page } from '@playwright/test';

const BASE_URL = {
  main: 'https://incard.biz',
  shop: 'https://incard.biz',
};

const USER = {
  email: 'thanhphat12tna234@gmail.com',
  password: 'Password123@',
};

const CARD_DATA = {
  avatarPath: 'C:/Users/admin/Pictures/avatar.jpg',
  firstName: 'Phat',
  lastName: 'Dinh Thanh',
  phone: '0123456789',
  company: 'Inapps Technology',
};

test('Login successfully', async ({ page }) => {
  await loginToDashboard(page);
  await verifyDashboard(page);
});

test('Create card successfully', async ({ page }) => {
  await loginFromShop(page);

  const hasPopup = await handleCreateCardPopup(page);

  if (!hasPopup) {
    await navigateToCreateCard(page);
  }

  await createCard(page);
});

/* ===================== HELPERS ===================== */

async function loginToDashboard(page: Page) {
  await page.goto(`${BASE_URL.main}/login`);
  await page.getByRole('textbox', { name: /email/i }).fill(USER.email);
  await page.getByRole('textbox', { name: /mật khẩu/i }).fill(USER.password);
  await page.getByRole('button', { name: /đăng nhập/i }).click();
  await expect(page).toHaveURL(/dashboard|dasboard#/, { timeout: 10000 });
}

async function verifyDashboard(page: Page) {
  const dashboardHeader = page.getByRole('heading', { name: 'Thống kê' });
  await expect(dashboardHeader).toBeVisible();
}

async function loginFromShop(page: Page) {
  await page.goto(BASE_URL.shop);
  await page.getByRole('link', { name: 'Đăng nhập' }).click();
  await page.getByRole('textbox', { name: 'Nhập email' }).fill(USER.email);
  await page.getByRole('textbox', { name: 'Nhập mật khẩu' }).fill(USER.password);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
}

async function handleCreateCardPopup(page: Page): Promise<boolean> {
  const createNowButton = page.locator('button.btn-tao-danh-thiep-ngay');

  try {
    await createNowButton.waitFor({ state: 'visible', timeout: 5000 });
    await createNowButton.click();
    return true;
  } catch {
    return false;
  }
}

async function navigateToCreateCard(page: Page) {
  await page.getByRole('link', { name: ' Danh Thiếp Điện Tử' }).click();
  await page.getByRole('link', { name: 'Tạo Danh Thiếp' }).click();
}

async function createCard(page: Page) {
  await page
    .locator('input[name="logo"]')
    .setInputFiles(CARD_DATA.avatarPath);

  await page
    .getByRole('textbox', { name: 'Tên', exact: true })
    .fill(CARD_DATA.firstName);

  await page
    .getByRole('textbox', { name: 'Họ & Tên đệm' })
    .fill(CARD_DATA.lastName);

  await page
    .getByRole('textbox', { name: 'Số điện thoại' })
    .fill(CARD_DATA.phone);

  await page
    .getByRole('textbox', { name: 'Tên công ty muốn hiện trên' })
    .fill(CARD_DATA.company);

  await page.getByRole('button', { name: 'Tạo & xem trước' }).click();
  await page.getByRole('button', { name: 'Đóng' }).click();
}
