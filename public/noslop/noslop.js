/**
 * NoSlop analyzer — runs 100% in the browser.
 * @license MIT
 */

const NOSLOP = (() => {
  'use strict';

  // Each pattern: re (RegExp), name, message, weight, [removable], [fix]
  const patterns = [
    // High-frequency AI buzzwords
    { re: /\b(?:delve|delves|delved|delving|tapestry|pivotal|vibrant|meticulous|landscape|testament|underscore|intricate|interplay|garner|bolster|bolstered|foster|fostering|showcase|showcasing|emphasize|emphasizing|enduring|crucial|enhance|enhancing|highlighting|renowned|groundbreaking|profound|comprehensive|multifaceted|leverage|leveraging|utilize|utilizing|facilitate|facilitates|encompasses|spearhead|harness|harnessing|elevate|elevating|streamline|streamlining|robust|seamless|seamlessly|holistic|synergy|paradigm|ecosystem|supercharge|embark|paramount|transformative|cutting-edge|game-changer|ever-evolving)\b/gi, name: 'ai-buzzword', message: 'AI buzzword — use a plain alternative', weight: 2 },

    // Standalone weak openers (safe to delete)
    { re: /^(?:Great question|Certainly|Absolutely|Of course|I'd be happy to|Sure!|Looking at your|To answer your question)[,!.\s]*/gim, name: 'weak-opener', message: 'Weak opener', weight: 2, removable: true, fix: '' },
    { re: /^(?:Here's the thing|Here's what I mean|Let me be clear|I'll be honest|To be honest|The uncomfortable truth is)[,:\s]*/gim, name: 'throat-clearing', message: 'Throat-clearing opener', weight: 2, removable: true, fix: '' },

    // Standalone weak closers (safe to delete)
    { re: /(?:Hope this helps!*|Let me know if you need anything else|Happy to clarify|Feel free to ask)[.!\s]*$/gim, name: 'weak-closer', message: 'Weak closer', weight: 2, removable: true, fix: '' },
    { re: /(?:In conclusion|To summarize|Ultimately|Overall),?\s*/gi, name: 'summary-recap', message: 'Summary/recap marker', weight: 2, removable: true, fix: '' },

    // Empty adverbs
    { re: /\b(?:just|literally|honestly|simply|actually|truly|fundamentally|importantly|crucially|inherently|inevitably)\b/gi, name: 'empty-adverb', message: 'Empty adverb', weight: 1 },

    // Banned standalone phrases
    { re: /\bit's worth noting\b/gi, name: 'worth-noting', message: 'Empty qualifier', weight: 2, removable: true, fix: '' },
    { re: /\bat the end of the day\b/gi, name: 'end-of-day', message: 'Cliché', weight: 2, removable: true, fix: '' },
    { re: /\bwhen it comes to\b/gi, name: 'when-it-comes', message: 'Filler phrase', weight: 1, removable: true, fix: '' },
    { re: /\bat its core\b/gi, name: 'at-its-core', message: 'Filler phrase', weight: 1, removable: true, fix: '' },
    { re: /\bin today's (?:world|landscape|era|digital landscape)\b/gi, name: 'today-world', message: 'Generic framing', weight: 2, removable: true, fix: '' },
    { re: /\bthe reality is\b/gi, name: 'reality-is', message: 'Empty qualifier', weight: 2, removable: true, fix: '' },
    { re: /\bthe truth is\b/gi, name: 'truth-is', message: 'Empty qualifier', weight: 2, removable: true, fix: '' },
    { re: /\bin terms of\b/gi, name: 'in-terms-of', message: 'Filler phrase', weight: 1, removable: true, fix: '' },
    { re: /\bwith regard to\b/gi, name: 'with-regard-to', message: 'Filler phrase', weight: 1, removable: true, fix: '' },
    { re: /\bin order to\b/gi, name: 'in-order-to', message: 'Filler phrase', weight: 1, removable: true, fix: '' },
    { re: /\bgoing forward\b/gi, name: 'going-forward', message: 'Filler phrase', weight: 1, removable: true, fix: '' },
    { re: /\blet's dive in\b/gi, name: 'dive-in', message: 'Chatbot opener', weight: 2, removable: true, fix: '' },

    // Faux insight setups
    { re: /\b(?:What (?:most people get wrong|nobody tells you)|the part everyone misses|This is the part most people skip)\b/gi, name: 'faux-insight', message: 'Faux-insight setup', weight: 2, removable: true, fix: '' },

    // Colon reveal setup
    { re: /\bthe best part:\s*/gi, name: 'colon-reveal', message: 'Colon reveal setup', weight: 2, removable: true, fix: '' },

    // Binary / negative constructions
    { re: /\bnot just [^,.]{1,60},?\s*but (?:also )?/gi, name: 'not-just-but', message: '"Not just X, but Y" construction', weight: 2 },
    { re: /\bit's not [^,.]{1,40}\.?\s*it's /gi, name: 'binary-contrast', message: 'Binary contrast', weight: 2 },
    { re: /\bnot a?\s*\w+[,.]?\s+not a?\s*\w+[,.]?\s+a\s+/gi, name: 'negative-listing', message: 'Negative listing', weight: 2 },

    // Superficial -ing clauses
    { re: /\b(?:highlighting|showcasing|reflecting|emphasizing|underscoring)[,.]?/gi, name: 'superficial-ing', message: 'Superficial trailing -ing clause', weight: 1, removable: true, fix: '' },

    // Importance puffery
    { re: /\b(?:marks a pivotal moment|leaves an indelible mark|sends a strong message|paves the way|plays a (?:crucial|vital) role|a testament to)\b/gi, name: 'importance-puffery', message: 'Importance puffery', weight: 2 },

    // Weasel attribution
    { re: /\b(?:Experts agree|Studies show|Industry reports suggest|Many argue|Widely regarded as|Some critics argue|Observers note|Experts say)\b/gi, name: 'weasel-attribution', message: 'Weasel attribution — name the source', weight: 2 },

    // Fake-strong verbs
    { re: /\b(?:serves as|stands as|acts as|boasts)\s+a?/gi, name: 'fake-strong-verb', message: 'Fake-strong verb — use "is" or "has"', weight: 1 },

    // Participle chains / elegant variation words
    { re: /\b(?:improving|contributing|reflecting|showcasing|cultivating)\s+[a-z]+\s+while\s+(?:highlighting|emphasizing|showcasing|improving)/gi, name: 'participle-chain', message: 'Participle chain', weight: 2 },

    // Collaborative / inclusive language
    { re: /\b(?:let's explore|let us delve into|we will examine|as we can see|as we have seen)\b/gi, name: 'collaborative', message: 'Collaborative filler', weight: 2, removable: true, fix: '' },

    // Knowledge cutoff apologies
    { re: /\b(?:as of my last update|as of my knowledge cutoff|I don't have access to|I don't have real-time)\b/gi, name: 'knowledge-cutoff', message: 'Knowledge-cutoff disclaimer', weight: 2, removable: true, fix: '' },

    // Promotional hype
    { re: /\b(?:groundbreaking|revolutionary|game-changing|transformative)\b/gi, name: 'promo-hype', message: 'Promotional hype', weight: 2 },

    // Decorative emoji in prose
    { re: /[🚀✨💡💪🎉🔥🌟🎊🌈💫⭐🎯💯]/gu, name: 'decorative-emoji', message: 'Decorative emoji in prose', weight: 2, removable: true, fix: '' },

    // Plain-language word swaps and padding
    { re: /\bdue to the fact that\b/gi, name: 'due-to-fact', message: 'Plain-language swap: because', weight: 2, removable: true, fix: 'because' },
    { re: /\ba number of\b/gi, name: 'a-number-of', message: 'Plain-language swap: some/many', weight: 1, removable: true, fix: 'some' },
    { re: /\b(?:demonstrate|demonstrates|illustrate|illustrates)\b/gi, name: 'demonstrate-illustrate', message: 'Plain-language swap: show', weight: 1 },
    { re: /\bindividuals?\b/gi, name: 'individuals', message: 'Plain-language swap: people', weight: 1 },
    { re: /\b(?:prior to|subsequent to)\b/gi, name: 'prior-subsequent', message: 'Plain-language swap: before/after', weight: 2 },
    { re: /\bin the event that\b/gi, name: 'in-event', message: 'Plain-language swap: if', weight: 2, removable: true, fix: 'if' },
    { re: /\bit is important to note that\b/gi, name: 'important-note', message: 'Plain-language: delete', weight: 2, removable: true, fix: '' },
    { re: /\bcomprises\b/gi, name: 'comprises', message: 'Plain-language swap: includes/has', weight: 1 },

    // Meta-comments about the text itself
    { re: /\b(?:in this (?:section|article|post),?\s*we|this (?:section|paragraph) (?:will|does)|as (?:mentioned|discussed) (?:earlier|above|before))\b/gi, name: 'meta-comment', message: 'Meta-comment about the text', weight: 1, removable: true, fix: '' },
  ];

  function scan(text) {
    const findings = [];
    for (const p of patterns) {
      if (p.name === 'em-dash') continue; // handled separately
      const re = new RegExp(p.re.source, p.re.flags.includes('g') ? p.re.flags : p.re.flags + 'g');
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text)) !== null) {
        if (m.index === re.lastIndex) re.lastIndex++;
        findings.push({
          name: p.name,
          message: p.message,
          weight: p.weight,
          removable: !!p.removable,
          fix: p.fix,
          start: m.index,
          end: m.index + m[0].length,
          match: m[0]
        });
      }
    }
    return findings;
  }

  function emDashFindings(text) {
    const findings = [];
    const paras = text.split(/\n\s*\n/);
    let cursor = 0;
    for (const para of paras) {
      const dashes = [];
      const re = /—/g;
      let m;
      while ((m = re.exec(para)) !== null) dashes.push(m.index);
      for (let i = 0; i < dashes.length; i++) {
        const pos = cursor + dashes[i];
        findings.push({
          name: 'em-dash',
          message: 'Avoid em dashes; use a period, comma, parentheses, or colon',
          weight: 1,
          removable: false,
          start: pos,
          end: pos + 1,
          match: '—'
        });
      }
      cursor += para.length + 1; // keep rough alignment
    }
    return findings;
  }

  function sentenceLengthFindings(text) {
    const findings = [];
    const re = /[^.!?]+[.!?]+/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      if (m.index === re.lastIndex) re.lastIndex++;
      const words = m[0].trim().split(/\s+/).filter(Boolean);
      if (words.length > 25) {
        findings.push({
          name: 'long-sentence',
          message: `Long sentence (${words.length} words)`,
          weight: 1,
          removable: false,
          start: m.index,
          end: m.index + m[0].length,
          match: m[0].slice(0, 80).trim()
        });
      }
    }
    return findings;
  }

  function analyze(text) {
    const raw = text || '';
    const findings = [...scan(raw), ...emDashFindings(raw), ...sentenceLengthFindings(raw)];
    findings.sort((a, b) => a.start - b.start || b.end - a.end);

    const totalWeight = findings.reduce((s, f) => s + f.weight, 0);
    const words = raw.trim().split(/\s+/).filter(Boolean).length || 1;
    const score = Math.min(100, Math.round((totalWeight * 100) / (words * 0.2 + 10)));

    return {
      score,
      verdict: score < 15 ? 'NoSlop' : score < 40 ? 'Some slop' : 'High slop',
      humanBadge: score < 15,
      words,
      findings,
      top: findings.slice(0, 12)
    };
  }

  function toSegments(text, findings) {
    const marks = [];
    for (const f of findings) {
      marks.push({ pos: f.start, f, add: true });
      marks.push({ pos: f.end, f, add: false });
    }
    marks.sort((a, b) => a.pos - b.pos || (a.add ? -1 : 1));

    const segments = [];
    let pos = 0;
    let active = new Map();
    let i = 0;
    while (i < marks.length) {
      const p = marks[i].pos;
      if (p > pos) {
        segments.push({
          text: text.slice(pos, p),
          flags: [...active.values()],
          start: pos,
          end: p
        });
        pos = p;
      }
      while (i < marks.length && marks[i].pos === p) {
        const { f, add } = marks[i];
        if (add) active.set(f.name, f);
        else active.delete(f.name);
        i++;
      }
    }
    if (pos < text.length) {
      segments.push({
        text: text.slice(pos),
        flags: [...active.values()],
        start: pos,
        end: text.length
      });
    }
    return segments;
  }

  function clean(text, findings) {
    const rem = findings.filter(f => f.removable).slice().sort((a, b) => b.start - a.start);
    let out = text;
    for (const f of rem) {
      out = out.slice(0, f.start) + (f.fix === undefined ? '' : f.fix) + out.slice(f.end);
    }
    return out.replace(/\s{2,}/g, ' ').trim();
  }

  return { patterns, analyze, toSegments, clean };
})();

if (typeof window !== 'undefined') window.NOSLOP = NOSLOP;
if (typeof module !== 'undefined' && module.exports) module.exports = NOSLOP;
