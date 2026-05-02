import { test, expect, type Locator } from '@playwright/test'

async function clickWhenReady(locator: Locator) {
  await expect(locator).toBeVisible()
  await expect(locator).toBeEnabled()
  await locator.click()
}

test('smoke test', async ({ page }) => {
  await page.goto('/')

  // app home
  await expect(page.locator('h1')).toHaveText('Millennia: Tracks of Time Solo Helper')
  await page.getByRole('link', { name: 'Play Game' }).click()

  // setup game
  await page.getByText('Player', { exact: true }).click()
  await page.getByRole('button', { name: 'Setup Automa' }).click()
  await page.getByRole('button', { name: 'Start Game' }).click()

  // play 1 round
  const nextButton = page.getByRole('button', { name: 'Next' })
  const passButton = page.getByRole('button', { name: 'Pass' })
  await clickWhenReady(nextButton)
  await clickWhenReady(nextButton)
  await clickWhenReady(nextButton)
  await clickWhenReady(nextButton)
  await clickWhenReady(nextButton)
  await clickWhenReady(nextButton)
  await clickWhenReady(nextButton)
  await clickWhenReady(nextButton)
  await clickWhenReady(passButton)
  await clickWhenReady(nextButton)
  await clickWhenReady(nextButton)
  await clickWhenReady(nextButton)

  // abort game
  await page.getByRole('button', { name: 'Abort Game' }).click()
  await page.locator('#endGameModal').getByRole('button', { name: 'Abort Game' }).click()

  // app home
  await expect(page.locator('h1')).toHaveText('Millennia: Tracks of Time Solo Helper')
})
