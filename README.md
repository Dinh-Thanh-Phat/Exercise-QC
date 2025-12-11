**Cài đặt dự án**

**1. Clone Repository:** git clone https://github.com/Dinh-Thanh-Phat/Exercise-QC.git QC-Auto

cd QC-Auto

**2. Cài đặt các Dependencies:** npm install

**3. Cài đặt Browsers:** npx playwright install

**Cách chạy Test**
**1. Chạy tất cả các test:** npx playwright test
**2. Chạy từng test case riêng:** npx playwright test tests/web.spec.ts
**3. Chế độ Headed (Xem giao diện)**: npx playwright test --headed

**Xem Báo cáo (Report)**
**1.Chạy test với cấu hình report:** npx playwright test
**2. Mở báo cáo:** npx playwright show-report
