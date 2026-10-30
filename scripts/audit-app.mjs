import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const failed=[];page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
await page.goto('http://127.0.0.1:5188/app');
try{await page.locator('.leaflet-tile-loaded').first().waitFor({timeout:15000});}catch{/* Offline fallback remains usable. */}
await page.screenshot({path:'artifacts/app-map-settled.png',fullPage:true});
const report={tiles:await page.locator('.leaflet-tile-loaded').count(),notice:await page.locator('.map-warning').allTextContents(),campusMarkers:await page.locator('.campus-map-marker').count(),failed};
await writeFile('artifacts/app-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
await browser.close();
