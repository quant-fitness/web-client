import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/sign-in');
	await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
});

test('links to the registration page', async ({ page }) => {
	await page.goto('/sign-in');
	await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
	await page.getByRole('link', { name: 'register for an account' }).click();
	await expect(page.getByRole('heading', { name: 'Sign in to your account' })).not.toBeVisible();
	await expect(page.getByRole('heading', { name: 'Register for an account' })).toBeVisible();
});
