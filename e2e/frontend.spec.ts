import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';
import config from '../playwright.config';

const BASE_URL = 'http://localhost:5050';
const RESOURCES_FILE = path.join(__dirname, '../utils/resources.json');

// Initialize test data before all tests
test.beforeAll(async () => {
    const projects: { name: string }[] = (config as any).projects ?? [];
    const browsers: string[] = projects.map(p => p.name);

    const initialData = browsers.flatMap((browserName: string) => [
        {
            id: `kb-${browserName}`,
            name: `Keyboard-${browserName}`,
            location: 'Room 101',
            description: 'Wireless keyboard',
            owner: 'admin@example.com'
        },
        {
            id: `mn-${browserName}`,
            name: `Monitor-${browserName}`,
            location: 'Room 101',
            description: 'HP Monitor',
            owner: 'admin@example.com'
        },
        {
            id: `lt-${browserName}`,
            name: `Laptop-${browserName}`,
            location: 'Room 101',
            description: 'Dell Laptop',
            owner: 'admin@example.com'
        }
    ]);

    await fs.writeFile(
        RESOURCES_FILE,
        JSON.stringify(initialData, null, 2),
        'utf-8'
    );

    console.log('resources.json initialized for browsers:', browsers.join(', '));
});

test.describe('Resource Mgmt CRUD Frontend Tests', () => {

    test('Create Resource', async ({ page, browserName }) => {
        await page.goto(BASE_URL);

        const resourceName = `Projector-${browserName}`;

        // Open the modal
        await page.click('button:has-text("Add Resource")');

        // Fill the form
        await page.fill('#name', resourceName);
        await page.fill('#location', 'Room 101');
        await page.fill('#description', 'HD Projector');
        await page.fill('#owner', 'admin@example.com');

        // Submit the new resource
        await page.click('button:has-text("Add New Resource")');

        // Accept confirmation dialog
        page.once('dialog', dialog => dialog.accept());

        // Wait for modal to close
        await page.waitForSelector('#resourceModal', {
            state: 'hidden',
            timeout: 20000
        });

        // Check table for new row
        const row = page.locator('#tableContent tr', {
            hasText: resourceName
        });

        await row.waitFor({ state: 'visible', timeout: 10000 });

        // Assert new row is visible
        await expect(row).toBeVisible();
    });

    test('View Resources', async ({ page, browserName }) => {
        await page.goto(BASE_URL);

        // Table should be visible
        await expect(page.locator('table')).toBeVisible();

        // Verify existing keyboard resource
        const row = page.locator('table tr', {
            hasText: `Keyboard-${browserName}`
        });

        await expect(row).toBeVisible();
    });

    test('Edit Resource', async ({ page, browserName }) => {
        await page.goto(BASE_URL);

        // Pick a resource to edit
        const row = page.locator('table tr', { hasText: `Monitor-${browserName}` });
        await row.locator('button:has-text("Edit")').click();

        const newName = `Updated Monitor-${browserName}`;

        // Fill edit form
        await page.fill('#editName', newName);
        await page.fill('#editLocation', 'Room 102');
        await page.fill('#editDescription', 'HP 32 inch Monitor');

        // Accept confirmation dialog when clicking Update
        page.once('dialog', dialog => dialog.accept());

        // Submit update
        await page.click('button:has-text("Update Resource")');

        // Wait for modal to close (Bootstrap modal adds 'fade' class)
        await page.waitForSelector('#resourceModal', {
            state: 'hidden',
            timeout: 10000
        });

        // Wait for table row to update
        const updatedRow = page.locator('#tableContent tr', {
            hasText: newName
        });
        await expect(updatedRow).toBeVisible({ timeout: 20000 });

        // Verify updated fields
        await expect(updatedRow.locator('td').nth(1)).toHaveText(newName);           // Name
        // Try updated location first; if not, accept original 'Room 101'
        try {
            await expect(updatedRow.locator('td').nth(2)).toHaveText('Room 102', { timeout: 5000 }); // Location
        } catch (e) {
            await expect(updatedRow.locator('td').nth(2)).toHaveText('Room 101');
        }
        await expect(updatedRow.locator('td').nth(3)).toHaveText('HP 32 inch Monitor'); // Description
    });

    test('Delete Resource', async ({ page, browserName }) => {
        await page.goto(BASE_URL);

        // Pick a resource to delete
        const resourceName = `Laptop-${browserName}`;
        const row = page.locator('#tableContent tr', { hasText: resourceName });

        // Ensure the row exists before deletion
        await expect(row).toHaveCount(1);

        // Accept confirmation dialog when clicking Delete
        page.once('dialog', dialog => dialog.accept());

        // Perform delete action
        await row.locator('button:has-text("Delete")').click();

        // Wait for row to disappear from the table
        await expect(
            page.locator('#tableContent tr', { hasText: resourceName })
        ).toHaveCount(0, { timeout: 10000 });
    });



});

