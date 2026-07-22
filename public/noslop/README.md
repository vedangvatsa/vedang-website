# NoSlop

A client-side, no-repo-needed tool to detect and strip AI slop from prose. Inspired by [petergyang/no-ai-slop](https://github.com/petergyang/no-ai-slop), [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd), [pols.dev/slop](https://pols.dev/slop), and the latest open anti-slop linters.

## Files

- `noslop.md` — agent prompt / anti-slop law. Install with `curl` into `~/.claude/CLAUDE.md`, `.cursorrules`, or any system prompt.
- `noslop.js` — the analyzer engine (browser + Node-friendly).
- `index.html` — the static paste-and-check UI fallback.
- `noslop.user.js` — Tampermonkey/Greasemonkey userscript to scan any page.

## Use the analyzer page locally

```bash
python3 -m http.server 8080 --directory /Users/vedang/CascadeProjects/noslop
```

Open `http://localhost:8080`.

## Deploy to veda.ng/noslop

Upload these files to your `veda.ng` host:

- `index.html` as `noslop/index.html`
- `noslop.js` as `noslop/noslop.js`
- `noslop.user.js` as `noslop/noslop.user.js`
- `noslop.md` at the root as `noslop.md`

Then the install command is:

```bash
curl -fsSL https://veda.ng/noslop.md >> ~/.claude/CLAUDE.md
```

## Use the userscript

1. Install Tampermonkey/Greasemonkey.
2. Open `https://veda.ng/noslop/noslop.user.js` (or import the file).
3. Click the **NoSlop** button on any page to see the slop score and top tells.

## License

MIT.
