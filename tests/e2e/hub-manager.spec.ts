import { test, expect } from '@playwright/test';

test.describe('Hub Management Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for React to load
    await page.waitForLoadState('networkidle');
    // Click Hub button
    await page.click('.selection__item--hub');
    await page.waitForTimeout(1000);
  });

  test('Able to add DFSP in DFSP Administration sub menu', async ({ page }) => {
    // Navigate to Add DFSP feature
    await page.click('text=DFSPs');
    await page.waitForTimeout(1000);

    await page.click('text=Add DFSP');
    await page.waitForTimeout(1000);

    // Generate random data
    const randomDfspName = `Test DFSP ${Date.now()}`;
    const randomDfspEmail = `test${Date.now()}@example.com`;

    // Fill in the form
    await page.fill('.dfsp-modal__dfsp-name input', randomDfspName);
    await page.fill('.dfsp-modal__dfsp-email input', randomDfspEmail);

    // Select monetary zone - click the container div instead of the input
    await page.click('.dfsp-modal__dfsp-monetary-zone .input-select__content');
    await page.waitForTimeout(1000);
    // Click the specific option in the dropdown
    await page.click('.input-select__options-item__label:has-text("Euro")');
    await page.waitForTimeout(500);

    // Submit the form
    await page.click('#dfsp-modal button:has-text("Submit")');

    // Wait for DFSP to appear in the list
    await expect(page.locator(`.hub__dfsps__id:has-text("${randomDfspName}")`))
      .toBeVisible({ timeout: 10000 });
  });
});
