import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://app.incard.biz/convert-linkedin-profile/');
  await page.waitForTimeout(3000);
  
  // In ra HTML của tất cả buttons
  const buttons = await page.locator('button, a').all();
  for (const btn of buttons) {
    console.log(await btn.evaluate(el => el.outerHTML));
  }
  
  await browser.close();
})();