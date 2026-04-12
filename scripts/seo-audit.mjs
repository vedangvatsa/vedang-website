#!/usr/bin/env node
/**
 * SEO Audit Script for veda.ng
 * Crawls the site and checks for common SEO issues.
 * Run: node scripts/seo-audit.mjs [url]
 */

const BASE_URL = process.argv[2] || 'https://veda.ng';
const CONCURRENCY = 5;
const visited = new Set();
const results = [];

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'VedangSEOAudit/1.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });
    const finalUrl = res.url;
    const status = res.status;
    const contentType = res.headers.get('content-type') || '';
    const html = contentType.includes('text/html') ? await res.text() : null;
    return { url: finalUrl, status, html, contentType };
  } catch (e) {
    return { url, status: 0, html: null, error: e.message };
  }
}

function extractMeta(html, url) {
  const issues = [];
  const warnings = [];
  const info = {};

  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  info.title = titleMatch ? titleMatch[1].trim() : null;
  if (!info.title) {
    issues.push('Missing <title> tag');
  } else if (info.title.length < 30) {
    warnings.push(`Title too short (${info.title.length} chars): "${info.title}"`);
  } else if (info.title.length > 60) {
    warnings.push(`Title too long (${info.title.length} chars): "${info.title}"`);
  }

  // Meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i)
    || html.match(/<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*>/i);
  info.description = descMatch ? descMatch[1].trim() : null;
  if (!info.description) {
    issues.push('Missing meta description');
  } else if (info.description.length < 70) {
    warnings.push(`Meta description too short (${info.description.length} chars)`);
  } else if (info.description.length > 160) {
    warnings.push(`Meta description too long (${info.description.length} chars)`);
  }

  // H1 tags
  const h1Matches = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  info.h1Count = h1Matches.length;
  if (h1Matches.length === 0) {
    issues.push('Missing H1 tag');
  } else if (h1Matches.length > 1) {
    warnings.push(`Multiple H1 tags (${h1Matches.length})`);
  }

  // Canonical
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["'](.*?)["'][^>]*>/i)
    || html.match(/<link[^>]*href=["'](.*?)["'][^>]*rel=["']canonical["'][^>]*>/i);
  info.canonical = canonicalMatch ? canonicalMatch[1] : null;
  if (!info.canonical) {
    warnings.push('Missing canonical tag');
  }

  // Open Graph
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*>/i);
  const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*>/i);
  const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*>/i);
  if (!ogTitle) warnings.push('Missing og:title');
  if (!ogDesc) warnings.push('Missing og:description');
  if (!ogImage) warnings.push('Missing og:image');

  // Twitter Card
  const twitterCard = html.match(/<meta[^>]*name=["']twitter:card["'][^>]*>/i);
  if (!twitterCard) warnings.push('Missing twitter:card');

  // Images without alt
  const imgTags = html.match(/<img[^>]*>/gi) || [];
  const missingAlt = imgTags.filter(img => !img.match(/alt=["'][^"']*["']/i) && !img.match(/alt=""/i));
  if (missingAlt.length > 0) {
    warnings.push(`${missingAlt.length} image(s) missing alt text`);
  }

  // Viewport meta
  const viewport = html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
  if (!viewport) issues.push('Missing viewport meta tag');

  // Lang attribute
  const lang = html.match(/<html[^>]*lang=["'][^"']+["'][^>]*>/i);
  if (!lang) warnings.push('Missing lang attribute on <html>');

  // Extract internal links for crawling
  const linkRegex = /href=["'](\/[^"']*|https?:\/\/veda\.ng[^"']*?)["']/gi;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[1];
    if (href.startsWith('/')) href = BASE_URL + href;
    // Clean anchors and query params for crawl purposes
    const clean = href.split('#')[0].split('?')[0];
    if (clean.startsWith(BASE_URL) && !clean.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|ico|woff|woff2|ttf|pdf|xml|json)$/i)) {
      links.push(clean);
    }
  }

  return { issues, warnings, info, links };
}

async function crawl(startUrl) {
  const queue = [startUrl];
  let active = 0;

  async function processUrl(url) {
    if (visited.has(url)) return;
    visited.add(url);

    const page = await fetchPage(url);
    const path = url.replace(BASE_URL, '') || '/';

    if (page.error) {
      results.push({ path, status: 0, issues: [`Fetch error: ${page.error}`], warnings: [], info: {} });
      return;
    }

    if (!page.html) {
      if (page.status >= 400) {
        results.push({ path, status: page.status, issues: [`HTTP ${page.status}`], warnings: [], info: {} });
      }
      return;
    }

    const { issues, warnings, info, links } = extractMeta(page.html, url);
    results.push({ path, status: page.status, issues, warnings, info });

    // Queue new links
    for (const link of links) {
      if (!visited.has(link)) {
        queue.push(link);
      }
    }
  }

  while (queue.length > 0 || active > 0) {
    while (queue.length > 0 && active < CONCURRENCY) {
      const url = queue.shift();
      if (!url || visited.has(url)) continue;
      active++;
      processUrl(url).then(() => { active--; });
    }
    await new Promise(r => setTimeout(r, 100));
  }
}

function printReport() {
  console.log('\n' + '='.repeat(70));
  console.log(`  SEO AUDIT REPORT: ${BASE_URL}`);
  console.log(`  Pages crawled: ${results.length}`);
  console.log('='.repeat(70));

  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  console.log(`\n  🔴 ${totalIssues} issues  ⚠️  ${totalWarnings} warnings\n`);

  // Pages with issues first
  const withIssues = results.filter(r => r.issues.length > 0).sort((a, b) => b.issues.length - a.issues.length);
  const withWarnings = results.filter(r => r.warnings.length > 0 && r.issues.length === 0);
  const clean = results.filter(r => r.issues.length === 0 && r.warnings.length === 0);

  if (withIssues.length > 0) {
    console.log('─'.repeat(70));
    console.log('  🔴 PAGES WITH ISSUES');
    console.log('─'.repeat(70));
    for (const r of withIssues) {
      console.log(`\n  ${r.path} [${r.status}]`);
      for (const issue of r.issues) console.log(`    🔴 ${issue}`);
      for (const warn of r.warnings) console.log(`    ⚠️  ${warn}`);
    }
  }

  if (withWarnings.length > 0) {
    console.log('\n' + '─'.repeat(70));
    console.log('  ⚠️  PAGES WITH WARNINGS');
    console.log('─'.repeat(70));
    for (const r of withWarnings) {
      console.log(`\n  ${r.path} [${r.status}]`);
      for (const warn of r.warnings) console.log(`    ⚠️  ${warn}`);
    }
  }

  if (clean.length > 0) {
    console.log('\n' + '─'.repeat(70));
    console.log(`  ✅ ${clean.length} PAGES WITH NO ISSUES`);
    console.log('─'.repeat(70));
    for (const r of clean) {
      console.log(`    ${r.path}`);
    }
  }

  // Summary table: duplicate titles
  const titles = {};
  for (const r of results) {
    if (r.info?.title) {
      titles[r.info.title] = titles[r.info.title] || [];
      titles[r.info.title].push(r.path);
    }
  }
  const dupes = Object.entries(titles).filter(([, pages]) => pages.length > 1);
  if (dupes.length > 0) {
    console.log('\n' + '─'.repeat(70));
    console.log('  🔴 DUPLICATE TITLES');
    console.log('─'.repeat(70));
    for (const [title, pages] of dupes) {
      console.log(`\n    "${title}"`);
      for (const p of pages) console.log(`      → ${p}`);
    }
  }

  // Missing descriptions summary
  const missingDesc = results.filter(r => r.issues.some(i => i.includes('meta description')));
  if (missingDesc.length > 0) {
    console.log('\n' + '─'.repeat(70));
    console.log(`  📝 ${missingDesc.length} PAGES MISSING META DESCRIPTION`);
    console.log('─'.repeat(70));
    for (const r of missingDesc) console.log(`    ${r.path}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('  Audit complete.');
  console.log('='.repeat(70) + '\n');
}

console.log(`\n🔍 Crawling ${BASE_URL}...\n`);
await crawl(BASE_URL);
printReport();
