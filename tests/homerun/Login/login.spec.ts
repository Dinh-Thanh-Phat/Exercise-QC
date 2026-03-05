import { test, expect, Page } from '@playwright/test';

/**
 * TEST ASSUMPTIONS:
 *
 * Login Flow:
 * - User clicks 'Login' button/link on the page
 * - Login popup/modal appears (no URL change)
 * - Login popup contains: Email/Username input, Password input, Login button
 *
 * After valid credentials:
 * - Login popup closes
 * - OTP verification popup opens (no URL change)
 * - System sends OTP via Email / SMS / Internal service
 *
 * OTP popup contains:
 * - OTP input (single field or 6-digit split fields)
 * - Verify / Confirm button
 * - Resend OTP option
 *
 * After successful OTP verification:
 * - Success message appears in the popup
 * - Popup closes
 * - User sees homepage in logged-in state (no URL change)
 *
 * Test Environment:
 * - Uses hardcoded test OTP (e.g., '123456')
 */

const BASE_URL = 'https://hr-staging.inapps.technology/';

const VALID_USER = {
  email: 'thanhphat12tna234@gmail.com',
  password: 'Password123@',
};

const INVALID_USER = {
  email: 'invalid@example.com',
  password: 'WrongPassword123!',
};

const OTP_CONFIG = {
  validOtp: '123456', // Test environment OTP
  invalidOtp: '000000',
  otpLength: 6,
};


test.describe('Login Flow with OTP Verification (Popup)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test.describe('Login Popup - Trigger & UI Elements', () => {
    test('should open login popup when clicking login button', async ({ page }) => {
      await openLoginPopup(page);

      // Verify login popup is visible
      await expect(
        page.getByRole('heading', { name: /Login|Đăng nhập/i })
      ).toBeVisible();

    });

    test('should display all required login elements in popup', async ({ page }) => {
      await openLoginPopup(page);

      // Verify email/username input is visible
      const emailInput = page.getByRole('textbox', { name: 'Nhập email' });
      await expect(emailInput).toBeVisible();

      // Verify password input is visible
      const passwordInput = page.getByLabel(/password|mật khẩu/i);
      await expect(passwordInput).toBeVisible();
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // Verify login button is visible and enabled
      const loginButton = page.locator('[role="dialog"], .modal, .popup, .login-modal').getByRole('button', { name: /login|đăng nhập|sign in|submit/i });
      await expect(loginButton).toBeVisible();
      await expect(loginButton).toBeEnabled();
    });

    test('should have proper input field attributes', async ({ page }) => {
      await openLoginPopup(page);

      const emailInput = page.getByRole('textbox', { name: /email|username/i });
      const passwordInput = page.getByLabel(/password|mật khẩu/i);

      // Check email field type
      await expect(emailInput).toHaveAttribute('type', /email|text/);

      // Check password field is masked
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should close login popup when clicking close/cancel button', async ({ page }) => {
      await openLoginPopup(page);

      const loginPopup = page.locator('[role="dialog"], .modal, .popup, .login-modal');
      await expect(loginPopup).toBeVisible();

      // Click close button (adjust selector based on actual implementation)
      const closeButton = loginPopup.locator('button[aria-label="Close"], button:has-text("×"), .close-button');
      const hasCloseButton = await closeButton.count() > 0;

      if (hasCloseButton) {
        await closeButton.first().click();
        await expect(loginPopup).toBeHidden({ timeout: 3000 });
      }
    });
  });

  test.describe('Login Popup - Input Validation', () => {
    test('should show error for empty credentials', async ({ page }) => {
      await openLoginPopup(page);

      const loginButton = page.locator('[role="dialog"], .modal, .popup, .login-modal').getByRole('button', { name: /login|đăng nhập|sign in|submit/i });
      await loginButton.click();

      // Verify error message appears in popup
      const errorMessage = page.locator('[role="dialog"], .modal, .popup, .login-modal').locator('[role="alert"], .error-message, .invalid-feedback, .error');
      await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
    });

    test('should show error for invalid email format', async ({ page }) => {
      await openLoginPopup(page);

      await page.getByRole('textbox', { name: /email|username/i }).fill('invalid-email');
      await page.getByLabel(/password|mật khẩu/i).fill(VALID_USER.password);

      const loginButton = page.locator('[role="dialog"], .modal, .popup, .login-modal').getByRole('button', { name: /login|đăng nhập|sign in|submit/i });
      await loginButton.click();

      // Verify validation error
      const errorMessage = page.locator('[role="dialog"], .modal, .popup, .login-modal').locator('[role="alert"], .error-message, .invalid-feedback, .error');
      await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await openLoginPopup(page);

      await fillLoginCredentials(page, INVALID_USER.email, INVALID_USER.password);
      await submitLogin(page);

      // Verify error message for invalid credentials
      const errorMessage = page.locator('[role="dialog"], .modal, .popup, .login-modal').locator('[role="alert"], .error-message, .invalid-feedback, .error');
      await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });

      // Login popup should still be visible
      const loginPopup = page.locator('[role="dialog"], .modal, .popup, .login-modal');
      await expect(loginPopup).toBeVisible();
    });

    test('should remain on same URL during login attempts', async ({ page }) => {
      const currentUrl = page.url();

      await openLoginPopup(page);
      await fillLoginCredentials(page, INVALID_USER.email, INVALID_USER.password);
      await submitLogin(page);

      // URL should not change
      await expect(page).toHaveURL(currentUrl);
    });
  });

  test.describe('OTP Popup - Transition & UI Elements', () => {
    test('should close login popup and open OTP popup after valid credentials', async ({ page }) => {
      await openLoginPopup(page);

      const loginPopup = page.locator('[role="dialog"], .modal, .popup, .login-modal');
      await expect(loginPopup).toBeVisible();

      await fillLoginCredentials(page, VALID_USER.email, VALID_USER.password);
      await submitLogin(page);

      // Login popup should close
      await expect(loginPopup).toBeHidden({ timeout: 5000 });

      // OTP popup should open
      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      await expect(otpPopup).toBeVisible({ timeout: 5000 });
    });

    test('should display OTP input field(s) in popup', async ({ page }) => {
      await openOtpPopup(page);

      // Check for single OTP input field
      const singleOtpInput = page.locator('input[name*="otp" i], input[placeholder*="otp" i], input[type="text"][maxlength="6"]');

      // Check for split digit inputs (6 separate fields)
      const digitInputs = page.locator('input[type="text"][maxlength="1"], input[inputmode="numeric"]');

      const hasSingleInput = await singleOtpInput.count() > 0;
      const hasMultipleInputs = await digitInputs.count() === OTP_CONFIG.otpLength;

      // At least one type should be present
      expect(hasSingleInput || hasMultipleInputs).toBeTruthy();
    });

    test('should display Verify/Confirm button in OTP popup', async ({ page }) => {
      await openOtpPopup(page);

      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      const verifyButton = otpPopup.getByRole('button', { name: /verify|confirm|xác nhận|submit|xác thực/i });
      await expect(verifyButton).toBeVisible();
      await expect(verifyButton).toBeEnabled();
    });

    test('should display Resend OTP option in popup', async ({ page }) => {
      await openOtpPopup(page);

      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      const resendButton = otpPopup.locator('button:has-text("Resend"), button:has-text("Gửi lại"), a:has-text("Resend")');
      await expect(resendButton.first()).toBeVisible();
    });

    test('should close OTP popup when clicking close/cancel button', async ({ page }) => {
      await openOtpPopup(page);

      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      await expect(otpPopup).toBeVisible();

      // Click close button
      const closeButton = otpPopup.locator('button[aria-label="Close"], button:has-text("×"), .close-button');
      const hasCloseButton = await closeButton.count() > 0;

      if (hasCloseButton) {
        await closeButton.first().click();
        await expect(otpPopup).toBeHidden({ timeout: 3000 });
      }
    });
  });

  test.describe('OTP Verification - Valid Scenarios', () => {
    test('should successfully verify valid OTP', async ({ page }) => {
      await openOtpPopup(page);

      // Enter valid OTP
      await enterOtp(page, OTP_CONFIG.validOtp);

      // Submit OTP
      await submitOtp(page);

      // Wait for success message
      const successMessage = page.locator('text=/Thành công|Success/i');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    });

    test('should close OTP popup after successful verification', async ({ page }) => {
      await openOtpPopup(page);

      await enterOtp(page, OTP_CONFIG.validOtp);
      await submitOtp(page);

      // OTP popup should close after success
      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      await expect(otpPopup).toBeHidden({ timeout: 10000 });
    });

    test('should show logged-in state after successful OTP verification', async ({ page }) => {
      await openOtpPopup(page);

      await enterOtp(page, OTP_CONFIG.validOtp);
      await submitOtp(page);

      // Wait for success message
      await page.waitForSelector('text=/Thành công|Success/i', { timeout: 5000 });

      // Wait for popup to close
      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      await expect(otpPopup).toBeHidden({ timeout: 10000 });

      // Verify logged-in state on the page
      await verifyLoggedInState(page);
    });

    test('should accept OTP from single input field', async ({ page }) => {
      await openOtpPopup(page);

      const singleOtpInput = page.locator('input[name*="otp" i], input[placeholder*="otp" i]').first();
      const isSingleInput = await singleOtpInput.isVisible().catch(() => false);

      if (isSingleInput) {
        await singleOtpInput.fill(OTP_CONFIG.validOtp);
        await submitOtp(page);

        const successMessage = page.locator('text=/Thành công|Success/i');
        await expect(successMessage).toBeVisible({ timeout: 5000 });
      }
    });

    test('should accept OTP from split digit fields', async ({ page }) => {
      await openOtpPopup(page);

      const digitInputs = page.locator('input[type="text"][maxlength="1"]');
      const hasMultipleInputs = await digitInputs.count() === OTP_CONFIG.otpLength;

      if (hasMultipleInputs) {
        // Fill each digit input
        const otpDigits = OTP_CONFIG.validOtp.split('');
        for (let i = 0; i < otpDigits.length; i++) {
          await digitInputs.nth(i).fill(otpDigits[i]);
        }

        await submitOtp(page);

        const successMessage = page.locator('text=/Thành công|Success/i');
        await expect(successMessage).toBeVisible({ timeout: 5000 });
      }
    });

    test('should remain on same URL throughout OTP verification', async ({ page }) => {
      const currentUrl = page.url();

      await openOtpPopup(page);
      await enterOtp(page, OTP_CONFIG.validOtp);
      await submitOtp(page);

      // URL should not change
      await expect(page).toHaveURL(currentUrl);
    });
  });

  test.describe('OTP Verification - Invalid Scenarios', () => {
    test('should show error for invalid OTP', async ({ page }) => {
      await openOtpPopup(page);

      await enterOtp(page, OTP_CONFIG.invalidOtp);
      await submitOtp(page);

      // Verify error message appears in OTP popup
      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      const errorMessage = otpPopup.locator('[role="alert"], .error-message, .invalid-feedback, .error');
      await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });

      // OTP popup should remain open
      await expect(otpPopup).toBeVisible();
    });

    test('should show error for empty OTP submission', async ({ page }) => {
      await openOtpPopup(page);

      await submitOtp(page);

      // Verify error message
      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      const errorMessage = otpPopup.locator('[role="alert"], .error-message, .invalid-feedback, .error');
      await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
    });

    test('should show error for incomplete OTP (less than 6 digits)', async ({ page }) => {
      await openOtpPopup(page);

      await enterOtp(page, '1234'); // Only 4 digits
      await submitOtp(page);

      // Verify error or verify button is disabled
      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      const errorMessage = otpPopup.locator('[role="alert"], .error-message, .invalid-feedback, .error');
      const verifyButton = otpPopup.getByRole('button', { name: /verify|confirm|xác nhận|submit|xác thực/i });

      const hasError = await errorMessage.first().isVisible().catch(() => false);
      const isButtonDisabled = await verifyButton.isDisabled().catch(() => false);

      expect(hasError || isButtonDisabled).toBeTruthy();
    });

    test('should not close OTP popup on invalid OTP', async ({ page }) => {
      await openOtpPopup(page);

      await enterOtp(page, OTP_CONFIG.invalidOtp);
      await submitOtp(page);

      // OTP popup should remain visible
      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      await expect(otpPopup).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Resend OTP Functionality', () => {
    test('should resend OTP when clicking Resend button', async ({ page }) => {
      await openOtpPopup(page);

      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      const resendButton = otpPopup.locator('button:has-text("Resend"), button:has-text("Gửi lại"), a:has-text("Resend")').first();
      await resendButton.click();

      // Verify success message or notification
      const successMessage = page.locator('[role="alert"], .success-message, .toast, .notification');
      await expect(successMessage.first()).toBeVisible({ timeout: 5000 });
    });

    test('should have countdown timer after resend', async ({ page }) => {
      await openOtpPopup(page);

      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      const resendButton = otpPopup.locator('button:has-text("Resend"), button:has-text("Gửi lại"), a:has-text("Resend")').first();
      await resendButton.click();

      // Check if button is disabled temporarily
      const isDisabled = await resendButton.isDisabled().catch(() => false);

      // Or check for countdown timer text
      const timerText = otpPopup.locator('text=/\\d+s|\\d+ seconds|\\d+ giây/i');
      const hasTimer = await timerText.isVisible().catch(() => false);

      // At least one should be true (disabled button or timer shown)
      expect(isDisabled || hasTimer).toBeTruthy();
    });

    test('should still accept valid OTP after resend', async ({ page }) => {
      await openOtpPopup(page);

      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      const resendButton = otpPopup.locator('button:has-text("Resend"), button:has-text("Gửi lại"), a:has-text("Resend")').first();
      await resendButton.click();

      // Wait a moment for resend
      await page.waitForTimeout(1000);

      // Enter and verify OTP
      await enterOtp(page, OTP_CONFIG.validOtp);
      await submitOtp(page);

      const successMessage = page.locator('text=/Thành công|Success/i');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('End-to-End Login Flow', () => {
    test('complete login flow: login popup → OTP popup → success → logged in', async ({ page }) => {
      const baseUrl = page.url();

      // Step 1: Open login popup
      await openLoginPopup(page);
      const loginPopup = page.locator('[role="dialog"], .modal, .popup, .login-modal');
      await expect(loginPopup).toBeVisible();

      // Step 2: Enter valid credentials
      await fillLoginCredentials(page, VALID_USER.email, VALID_USER.password);
      await submitLogin(page);

      // Step 3: Verify login popup closes and OTP popup opens
      await expect(loginPopup).toBeHidden({ timeout: 5000 });
      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      await expect(otpPopup).toBeVisible({ timeout: 5000 });

      // Step 4: Enter valid OTP
      await enterOtp(page, OTP_CONFIG.validOtp);
      await submitOtp(page);

      // Step 5: Verify success message appears
      const successMessage = page.locator('text=/Thành công|Success/i');
      await expect(successMessage).toBeVisible({ timeout: 5000 });

      // Step 6: Verify OTP popup closes
      await expect(otpPopup).toBeHidden({ timeout: 10000 });

      // Step 7: Verify user is logged in
      await verifyLoggedInState(page);

      // Step 8: Verify URL hasn't changed
      await expect(page).toHaveURL(baseUrl);
    });

    test('should persist login state after page refresh', async ({ page }) => {
      // Complete login flow
      await completeLoginFlow(page);

      // Refresh the page
      await page.reload();

      // Verify user is still logged in
      await verifyLoggedInState(page);
    });
  });

  test.describe('Security & Edge Cases', () => {
    test('should handle special characters in password', async ({ page }) => {
      await openLoginPopup(page);

      const specialPassword = 'P@ssw0rd!#$%^&*()';
      await fillLoginCredentials(page, VALID_USER.email, specialPassword);
      await submitLogin(page);

      // Should process without errors (may show invalid credentials error)
      const loginPopup = page.locator('[role="dialog"], .modal, .popup, .login-modal');
      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');

      // Either stays in login popup with error or opens OTP popup
      const loginVisible = await loginPopup.isVisible().catch(() => false);
      const otpVisible = await otpPopup.isVisible().catch(() => false);

      expect(loginVisible || otpVisible).toBeTruthy();
    });

    test('should clear input fields when reopening login popup after close', async ({ page }) => {
      await openLoginPopup(page);

      // Fill credentials
      await fillLoginCredentials(page, VALID_USER.email, VALID_USER.password);

      // Close popup
      const loginPopup = page.locator('[role="dialog"], .modal, .popup, .login-modal');
      const closeButton = loginPopup.locator('button[aria-label="Close"], button:has-text("×"), .close-button').first();
      const hasCloseButton = await closeButton.isVisible().catch(() => false);

      if (hasCloseButton) {
        await closeButton.click();
        await expect(loginPopup).toBeHidden();

        // Reopen login popup
        await openLoginPopup(page);

        // Verify fields are cleared (or have default values)
        const emailInput = page.getByRole('textbox', { name: /email|username/i });
        const emailValue = await emailInput.inputValue();

        // Should be empty or not contain the previously entered value
        expect(emailValue === '' || emailValue !== VALID_USER.email).toBeTruthy();
      }
    });

    test('should handle rapid multiple login attempts', async ({ page }) => {
      await openLoginPopup(page);

      // Click login button multiple times rapidly
      const loginButton = page.locator('[role="dialog"], .modal, .popup, .login-modal').getByRole('button', { name: /login|đăng nhập|sign in|submit/i });

      await fillLoginCredentials(page, VALID_USER.email, VALID_USER.password);

      // Multiple rapid clicks
      await loginButton.click();
      await loginButton.click();
      await loginButton.click();

      // Should only open one OTP popup
      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      await expect(otpPopup).toBeVisible({ timeout: 5000 });

      // Should not have multiple popups
      const otpPopupCount = await page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal').count();
      expect(otpPopupCount).toBe(1);
    });

    test('should timeout OTP after expiration period', async ({ page }) => {
      await openOtpPopup(page);

      // Wait for OTP expiration (adjust timeout based on actual expiration time)
      // This is a placeholder - actual implementation depends on system behavior
      // For testing purposes, use a reasonable timeout (e.g., 5 minutes)
      await page.waitForTimeout(5 * 60 * 1000); // 5 minutes

      await enterOtp(page, OTP_CONFIG.validOtp);
      await submitOtp(page);

      // Verify expired OTP error
      const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
      const errorMessage = otpPopup.locator('[role="alert"], .error-message, text=/expired|hết hạn/i');
      await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
    });

    test('should not show login popup when already logged in', async ({ page }) => {
      // Complete login flow
      await completeLoginFlow(page);

      // Try to open login popup again
      const loginTrigger = page.locator('button svg.lucide-log-in').first();
      const isTriggerVisible = await loginTrigger.isVisible().catch(() => false);

      if (isTriggerVisible) {
        await loginTrigger.click();

        // Login popup should not appear (or shows logout option instead)
        const loginPopup = page.locator('[role="dialog"], .modal, .popup, .login-modal');
        const isLoginPopupVisible = await loginPopup.isVisible({ timeout: 2000 }).catch(() => false);

        // Should either not show popup or show a different popup (like user menu)
        expect(isLoginPopupVisible).toBeFalsy();
      }
    });
  });
});

/* ===================== HELPER FUNCTIONS ===================== */

/**
 * Open login popup by clicking the login trigger button
 */
async function openLoginPopup(page: Page) {
  const loginTrigger = page.locator('button svg.lucide-log-in');
  await loginTrigger.click();

  // Wait for popup to appear
  const loginPopup = page.locator('[role="dialog"], .modal, .popup, .login-modal');
  await expect(page.getByRole('heading', { name: /Login|Đăng nhập/i })).toBeVisible();
}

/**
 * Fill login credentials in the popup
 */
async function fillLoginCredentials(page: Page, email: string, password: string) {
  await page.getByRole('textbox', { name: /email|username/i }).fill(email);
  await page.getByLabel(/password|mật khẩu/i).fill(password);
}

/**
 * Submit login form in the popup
 */
async function submitLogin(page: Page) {
  const loginPopup = page.locator('[role="dialog"], .modal, .popup, .login-modal');
  const loginButton = loginPopup.getByRole('button', { name: /login|đăng nhập|sign in|submit/i });
  await loginButton.click();
}

/**
 * Open OTP popup by completing login with valid credentials
 */
async function openOtpPopup(page: Page) {
  await openLoginPopup(page);
  await fillLoginCredentials(page, VALID_USER.email, VALID_USER.password);
  await submitLogin(page);

  // Wait for OTP popup to appear
  const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
  await expect(otpPopup).toBeVisible({ timeout: 5000 });
}

/**
 * Enter OTP (handles both single input and split digits)
 */
async function enterOtp(page: Page, otp: string) {
  // Try single input field first
  const singleOtpInput = page.locator('input[name*="otp" i], input[placeholder*="otp" i], input[type="text"][maxlength="6"]').first();
  const isSingleInput = await singleOtpInput.isVisible().catch(() => false);

  if (isSingleInput) {
    await singleOtpInput.fill(otp);
    return;
  }

  // Try split digit inputs
  const digitInputs = page.locator('input[type="text"][maxlength="1"], input[inputmode="numeric"]');
  const hasMultipleInputs = await digitInputs.count() > 0;

  if (hasMultipleInputs) {
    const otpDigits = otp.split('');
    const inputCount = await digitInputs.count();
    for (let i = 0; i < Math.min(otpDigits.length, inputCount); i++) {
      await digitInputs.nth(i).fill(otpDigits[i]);
    }
  }
}

/**
 * Submit OTP verification in the popup
 */
async function submitOtp(page: Page) {
  const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
  const verifyButton = otpPopup.getByRole('button', { name: /verify|confirm|xác nhận|submit|xác thực/i });
  await verifyButton.click();
}

/**
 * Verify user is in logged-in state
 */
async function verifyLoggedInState(page: Page) {
  // Add specific logged-in state checks based on actual application
  // Examples:
  const userProfile = page.locator('[data-testid="user-profile"], .user-menu, .profile-dropdown, button:has-text("Profile")');
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Đăng xuất"), a:has-text("Logout")');
  const userAvatar = page.locator('.user-avatar, .avatar, [data-testid="user-avatar"]');

  // At least one logged-in indicator should be visible
  const hasUserProfile = await userProfile.first().isVisible({ timeout: 5000 }).catch(() => false);
  const hasLogoutButton = await logoutButton.first().isVisible({ timeout: 5000 }).catch(() => false);
  const hasUserAvatar = await userAvatar.first().isVisible({ timeout: 5000 }).catch(() => false);

  expect(hasUserProfile || hasLogoutButton || hasUserAvatar).toBeTruthy();
}

/**
 * Complete the entire login flow (helper for tests)
 */
async function completeLoginFlow(page: Page) {
  await openLoginPopup(page);
  await fillLoginCredentials(page, VALID_USER.email, VALID_USER.password);
  await submitLogin(page);

  const otpPopup = page.locator('[role="dialog"]:has-text("Xác thực OTP"), .modal:has-text("Xác thực OTP"), .otp-modal');
  await expect(otpPopup).toBeVisible({ timeout: 5000 });

  await enterOtp(page, OTP_CONFIG.validOtp);
  await submitOtp(page);

  const successMessage = page.locator('text=/Thành công|Success/i');
  await expect(successMessage).toBeVisible({ timeout: 5000 });

  await expect(otpPopup).toBeHidden({ timeout: 10000 });
}
