/**
 * screenshot.js — Puppeteer screenshot helper
 *
 * Called by capture_screenshots.py via subprocess.
 * Captures mobile-viewport screenshots of websites and tweets.
 *
 * Setup:
 *   cd ai-video-pipeline && npm init -y && npm install puppeteer
 *
 * Usage:
 *   node scripts/screenshot.js --url "https://example.com" --output output/screenshot.png
 */

const puppeteer = require("puppeteer");
const path = require("path");

// Parse CLI arguments
function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, "");
    args[key] = argv[i + 1];
  }
  return args;
}

async function captureScreenshot(options) {
  const {
    url,
    output,
    width = 375,
    height = 812,
    scale = 2,
    wait = 3000,
    highlight = null,
  } = options;

  if (!url || !output) {
    console.error("Usage: node screenshot.js --url <URL> --output <FILE>");
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();

    // Set mobile viewport
    await page.setViewport({
      width: parseInt(width),
      height: parseInt(height),
      deviceScaleFactor: parseInt(scale),
      isMobile: true,
      hasTouch: true,
    });

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) " +
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    );

    // Navigate to page
    console.log(`Navigating to: ${url}`);
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 20000,
    });

    // Wait for dynamic content
    await page.waitForTimeout(parseInt(wait));

    // Handle Twitter/X embeds — wait for tweet content to load
    if (url.includes("twitter.com") || url.includes("x.com")) {
      try {
        await page.waitForSelector('[data-testid="tweetText"]', {
          timeout: 10000,
        });
        // Extra wait for images/media in tweets
        await page.waitForTimeout(2000);
      } catch {
        console.log("Tweet content selector not found, continuing anyway");
      }
    }

    // Optional: highlight specific text with yellow background
    if (highlight) {
      await page.evaluate((text) => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent.includes(text)) {
            const span = document.createElement("mark");
            span.style.backgroundColor = "#FFE066";
            span.style.padding = "2px 4px";
            span.style.borderRadius = "3px";
            const parent = node.parentNode;
            const parts = node.textContent.split(text);
            const fragment = document.createDocumentFragment();
            parts.forEach((part, i) => {
              fragment.appendChild(document.createTextNode(part));
              if (i < parts.length - 1) {
                const mark = span.cloneNode();
                mark.textContent = text;
                fragment.appendChild(mark);
              }
            });
            parent.replaceChild(fragment, node);
            break; // Only highlight first occurrence
          }
        }
      }, highlight);
    }

    // Remove common overlays / cookie banners / paywalls
    await page.evaluate(() => {
      const selectors = [
        '[class*="cookie"]',
        '[class*="consent"]',
        '[class*="banner"]',
        '[class*="modal"]',
        '[class*="overlay"]',
        '[id*="cookie"]',
        '[id*="consent"]',
        "#onetrust-banner-sdk",
        ".fc-consent-root",
        '[class*="paywall"]',
      ];
      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          // Only remove if it looks like a popup/overlay
          const style = window.getComputedStyle(el);
          if (
            style.position === "fixed" ||
            style.position === "sticky" ||
            style.zIndex > 999
          ) {
            el.remove();
          }
        });
      });
    });

    // Ensure output directory exists
    const outputDir = path.dirname(output);
    const fs = require("fs");
    fs.mkdirSync(outputDir, { recursive: true });

    // Take screenshot
    await page.screenshot({
      path: output,
      type: "png",
      fullPage: false, // Only capture viewport
      clip: {
        x: 0,
        y: 0,
        width: parseInt(width),
        height: parseInt(height),
      },
    });

    console.log(`Screenshot saved: ${output}`);
  } finally {
    await browser.close();
  }
}

// Main
const args = parseArgs();
captureScreenshot(args).catch((err) => {
  console.error(`Screenshot failed: ${err.message}`);
  process.exit(1);
});
