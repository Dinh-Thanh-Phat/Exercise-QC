// save-auth.ts
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false }); // headed để login thủ công
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.linkedin.com/login');
  
  // Đợi bạn login thủ công xong
  console.log('Hãy login thủ công, sau đó nhấn Enter...');
  await page.waitForTimeout(30000); // chờ 30 giây để login

  // Lưu session
  await context.storageState({ path: 'auth.json' });
  await browser.close();
  console.log('Đã lưu session vào auth.json');
})();