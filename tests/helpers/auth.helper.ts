import { Page, expect } from '@playwright/test';

export async function loginDashboard(
  page: Page,
  baseUrl: string,
  email: string,
  password: string
) {
  await page.goto(`${baseUrl}`);
  await page.locator("//button[@class='text-[#527063] hover:text-primary font-medium text-xs sm:text-sm transition-colors']").click();
  await page.locator("//button[@class='w-full bg-[#4ADE80] hover:bg-[#22C55E] text-white font-bold py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all shadow-lg shadow-[#4ADE80]/25 hover:shadow-[#4ADE80]/40 flex items-center justify-center gap-2 sm:gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base']").click();

  // await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.locator("//input[@id='username']").fill(email)
  await page.locator("//input[@id='password']").fill(password)
  await page.locator("//button[@class='btn__primary--large from__button--floating']").click();
  // await page.getByRole('button', { name: /đăng nhập/i }).click();

  await expect(page).toHaveURL(/home/, {
    timeout: 10000,
  });
}

// export async function loginFromShop(
//   page: Page,
//   shopUrl: string,
//   email: string,
//   password: string
// ) {
//   await page.goto(shopUrl);

//   await page.getByRole('link', { name: 'Đăng nhập' }).click();
//   await page.getByRole('textbox', { name: 'Nhập email' }).fill(email);
//   await page.getByRole('textbox', { name: 'Nhập mật khẩu' }).fill(password);
//   await page.getByRole('button', { name: 'Đăng nhập' }).click();
// }
