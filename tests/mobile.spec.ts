import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 12'],   // sử dụng cấu hình mobile
});

test('Đăng nhập thành công và xác minh Dashboard', async ({ page }) => {

    await test.step('1. Điều hướng và Nhập thông tin đăng nhập', async () => {
        await page.goto('https://incard.biz/login'); 
        
        // Sử dụng các Locator ổn định (getByPlaceholder/getByRole)
        await page.getByPlaceholder('Nhập email').fill("thanhphat12tna234@gmail.com");
        await page.getByPlaceholder('Nhập mật khẩu').fill("Password123@");
    });

    await test.step('2. Thực hiện Đăng nhập và Xác minh chuyển hướng', async () => {
        await page.getByRole('button', { name: 'Đăng nhập' }).click();

        // Assertion: Kiểm tra URL Dashboard sau đăng nhập
        await expect(page).toHaveURL(/.*\/dashboard/i, { timeout: 15000 }); 
    });

    await test.step('3. Xác minh phần tử UI trên Dashboard', async () => {
        // Assertion: Kiểm tra tiêu đề chính (ví dụ: Thống kê)
        const dashboardHeader = page.getByRole('heading', { name: 'Thống kê' });
        
        await expect(dashboardHeader).toBeVisible(); 
    });
});

test('Kiểm tra tạo danh thiếp thành công (Create card successfully)', async ({ page }) => {

    await test.step('1. Đăng nhập hệ thống và Xác minh', async () => {
        await page.goto('https://incard.biz/login'); 
        
        // Tối ưu hóa: Loại bỏ click() và press('Tab') thừa trước fill()
        await page.getByRole('textbox', { name: 'Nhập email' }).fill('thanhphat12tna234@gmail.com');
        await page.getByRole('textbox', { name: 'Nhập mật khẩu' }).fill('Password123@');
        await page.getByRole('button', { name: 'Đăng nhập' }).click();

        // Assertion 1: Xác minh đã chuyển hướng thành công sau login
        await expect(page).toHaveURL(/.*\/dashboard/i, { timeout: 15000 }); 
    });


    await test.step('2. Điều hướng đến trang Tạo Danh Thiếp và Điền Form', async () => {
        
        // Click vào menu và link Tạo Danh Thiếp
        await page.locator("//a[@class = 'dash-head-link']").click();
        await page.getByRole('link', { name: 'Danh Thiếp Điện Tử' }).click(); 
        await page.getByRole('link', { name: 'Tạo Danh Thiếp' }).click();
        
        await page.locator('input[name="logo"]').setInputFiles('C:/Users/admin/Pictures/avatar.jpg');
        await page.getByRole('textbox', { name: 'Tên', exact: true }).fill('Phat');
        await page.getByRole('textbox', { name: 'Họ & Tên đệm' }).fill('Dinh Thanh');
        await page.getByRole('textbox', { name: 'Số điện thoại' }).fill('0123456789');
        await page.getByRole('textbox', { name: 'Tên công ty muốn hiện trên' }).fill('Inapps Technology');
    });

    await test.step('3. Tạo, Xác minh và Đóng Danh Thiếp', async () => {
        await page.getByRole('button', { name: 'Tạo & xem trước' }).click();
        
        // Assertion 3: Kiểm tra dữ liệu hiển thị đúng trên Preview
        // await expect(page.getByRole('heading', { name: 'Dinh Thanh Phat' })).toBeVisible();

        // await expect(page.getByRole('heading', { name: 'Inapps Technology' })).toBeVisible();
        
        // Đóng hộp thoại xem trước
        await page.getByRole('button', { name: 'Đóng' }).click(); 
    });

});