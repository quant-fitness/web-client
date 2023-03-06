import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByRole('heading', { name: 'Register for an account' })).toBeVisible();
});

test('links to the sign in page', async ({ page }) => {
	await page.goto('/register');
	await expect(page.getByRole('heading', { name: 'Register for an account' })).toBeVisible();
	await page.getByRole('link', { name: 'sign in to your account' }).click();
	await expect(page.getByRole('heading', { name: 'Register for an account' })).not.toBeVisible();
	await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
});
