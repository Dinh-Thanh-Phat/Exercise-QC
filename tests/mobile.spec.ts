import { test, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 12'],   // sử dụng cấu hình mobile
});

test('Login successfully', async ({ page }) => {
  await page.goto('https://incard.biz/login');
  
  await page.locator("//input[@type='email']").fill("thanhphat12tna234@gmail.com")
  await page.locator("//input[@type='password']").fill("Password123@")
  await page.locator("//button[@type='submit']").click()
});

test('Create card successfully', async ({ page }) => {
  await page.goto('https://incard.biz/login');
  await page.getByRole('textbox', { name: 'Nhập email' }).click();
  await page.getByRole('textbox', { name: 'Nhập email' }).fill('thanhphat12tna234@gmail.com');
  await page.getByRole('textbox', { name: 'Nhập email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Nhập mật khẩu' }).fill('Password123@');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await page.locator("//a[@id='mobile-collapse']").click();
  await page.getByRole('link', { name: ' Danh Thiếp Điện Tử' }).click();
  await page.getByRole('link', { name: 'Tạo Danh Thiếp' }).click();
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('textbox', { name: 'Họ & Tên đệm' }).click();
  await page.getByRole('textbox', { name: 'Tên', exact: true }).click();
  await page.getByRole('textbox', { name: 'Tên', exact: true }).fill('Phat');
  await page.getByRole('textbox', { name: 'Tên', exact: true }).press('Tab');
  await page.getByRole('textbox', { name: 'Họ & Tên đệm' }).fill('Dinh Thanh');
  await page.getByRole('textbox', { name: 'Họ & Tên đệm' }).press('Tab');
  await page.getByRole('textbox', { name: 'Số điện thoại' }).fill('0123456789');
  await page.getByRole('textbox', { name: 'Tên công ty muốn hiện trên' }).click();
  await page.getByRole('textbox', { name: 'Tên công ty muốn hiện trên' }).fill('Inapps Technology');
  await page.getByRole('textbox', { name: 'Tên công ty muốn hiện trên' }).press('Tab');
  await page.getByRole('button', { name: 'Tạo & xem trước' }).click();
  await page.getByRole('button', { name: 'Đóng' }).click();
});