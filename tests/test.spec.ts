import { test, expect } from "@chromatic-com/playwright";

// Then use as normal 👇
test('Login successfully', async ({ page }) => {
  await page.goto('https://incard.biz/login');
  
  await page.locator("//input[@type='email']").fill("thanhphat12tna234@gmail.com")
  await page.locator("//input[@type='password']").fill("Password123@")
  await page.locator("//button[@type='submit']").click()
});