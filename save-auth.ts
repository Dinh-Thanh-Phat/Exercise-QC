import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://app.incard.biz/convert-linkedin-profile/');

  // Bạn tự click login thủ công trên browser vừa mở
  // Đợi cho đến khi URL có chứa /home
  await page.waitForURL(/home/, { timeout: 60000 });
  console.log('Login thành công! Đang lưu session...');

  await context.storageState({ path: 'auth.json' });
  await browser.close();
  console.log('Đã lưu session vào auth.json');
})();