import { chromium } from 'playwright';

async function check() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Check for key UI elements
  const title = await page.title();
  const hasBrand = await page.locator('text=REPØSURGE').count();
  const hasCTA = await page.locator('text=View Rankings').count();
  const hasNav = await page.locator('nav').count();
  const hasTrust = await page.locator('text=Used by developers').count();
  const hasRepos = await page.locator('#repos').count();
  
  console.log('Title:', title);
  console.log('Brand count:', hasBrand);
  console.log('CTA count:', hasCTA);
  console.log('Nav count:', hasNav);
  console.log('Trust section count:', hasTrust);
  console.log('Repos section count:', hasRepos);
  
  await browser.close();
}

check().catch(console.error);
