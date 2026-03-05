/**
 * Trigger Playwright E2E via Webhook
 * - Verify secret
 * - Run Playwright in CI mode
 * - Serve health check
 * - Expose HTML report
 */

require('dotenv').config();

const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(express.json());

/**
 * Debug env (chỉ dùng local, CI thì không cần)
 */
console.log('ENV SECRET:', process.env.WEBHOOK_SECRET);

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.send('OK');
});

/**
 * Avoid favicon 404 noise
 */
app.get('/favicon.ico', (req, res) => res.status(204).end());

/**
 * Expose Playwright HTML report
 * http://localhost:3000/report
 */
app.use(
  '/report',
  express.static(path.join(__dirname, 'playwright-report'))
);

const PORT = process.env.PORT || 3000;

/**
 * POST /run-e2e
 * Trigger Playwright E2E test
 */
app.post('/run-e2e', (req, res) => {
  const secret = req.headers['x-secret']; // qc-e2e-2025-secret

  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).send('Unauthorized');
  }

  console.log('🚀 E2E Triggered');

  /**
   * Use spawn instead of exec
   * - Avoid buffer overflow
   * - Stream logs realtime
   * - Cross-platform safe
   */
  const child = spawn(
    'npm',
    ['run', 'test:e2e:ci'],
    {
      shell: true,
      stdio: 'inherit',
      env: {
        ...process.env,
        CI: 'true'
      }
    }
  );

  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`E2E Failed (exit code ${code})`);
    } else {
      console.log('E2E Finished Successfully');
    }
  });

  /**
   * Respond immediately (async execution)
   */
  res.send('E2E Started');
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Trigger server running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Report URL: http://localhost:${PORT}/report`);
});
