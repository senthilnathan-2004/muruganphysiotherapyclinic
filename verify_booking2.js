const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', (err) => console.log('PAGEERROR:', err.message));

  await page.goto('http://localhost:3000/#booking', { waitUntil: 'networkidle' });
  await page.waitForSelector('#booking');
  await page.locator('#booking').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await page.fill('#booking input[placeholder="Name"]', 'Test User');
  await page.fill('#booking input[placeholder="+91 98765 43210"]', '9876543210');
  await page.fill('#booking input[placeholder="email@example.com"]', 'test@example.com');
  console.log('step: contact info filled');

  await page.getByRole('button', { name: '-- Choose Specialist --' }).click();
  await page.waitForTimeout(400);
  await page.locator('#booking div.absolute.z-50 button').first().click();
  await page.waitForTimeout(300);
  const doctorVal = await page.locator('#booking').getByText(/Choose Specialist/).count();
  console.log('step: doctor selected, placeholder still showing?', doctorVal > 0);

  await page.getByRole('button', { name: 'Select a date' }).click();
  await page.waitForTimeout(400);
  await page.locator('#booking div.absolute.z-50 button:not([disabled])').first().click();
  await page.waitForTimeout(300);
  const dateStillPlaceholder = await page.locator('#booking').getByText('Select a date').count();
  console.log('step: date selected, placeholder still showing?', dateStillPlaceholder > 0);

  await page.getByRole('button', { name: '-- Select Visit Reason --' }).click();
  await page.waitForTimeout(400);
  await page.locator('#booking div.absolute.z-50 button').first().click();
  await page.waitForTimeout(500);
  const reasonStillPlaceholder = await page.locator('#booking').getByText('-- Select Visit Reason --').count();
  console.log('step: reason selected, placeholder still showing?', reasonStillPlaceholder > 0);

  await page.waitForTimeout(1200);
  const slotBtn = page.locator('#booking button').filter({ hasText: /AM|PM/ }).first();
  const slotCount = await slotBtn.count();
  console.log('step: slot buttons available:', slotCount);
  if (slotCount > 0) {
    await slotBtn.click();
    await page.waitForTimeout(400);
  }

  await page.screenshot({ path: `/private/tmp/claude-501/-Users-senthilnathanr-Downloads-CD-sugamclinicfinal-main/a12e4786-9d54-4911-8247-b024f89065d3/scratchpad/mobile-all-core-filled.png`, fullPage: true });

  const info = await page.evaluate(() => {
    const allLabels = Array.from(document.querySelectorAll('label'));
    const target = allLabels.find(l => l.textContent && l.textContent.toLowerCase().includes('symptoms (optional)'));
    if (!target) return { error: 'symptoms label not found' };
    const wrapper = target.closest('div').parentElement;
    const cs = getComputedStyle(wrapper);
    const rect = wrapper.getBoundingClientRect();
    return {
      maxHeight: cs.maxHeight,
      opacity: cs.opacity,
      pointerEvents: cs.pointerEvents,
      rectHeight: rect.height,
    };
  });
  console.log('=== FINAL STATE (all core fields filled, mobile) ===');
  console.log(JSON.stringify(info, null, 2));

  await page.close();
  await browser.close();
})();
