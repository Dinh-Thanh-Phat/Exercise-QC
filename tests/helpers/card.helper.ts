import { Page, expect } from '@playwright/test';

export async function tryOpenCreateCardPopup(
  page: Page,
  timeout = 5000
): Promise<boolean> {
  const createNowBtn = page.locator('button.btn-tao-danh-thiep-ngay');

  try {
    await createNowBtn.waitFor({ state: 'visible', timeout });
    await createNowBtn.click();
    return true;
  } catch {
    return false;
  }
}

export async function navigateToCreateCard(page: Page) {
  await page.getByRole('link', { name: ' Danh Thiếp Điện Tử' }).click();
  await page.getByRole('link', { name: 'Tạo Danh Thiếp' }).click();
}

export async function createCard(
  page: Page,
  cardData: {
    avatarPath: string;
    firstName: string;
    lastName: string;
    phone: string;
    company: string;
  }
) {
  await page.locator('input[name="logo"]').setInputFiles(cardData.avatarPath);

  await page
    .getByRole('textbox', { name: 'Tên', exact: true })
    .fill(cardData.firstName);

  await page
    .getByRole('textbox', { name: 'Họ & Tên đệm' })
    .fill(cardData.lastName);

  await page
    .getByRole('textbox', { name: 'Số điện thoại' })
    .fill(cardData.phone);

  await page
    .getByRole('textbox', { name: 'Tên công ty muốn hiện trên' })
    .fill(cardData.company);

  await page.getByRole('button', { name: 'Tạo & xem trước' }).click();
  await page.getByRole('button', { name: 'Đóng' }).click();
}

export async function verifyCardExists(page: Page) {
  await page.getByRole('link', { name: 'Danh Thiếp Điện Tử' }).click();

  const cardItem = page.locator(
    `text=Phat`
  ).first();

  await expect(cardItem).toBeVisible({
    timeout: 10_000,
  });
}


