import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

interface ExcelRow {
  specFile: string;
  testName: string;
  browser: string;
  status: string;
  durationMs: number;
  retry: number;
  error: string;
}

export default class ExcelReporter implements Reporter {
  // khai báo property
  private results: ExcelRow[] = [];

  onTestEnd(test: TestCase, result: TestResult): void {
    this.results.push({
      specFile: test.location.file,
      testName: test.titlePath().join(' > '),
      browser: test.parent?.project()?.name ?? 'unknown',
      status: result.status,
      durationMs: result.duration,
      retry: result.retry,
      error: result.error?.message ?? '',
    });
  }

  onEnd(): void {
    if (this.results.length === 0) {
      return;
    }

    const now = new Date();
    const dateFolder = now.toISOString().split('T')[0];
    const timeStamp = now.toTimeString().slice(0, 8).replace(/:/g, '-');

    const outputDir = path.resolve(
      process.cwd(),
      'reporters',
      'excel',
      dateFolder
    );

    fs.mkdirSync(outputDir, { recursive: true });

    const filePath = path.join(
      outputDir,
      `playwright-results-${timeStamp}.xlsx`
    );

    const worksheet = XLSX.utils.json_to_sheet(this.results);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, filePath);
  }
}
