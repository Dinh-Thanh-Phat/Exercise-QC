import { test } from '@playwright/test';
import { loginDashboard } from '../helpers/auth.helper';

const BASE_URL = {
  shop: 'https://app.incard.biz/convert-linkedin-profile/'
};

const USER = {
  email: process.env.LINKEDIN_EMAIL || '',
  password: process.env.LINKEDIN_PASSWORD || '',
};

test('Login Successfully', async ({ page }) => {
  await loginDashboard(
    page,
    BASE_URL.shop,
    USER.email,
    USER.password
  );
});