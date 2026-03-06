import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://app.incard.biz/convert-linkedin-profile/');

  // Đợi bạn login thủ công
  await page.waitForURL(/home/, { timeout: 60000 });
  
  // Chờ thêm 3 giây để đảm bảo tất cả cookie được set
  await page.waitForTimeout(3000);
  
  // Reload lại trang để verify session
  await page.reload();
  await page.waitForURL(/home/, { timeout: 10000 });
  
  console.log('Login thành công! URL:', page.url());
  await context.storageState({ path: 'auth.json' });
  await browser.close();
  console.log('Đã lưu session vào auth.json');
})();