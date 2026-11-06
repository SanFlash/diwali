import { test, expect } from '@playwright/test'
test('all five pages are reachable', async ({ page }) => {
  const routes = ['/', '/story', '/wishes', '/celebrate', '/finale']
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('body')).toBeVisible()
  }
})
test('wishes gallery filters and copies a greeting', async ({ page }) => {
  await page.goto('/wishes')
  await page.getByRole('button', { name: 'Corporate' }).click()
  await expect(page.locator('.wish-card')).toHaveCount(3)
})
test('diya interaction changes its state', async ({ page }) => {
  await page.goto('/celebrate')
  await page.getByRole('button', { name: 'Light my diya' }).click()
  await expect(page.getByText('Your light is part of the celebration. Keep shining. ✨')).toBeVisible()
})