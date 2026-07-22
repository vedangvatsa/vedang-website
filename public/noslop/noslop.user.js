// ==UserScript==
// @name         NoSlop
// @namespace    https://veda.ng
// @version      1.0
// @description  Highlight AI slop on any page.
// @match        *://*/*
// @grant        none
// @require      https://veda.ng/noslop/noslop.js
// ==/UserScript==

(function () {
  'use strict';

  const btn = document.createElement('button');
  btn.textContent = 'NoSlop';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;padding:10px 16px;border:0;border-radius:6px;background:#6ea8fe;color:#000;font-weight:700;cursor:pointer;font-family:sans-serif;';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    const text = window.getSelection().toString().trim() || document.body.innerText;
    if (!text) return;
    const res = NOSLOP.analyze(text);
    const list = res.top.slice(0, 10).map(f => `<li style="margin:6px 0">“${(f.match.trim() || '…').replace(/</g,'&lt;')}” — ${f.message}</li>`).join('');

    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;width:380px;max-height:75vh;overflow:auto;background:#0b0c10;color:#e6e6e6;border:1px solid #2a2d35;border-radius:8px;padding:18px;font-family:sans-serif;font-size:14px;box-shadow:0 8px 40px #000000aa;';
    panel.innerHTML = `
      <h2 style="margin:0 0 8px;font-size:18px">NoSlop · ${res.score} — ${res.verdict}</h2>
      <p style="margin:0 0 12px;color:#8b9bb4">${res.words} words scanned. ${res.humanBadge ? '✓ NoSlop' : ''}</p>
      <ul style="padding-left:18px;margin:0 0 12px">${list}</ul>
      <button id="noslop-close" style="background:#2a2d35;color:#e6e6e6;border:0;border-radius:6px;padding:8px 14px;cursor:pointer">Close</button>
    `;
    document.body.appendChild(panel);
    document.getElementById('noslop-close').addEventListener('click', () => panel.remove());
  });
})();
