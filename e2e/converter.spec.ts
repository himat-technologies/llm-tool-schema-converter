import { test, expect } from '@playwright/test';
test('loads the converter and converts the default sample', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /One schema/i })).toBeVisible();
  await expect(page.getByText('Conversion complete')).toBeVisible();
  await page.getByRole('button', { name: /MCP/i }).click();
  await expect(page.getByText('Conversion complete')).toBeVisible();
});
test('preset buttons load examples', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /SQL Query/i }).click();
  await expect(page.getByText(/run_readonly_query/)).toBeVisible();
});
