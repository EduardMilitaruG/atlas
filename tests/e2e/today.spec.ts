import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

// Skips the whole suite if service role key is absent — CI should provide it
const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']
const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? ''
const testEmail = 'eddv.test@atlas.dev'

test.describe('Today check-in', () => {
  test.skip(!serviceKey, 'SUPABASE_SERVICE_ROLE_KEY not set — skipping E2E auth tests')

  test.beforeAll(async () => {
    // Ensure test user exists
    const admin = createClient(supabaseUrl, serviceKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    await admin.auth.admin.createUser({ email: testEmail, email_confirm: true })
  })

  test.beforeEach(async ({ page }) => {
    // Sign in via magic link using admin token
    const admin = createClient(supabaseUrl, serviceKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: testEmail,
    })
    const link = data?.properties?.action_link
    if (!link) throw new Error('Could not generate magic link')

    // Visit the confirmation link so the session is established
    await page.goto(link)
    await page.waitForURL('**/today')
  })

  test('shows empty check-in for a new day', async ({ page }) => {
    await page.goto('/today')
    await expect(page.getByText('Evening check-in')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit evening check-in' })).toBeVisible()
  })

  test('auto-saves when filling fields', async ({ page }) => {
    await page.goto('/today')

    // Fill mood
    await page.locator('button').filter({ hasText: '🙂' }).click()

    // Check auto-save indicator appears
    await expect(page.getByText('Saving…')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Saved')).toBeVisible({ timeout: 10000 })
  })

  test('submits check-in and shows score', async ({ page }) => {
    await page.goto('/today')

    // Hard thing
    await page.locator('input[placeholder*="hard thing"]').fill('Finished the Phase 1 build')
    await page.getByRole('button', { name: 'Done' }).click()

    // Sleep: click + a few times
    const sleepPlus = page
      .locator('section', { hasText: 'Sleep' })
      .locator('button', { hasText: '+' })
      .first()
    await sleepPlus.click()

    // Sleep quality — pick 4th emoji
    await page
      .locator('section', { hasText: 'Sleep' })
      .locator('button')
      .filter({ hasText: '😌' })
      .click()

    // Mood — pick happy
    await page
      .locator('section', { hasText: 'Mood' })
      .locator('button')
      .filter({ hasText: '😄' })
      .click()

    // Supplements: Finasteride
    await page.getByRole('button', { name: 'Finasteride' }).click()

    // Workout: push
    await page.getByRole('button', { name: 'push' }).click()

    // Submit
    await page.getByRole('button', { name: 'Submit evening check-in' }).click()

    // Score appears (not —)
    await expect(page.getByText('Check-in submitted ✓')).toBeVisible({ timeout: 10000 })
    // The score number is now shown (not the dash)
    await expect(page.getByText('daily score')).toBeVisible()
    const scoreEl = page.locator('.tabular-nums').first()
    const scoreText = await scoreEl.textContent()
    expect(Number(scoreText)).toBeGreaterThan(0)
  })
})
