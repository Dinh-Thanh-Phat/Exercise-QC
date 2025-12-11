import { test, expect } from '@playwright/test';

test('Login Successfully', async ({ page }) => {
  await page.goto('https://incard.biz/login');
  
  await page.locator("//input[@type='email']").fill("thanhphat12tna234@gmail.com")
  await page.locator("//input[@type='password']").fill("Password123@")
  await page.locator("//button[@type='submit']").click()

  await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 }); 

  const dashboardHeader = page.getByRole('heading', { name: 'Thống kê' });
  await expect(dashboardHeader).toBeVisible();

});

test('Create card successfully', async ({ page }) => {
  await page.goto('https://shop.incard.biz/');
  await page.getByRole('link', { name: 'Đăng nhập' }).click();
  await page.getByRole('textbox', { name: 'Nhập email' }).click();
  await page.getByRole('textbox', { name: 'Nhập email' }).fill('thanhphat12tna234@gmail.com');
  await page.getByRole('textbox', { name: 'Nhập email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Nhập mật khẩu' }).fill('Password123@');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await page.getByRole('link', { name: ' Danh Thiếp Điện Tử' }).click();
  await page.getByRole('link', { name: 'Tạo Danh Thiếp' }).click();
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
  await page.getByRole('button', { name: 'Đóng' }).click()

  // await expect(page).toHaveURL(/.*\/dashboard/); 
  
});

test.describe('Kiểm tra Chức năng Đăng nhập (Login)', () => {

    test('Đăng nhập thành công và xác minh Dashboard', async ({ page }) => {

        await test.step('1. Nhập thông tin đăng nhập', async () => {
            await page.goto('https://incard.biz/login'); 
            
            // Sử dụng các Locator ổn định (getByPlaceholder/getByRole)
            await page.getByPlaceholder('Nhập email').or(page.getByRole('textbox', { name: 'Email' })).fill("thanhphat12tna234@gmail.com");
            await page.getByPlaceholder('Nhập mật khẩu').or(page.getByRole('textbox', { name: 'Mật khẩu' })).fill("Password123@");
        });

        await test.step('2. Click và Xác minh chuyển hướng', async () => {
            await page.getByRole('button', { name: 'Đăng nhập' }).click();

            // Assertion 1: Kiểm tra URL
            await expect(page).toHaveURL(/.*\/dashboard/i, { timeout: 15000 }); 
        });

        await test.step('3. Xác minh phần tử UI trên Dashboard', async () => {
            // Assertion 2: Kiểm tra tiêu đề (Sử dụng .or() để linh hoạt)
            const dashboardHeader = page.getByRole('heading', { name: 'Thống kê' });
            await expect(dashboardHeader).toBeVisible();; 
        });

    });
});

test('Kiểm tra tạo card thành công (Create card successfully)', async ({ page }) => {

    await test.step('1. Đăng nhập hệ thống', async () => {
        // Tối ưu hóa: Điều hướng trực tiếp đến trang login thay vì đến trang chủ rồi click Đăng nhập
        await page.goto('https://shop.incard.biz/login'); 
        
        // Tối ưu hóa: Loại bỏ các lệnh .click() và .press('Tab') thừa trước .fill()
        await page.getByRole('link', { name: 'Đăng nhập' }).click();
        await page.getByRole('textbox', { name: 'Nhập email' }).fill('thanhphat12tna234@gmail.com');
        await page.getByRole('textbox', { name: 'Nhập mật khẩu' }).fill('Password123@');
        await page.getByRole('button', { name: 'Đăng nhập' }).click();

        // Assertion 1: Xác minh đã chuyển hướng thành công sau login
        await expect(page).toHaveURL(/.*\/dashboard/i, { timeout: 15000 }); 
    });


    await test.step('2. Điều hướng đến trang Tạo Danh Thiếp và Điền Form', async () => {
        // Click vào menu và link Tạo Danh Thiếp
        await page.getByRole('link', { name: 'Danh Thiếp Điện Tử' }).click(); 
        await page.getByRole('link', { name: 'Tạo Danh Thiếp' }).click();
        
        // Tối ưu hóa: Loại bỏ các lệnh click() và press('Tab') thừa
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



