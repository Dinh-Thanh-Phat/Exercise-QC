import { test, expect, devices, Page } from '@playwright/test';

const BASE_URL = 'https://incard.biz';

const USER = {
  email: 'thanhphat12tna234@gmail.com',
  password: 'Password123@',
};

const CARD_DATA = {
  firstName: 'Phat',
  lastName: 'Dinh Thanh',
  phone: '0123456789',
  company: 'Inapps Technology',
  avatarPath: 'C:/Users/admin/Pictures/avatar.jpg',
};

test.use({
  ...devices['iPhone 12'],
});

test('Đăng nhập thành công và xác minh Dashboard', async ({ page }) => {
  await test.step('Login to system', async () => {
    await login(page);
  });

  await test.step('Verify dashboard', async () => {
    await verifyDashboard(page);
  });
});

test('Create card successfully', async ({ page }) => {
  await test.step('Login to system', async () => {
    await login(page);
  });

  let popupHandled = false;

  await test.step('Handle optional create card popup', async () => {
    popupHandled = await handleCreateCardPopup(page);
  });

  if (!popupHandled) {
    await test.step('Navigate to create card page', async () => {
      await navigateToCreateCard(page);
    });
  }

  await test.step('Fill form and create card', async () => {
    await createCard(page);
  });
});

/* ===================== HELPERS ===================== */

async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`);

  await page.getByPlaceholder('Nhập email').fill(USER.email);
  await page.getByPlaceholder('Nhập mật khẩu').fill(USER.password);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page).toHaveURL(/dashboard/i, { timeout: 15000 });
}

async function verifyDashboard(page: Page) {
  const dashboardHeader = page.getByRole('heading', { name: 'Thống kê' });
  await expect(dashboardHeader).toBeVisible();
}

async function handleCreateCardPopup(page: Page): Promise<boolean> {
  const createNowButton = page.locator('button.btn-tao-danh-thiep-ngay');

  try {
    await createNowButton.waitFor({ state: 'visible', timeout: 3000 });
    await createNowButton.click();
    return true;
  } catch {
    return false;
  }
}

async function navigateToCreateCard(page: Page) {
  await page.locator('.hamburger.hamburger--arrowturn').click();
  await page.getByRole('link', { name: 'Danh Thiếp Điện Tử' }).click();
  await page.getByRole('link', { name: 'Tạo Danh Thiếp' }).click();
}

async function createCard(page: Page) {
  await page.locator('input[name="logo"]').setInputFiles(CARD_DATA.avatarPath);

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