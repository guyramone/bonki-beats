/**
 * HOMIE Beats Phase 2 — Comprehensive Puppeteer Test Suite
 *
 * Tests all Phase 2 features including gap closures 02-08 through 02-10:
 * - App loads and init overlay works
 * - Tab navigation
 * - Sequencer grid (8 rows, cell toggle, clear)
 * - Control strip (BPM, volume, step count toggle)
 * - Preset gallery
 * - Code view (alive: colored borders, pattern chars)
 * - Transport controls (play/stop/hush)
 * - Bonki sprite
 * - Beat tracking (scheduler-based)
 * - Trigger animation classes
 * - Audio visualizer canvas
 * - Layer chips
 */

import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:5555/HOMIES/';
const TIMEOUT = 10000;

let browser, page;
const results = [];

function log(test, pass, detail = '') {
  const icon = pass ? '\u2705' : '\u274C';
  const line = `${icon} ${test}${detail ? ' — ' + detail : ''}`;
  console.log(line);
  results.push({ test, pass, detail });
}

async function setup() {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Suppress console noise but capture errors
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  return errors;
}

async function navigateToApp() {
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: TIMEOUT });
}

// ─── TEST GROUPS ───────────────────────────────────────────

async function testAppLoad() {
  console.log('\n--- App Load & Init ---');

  // Check page loaded
  const title = await page.title();
  log('Page loads', title.includes('HOMIE') || title !== '', `title="${title}"`);

  // Init overlay present
  const initOverlay = await page.$('.init-overlay');
  log('Init overlay visible', !!initOverlay);

  // Init button present
  const initBtn = await page.$('.init-button');
  const btnText = initBtn ? await page.evaluate(el => el.textContent, initBtn) : '';
  log('Init button says "Tap to Start"', btnText.includes('Tap to Start'), btnText);

  // Click to init audio
  if (initBtn) {
    await initBtn.click();
    // Wait for overlay to disappear (audio init)
    await page.waitForFunction(
      () => !document.querySelector('.init-overlay'),
      { timeout: TIMEOUT }
    ).catch(() => {});
  }

  const overlayGone = !(await page.$('.init-overlay'));
  log('Init overlay disappears after click', overlayGone);
}

async function testTabNavigation() {
  console.log('\n--- Tab Navigation ---');

  const tabs = await page.$$('.tab-button');
  const tabCount = tabs.length;
  log('Tab bar has 3 tabs', tabCount === 3, `found ${tabCount}`);

  // Get tab labels
  const labels = await page.evaluate(() =>
    [...document.querySelectorAll('.tab-button')].map(t => t.textContent.trim())
  );
  log('Tabs are SEQUENCE, PADS, AI',
    labels.includes('SEQUENCE') && labels.includes('PADS') && labels.includes('AI'),
    labels.join(', ')
  );

  // Default tab is SEQUENCE
  const activeTab = await page.evaluate(() =>
    document.querySelector('.tab-button.active')?.textContent?.trim()
  );
  log('Default active tab is SEQUENCE', activeTab === 'SEQUENCE', activeTab);

  // Switch to PADS
  const padsTab = tabs.find(async (t) => {
    const text = await page.evaluate(el => el.textContent.trim(), t);
    return text === 'PADS';
  });
  await page.evaluate(() => {
    [...document.querySelectorAll('.tab-button')].find(t => t.textContent.trim() === 'PADS')?.click();
  });
  await new Promise(r => setTimeout(r, 300));

  const padsGrid = await page.$('.pads-grid');
  log('PADS tab shows pad grid', !!padsGrid);

  // Switch to AI
  await page.evaluate(() => {
    [...document.querySelectorAll('.tab-button')].find(t => t.textContent.trim() === 'AI')?.click();
  });
  await new Promise(r => setTimeout(r, 300));

  const aiPlaceholder = await page.$('.ai-placeholder');
  log('AI tab shows placeholder', !!aiPlaceholder);

  // Switch back to SEQUENCE
  await page.evaluate(() => {
    [...document.querySelectorAll('.tab-button')].find(t => t.textContent.trim() === 'SEQUENCE')?.click();
  });
  await new Promise(r => setTimeout(r, 300));
}

async function testControlStrip() {
  console.log('\n--- Control Strip ---');

  const controlStrip = await page.$('.controls-strip');
  log('Control strip exists', !!controlStrip);

  // BPM control
  const bpmValue = await page.evaluate(() => {
    const el = document.querySelector('.control-readout');
    return el?.textContent?.trim() || '';
  });
  log('BPM displays a value', bpmValue.length > 0, bpmValue);

  // Volume control
  const volumeSlider = await page.$('input[type="range"]');
  log('Volume slider exists', !!volumeSlider);

  // Step toggle (8/16)
  const stepToggle = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('.step-toggle-btn, .controls-strip button')];
    return btns.map(b => b.textContent.trim());
  });
  log('Step count toggle exists', stepToggle.length >= 1, stepToggle.join(', '));
}

async function testSequencer() {
  console.log('\n--- Sequencer Grid (8 rows) ---');

  // Ensure we're on SEQUENCE tab
  await page.evaluate(() => {
    [...document.querySelectorAll('.tab-button')].find(t => t.textContent.trim() === 'SEQUENCE')?.click();
  });
  await new Promise(r => setTimeout(r, 300));

  // Count rows
  const rows = await page.$$('.sequencer-grid');
  log('Sequencer has 8 sound rows', rows.length === 8, `found ${rows.length}`);

  // Count cells in first row
  const cellsInRow = await page.evaluate(() =>
    document.querySelectorAll('.sequencer-grid:nth-child(2) .sequencer-cell').length
  );
  log('First row has 8 cells (default)', cellsInRow === 8, `found ${cellsInRow}`);

  // Check row labels
  const labels = await page.evaluate(() =>
    [...document.querySelectorAll('.sequencer-label')].map(l => l.textContent.trim())
  );
  log('Row labels present', labels.length === 8, labels.join(', '));

  // Toggle a cell
  const firstCell = await page.$('.sequencer-cell');
  if (firstCell) {
    await firstCell.click();
    await new Promise(r => setTimeout(r, 200));
    const isActive = await page.evaluate(() =>
      document.querySelector('.sequencer-cell')?.classList.contains('active')
    );
    log('Cell toggles to active on click', isActive);

    // Toggle off
    await firstCell.click();
    await new Promise(r => setTimeout(r, 200));
    const isInactive = await page.evaluate(() =>
      !document.querySelector('.sequencer-cell')?.classList.contains('active')
    );
    log('Cell toggles back to inactive', isInactive);
  }

  // Clear button
  const clearBtn = await page.$('.sequencer-clear-btn');
  log('Clear button exists', !!clearBtn);

  // Downbeat markers (02-08)
  await page.evaluate(() => {
    // Toggle some cells first
    const cells = document.querySelectorAll('.sequencer-cell');
    if (cells[0]) cells[0].click();
  });
  await new Promise(r => setTimeout(r, 200));

  const downbeatCells = await page.evaluate(() =>
    document.querySelectorAll('.sequencer-cell.downbeat').length
  );
  log('Downbeat markers present on cells', downbeatCells > 0, `${downbeatCells} cells marked`);
}

async function testCodeView() {
  console.log('\n--- Code View (Alive — 02-09) ---');

  const codeView = await page.$('.code-view');
  log('Code view panel exists', !!codeView);

  const codeHeader = await page.$('.code-view-header');
  log('Code view has header', !!codeHeader);

  const copyBtn = await page.$('.code-view-copy');
  log('Copy button exists', !!copyBtn);

  // Toggle some cells to generate code
  await page.evaluate(() => {
    const cells = document.querySelectorAll('.sequencer-grid:nth-child(2) .sequencer-cell');
    if (cells[0]) cells[0].click();
    if (cells[2]) cells[2].click();
    if (cells[4]) cells[4].click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Check for code lines
  const codeLines = await page.evaluate(() =>
    document.querySelectorAll('.code-line').length
  );
  log('Code lines appear after toggling cells', codeLines > 0, `${codeLines} lines`);

  // Check for sound lines with colored borders (02-09 feature)
  const soundLines = await page.evaluate(() =>
    document.querySelectorAll('.code-line-sound').length
  );
  log('Sound lines have .code-line-sound class', soundLines > 0, `${soundLines} sound lines`);

  // Check for colored left borders
  const hasBorderColor = await page.evaluate(() => {
    const line = document.querySelector('.code-line-sound');
    if (!line) return false;
    const style = line.style.borderLeftColor;
    return style && style !== '' && style !== 'transparent';
  });
  log('Sound lines have colored left borders', hasBorderColor);

  // Check for pattern characters (02-09 feature)
  const patternHits = await page.evaluate(() =>
    document.querySelectorAll('.pattern-hit').length
  );
  const patternRests = await page.evaluate(() =>
    document.querySelectorAll('.pattern-rest').length
  );
  log('Pattern hit chars (x) present', patternHits > 0, `${patternHits} hits`);
  log('Pattern rest chars (~) present', patternRests > 0, `${patternRests} rests`);

  // Check wrapper lines
  const wrapperLines = await page.evaluate(() =>
    document.querySelectorAll('.code-line-wrapper').length
  );
  log('Wrapper lines (stack parens) present', wrapperLines > 0, `${wrapperLines} wrappers`);
}

async function testTransport() {
  console.log('\n--- Transport Bar ---');

  const transport = await page.$('.transport-bar');
  log('Transport bar exists', !!transport);

  const buttons = await page.$$('.transport-button');
  log('Transport has 3 buttons', buttons.length === 3, `found ${buttons.length}`);

  // Check HUSH button
  const hushBtn = await page.$('.transport-button.hush');
  log('HUSH button exists', !!hushBtn);

  const hushText = hushBtn ? await page.evaluate(el => el.textContent.trim(), hushBtn) : '';
  log('HUSH button labeled correctly', hushText === 'HUSH', hushText);
}

async function testBonki() {
  console.log('\n--- Bonki Sprite ---');

  const bonki = await page.$('.bonki');
  log('Bonki element exists', !!bonki);

  // Check if Bonki is in the transport bar
  const bonkiInTransport = await page.evaluate(() => {
    const transport = document.querySelector('.transport-bar');
    const bonki = document.querySelector('.bonki');
    return transport && bonki && transport.contains(bonki);
  });
  log('Bonki is inside transport bar', bonkiInTransport);
}

async function testVisualizer() {
  console.log('\n--- Audio Visualizer (02-10) ---');

  const canvas = await page.$('.visualizer-canvas');
  log('Visualizer canvas exists', !!canvas);

  // Check canvas is in transport bar
  const canvasInTransport = await page.evaluate(() => {
    const transport = document.querySelector('.transport-bar');
    const canvas = document.querySelector('.visualizer-canvas');
    return transport && canvas && transport.contains(canvas);
  });
  log('Visualizer is inside transport bar', canvasInTransport);

  // Check canvas dimensions via CSS
  const canvasSize = await page.evaluate(() => {
    const canvas = document.querySelector('.visualizer-canvas');
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  log('Visualizer has proper dimensions',
    canvasSize && canvasSize.width > 50 && canvasSize.height > 20,
    canvasSize ? `${canvasSize.width}x${canvasSize.height}` : 'no canvas'
  );
}

async function testPlayback() {
  console.log('\n--- Playback & Beat Tracking (02-08) ---');

  // Ensure some cells are active
  await page.evaluate(() => {
    const cells = document.querySelectorAll('.sequencer-grid:nth-child(2) .sequencer-cell');
    // Toggle cells 0, 2, 4, 6 for a pattern
    [0, 2, 4, 6].forEach(i => {
      if (cells[i] && !cells[i].classList.contains('active')) cells[i].click();
    });
  });
  await new Promise(r => setTimeout(r, 300));

  // Click play
  await page.evaluate(() => {
    const playBtn = document.querySelector('.transport-button');
    if (playBtn) playBtn.click();
  });

  // Wait for playback to start and beat tracking to kick in
  await new Promise(r => setTimeout(r, 2000));

  // Check if play button is active
  const playActive = await page.evaluate(() =>
    document.querySelector('.transport-button')?.classList.contains('active')
  );
  log('Play button shows active state', playActive);

  // Check for on-beat class (beat tracking working)
  const onBeatCells = await page.evaluate(() =>
    document.querySelectorAll('.sequencer-cell.on-beat').length
  );
  log('Beat tracking: on-beat class applied to cells', onBeatCells > 0, `${onBeatCells} cells on-beat`);

  // Check for triggered class (02-08 trigger-pop)
  // Need to wait and check quickly since triggered class is brief (200ms)
  let triggeredFound = false;
  for (let i = 0; i < 20; i++) {
    const count = await page.evaluate(() =>
      document.querySelectorAll('.sequencer-cell.triggered').length
    );
    if (count > 0) {
      triggeredFound = true;
      break;
    }
    await new Promise(r => setTimeout(r, 100));
  }
  log('Trigger-pop animation fires (triggered class)', triggeredFound);

  // Check for pattern cursor in code view (02-09)
  let cursorFound = false;
  for (let i = 0; i < 10; i++) {
    const count = await page.evaluate(() =>
      document.querySelectorAll('.pattern-cursor').length
    );
    if (count > 0) {
      cursorFound = true;
      break;
    }
    await new Promise(r => setTimeout(r, 100));
  }
  log('Code view: moving cursor present during playback', cursorFound);

  // Check for code-line-bounce (02-09)
  let bounceFound = false;
  for (let i = 0; i < 20; i++) {
    const count = await page.evaluate(() =>
      document.querySelectorAll('.code-line-bounce').length
    );
    if (count > 0) {
      bounceFound = true;
      break;
    }
    await new Promise(r => setTimeout(r, 100));
  }
  log('Code view: bounce animation fires on beat', bounceFound);

  // Check visualizer canvas has data drawn (02-10)
  // Canvas with data will have non-zero pixel data
  const canvasHasData = await page.evaluate(() => {
    const canvas = document.querySelector('.visualizer-canvas');
    if (!canvas) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Check if any pixel is non-zero (something was drawn)
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0 || imageData.data[i + 1] > 0 || imageData.data[i + 2] > 0) {
        return true;
      }
    }
    return false;
  });
  log('Visualizer canvas has drawn data during playback', canvasHasData);

  // Check Bonki state
  const bonkiState = await page.evaluate(() => {
    const bonki = document.querySelector('.bonki');
    return bonki?.classList.contains('vibing') || bonki?.dataset?.state === 'vibing' ||
           bonki?.className?.includes('vibing');
  });
  log('Bonki is vibing during playback', bonkiState);

  // HUSH
  await page.evaluate(() => {
    document.querySelector('.transport-button.hush')?.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const afterHush = await page.evaluate(() => ({
    playActive: document.querySelector('.transport-button')?.classList.contains('active'),
    onBeat: document.querySelectorAll('.sequencer-cell.on-beat').length,
    activeCells: document.querySelectorAll('.sequencer-cell.active').length,
  }));
  log('HUSH stops playback', !afterHush.playActive);
  log('HUSH clears beat indicators', afterHush.onBeat === 0);
  log('HUSH clears grid', afterHush.activeCells === 0);
}

async function testPresetGallery() {
  console.log('\n--- Preset Gallery ---');

  const gallery = await page.$('.preset-gallery');
  log('Preset gallery exists', !!gallery);

  const presetCards = await page.evaluate(() =>
    document.querySelectorAll('.preset-card').length
  );
  log('Preset cards present', presetCards > 0, `${presetCards} presets`);

  // Check for Bonki cover SVGs
  const bonkiCovers = await page.evaluate(() =>
    document.querySelectorAll('.preset-card svg, .bonki-cover').length
  );
  log('Preset cards have cover art', bonkiCovers > 0, `${bonkiCovers} covers`);
}

async function testLayerChips() {
  console.log('\n--- Layer Chips ---');

  // HUSH first to clear state
  await page.evaluate(() => {
    document.querySelector('.transport-button.hush')?.click();
  });
  await new Promise(r => setTimeout(r, 300));

  // Toggle some cells to create a sequencer layer
  await page.evaluate(() => {
    const grids = document.querySelectorAll('.sequencer-grid');
    if (grids[0]) {
      const cells = grids[0].querySelectorAll('.sequencer-cell');
      if (cells[0]) cells[0].click();
      if (cells[2]) cells[2].click();
    }
  });
  await new Promise(r => setTimeout(r, 500));

  // Layer chips appear just from toggling cells (layer created immediately)
  let layerChips = await page.evaluate(() =>
    document.querySelectorAll('.layer-chip').length
  );

  // If not yet, try playing to force layer evaluation
  if (layerChips === 0) {
    await page.evaluate(() => {
      document.querySelector('.transport-button')?.click();
    });
    await new Promise(r => setTimeout(r, 500));

    layerChips = await page.evaluate(() =>
      document.querySelectorAll('.layer-chip').length
    );
  }

  log('Layer chips appear when layers active', layerChips > 0, `${layerChips} chips`);

  // Cleanup
  await page.evaluate(() => {
    document.querySelector('.transport-button.hush')?.click();
  });
  await new Promise(r => setTimeout(r, 300));
}

async function testResponsiveLayout() {
  console.log('\n--- Layout & Responsiveness ---');

  // Check split pane exists
  const splitPane = await page.$('.split-pane');
  log('Split pane layout exists', !!splitPane);

  // Check split pane children
  const splitChildren = await page.evaluate(() => ({
    instrument: !!document.querySelector('.split-pane-instrument'),
    code: !!document.querySelector('.split-pane-code'),
  }));
  log('Split pane has instrument panel', splitChildren.instrument);
  log('Split pane has code panel', splitChildren.code);

  // Check iPad-like viewport
  await page.setViewport({ width: 1024, height: 768 });
  await new Promise(r => setTimeout(r, 500));

  const tabletLayout = await page.evaluate(() => {
    const sp = document.querySelector('.split-pane');
    if (!sp) return 'no split pane';
    const style = getComputedStyle(sp);
    return style.flexDirection || style.display;
  });
  log('Tablet layout renders', tabletLayout !== 'no split pane', tabletLayout);

  // Reset viewport
  await page.setViewport({ width: 1280, height: 900 });
  await new Promise(r => setTimeout(r, 300));
}

async function testScreenshot() {
  console.log('\n--- Screenshots ---');

  // Take a screenshot of the full app
  await page.screenshot({
    path: '/Users/guyramone/Desktop/Desktop - Mac/HOMIES/homie-beats/test-screenshot-idle.png',
    fullPage: true,
  });
  log('Idle state screenshot saved', true, 'test-screenshot-idle.png');

  // Toggle some cells and play for a "live" screenshot
  await page.evaluate(() => {
    const grids = document.querySelectorAll('.sequencer-grid');
    grids.forEach((grid, rowIdx) => {
      const cells = grid.querySelectorAll('.sequencer-cell');
      // Create a pattern: every other cell, offset by row
      cells.forEach((cell, stepIdx) => {
        if ((stepIdx + rowIdx) % 3 === 0) cell.click();
      });
    });
  });
  await new Promise(r => setTimeout(r, 300));

  // Play
  await page.evaluate(() => {
    document.querySelector('.transport-button')?.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: '/Users/guyramone/Desktop/Desktop - Mac/HOMIES/homie-beats/test-screenshot-playing.png',
    fullPage: true,
  });
  log('Playing state screenshot saved', true, 'test-screenshot-playing.png');

  // Hush
  await page.evaluate(() => {
    document.querySelector('.transport-button.hush')?.click();
  });
}

// ─── MAIN ──────────────────────────────────────────────────

async function main() {
  console.log('=== HOMIE Beats Phase 2 — Puppeteer Test Suite ===\n');

  const errors = await setup();

  try {
    await navigateToApp();
    await testAppLoad();
    await testTabNavigation();
    await testControlStrip();
    await testSequencer();
    await testCodeView();
    await testTransport();
    await testBonki();
    await testVisualizer();
    await testPresetGallery();
    await testPlayback();
    await testLayerChips();
    await testResponsiveLayout();
    await testScreenshot();
  } catch (err) {
    console.error('\nFATAL ERROR:', err.message);
    log('Test suite completed without crash', false, err.message);
  }

  // Report page errors
  if (errors.length > 0) {
    console.log('\n--- Page Errors ---');
    errors.forEach(e => console.log(`  \u26A0\uFE0F ${e}`));
  }

  // Summary
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  const total = results.length;

  console.log('\n=== RESULTS ===');
  console.log(`Passed: ${passed}/${total}`);
  console.log(`Failed: ${failed}/${total}`);

  if (failed > 0) {
    console.log('\nFailing tests:');
    results.filter(r => !r.pass).forEach(r => {
      console.log(`  \u274C ${r.test}${r.detail ? ' — ' + r.detail : ''}`);
    });
  }

  console.log('\n' + (failed === 0 ? '\u2728 ALL TESTS PASSED!' : `\u26A0\uFE0F ${failed} test(s) need attention`));

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
}

main();
