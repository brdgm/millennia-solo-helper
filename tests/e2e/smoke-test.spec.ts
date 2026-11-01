import { test, expect, type Locator, type Page } from '@playwright/test'

async function clickWhenReady(locator: Locator) {
  await expect(locator).toBeVisible()
  await expect(locator).toBeEnabled()
  await locator.click()
}

// clicks the button and waits for the route change, so the next click cannot hit the previous view
async function clickAndWaitForNavigation(page: Page, locator: Locator) {
  const url = page.url()
  await clickWhenReady(locator)
  await expect(page).not.toHaveURL(url)
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
  // drafting, prosperity, income
  for (let i = 0; i < 7; i++) {
    await clickAndWaitForNavigation(page, nextButton)
  }
  // construction: bot turn -> player turn (no route change)
  await clickWhenReady(nextButton)
  await clickAndWaitForNavigation(page, passButton)
  // actions, war, upkeep
  for (let i = 0; i < 3; i++) {
    await clickAndWaitForNavigation(page, nextButton)
  }

  // abort game
  await page.getByRole('button', { name: 'Abort Game' }).click()
  await page.locator('#endGameModal').getByRole('button', { name: 'Abort Game' }).click()

  // app home
  await expect(page.locator('h1')).toHaveText('Millennia: Tracks of Time Solo Helper')
})
