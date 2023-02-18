import Page from './+page.svelte';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';

describe('/', () => {
	it('shows a heading', () => {
		render(Page);
		expect(screen.getByRole('heading', { name: 'Internal' })).toBeInTheDocument();
	});
});
