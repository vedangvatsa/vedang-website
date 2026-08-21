

/* ─── Day 1: AI Tools Overview ─── */
export function AIToolsOverview() {
  const categories = [
    { name: 'Chatbots', desc: 'Talk to AI, get answers', tools: 'ChatGPT, Claude, Gemini', icon: '💬', color: '#3b82f6' },
    { name: 'Generators', desc: 'Create images, video, music', tools: 'Midjourney, Flux, Suno', icon: '🎨', color: '#8b5cf6' },
    { name: 'Agents', desc: 'AI that takes actions for you', tools: 'Claude Code, Cursor, Devin', icon: '🤖', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">Three Types of AI Tools</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Know what each one does before picking</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categories.map(c => (
            <div key={c.name} className="rounded-[3px] border border-[#e3e3e0] overflow-hidden" style={{ borderTopWidth: '3px', borderTopColor: c.color }}>
              <div className="p-4">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="text-xs font-bold" style={{ color: c.color }}>{c.name}</div>
                <p className="text-[10px] text-muted-foreground mt-1 mb-2">{c.desc}</p>
                <p className="text-[10px] text-muted-foreground/60 font-mono">{c.tools}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 1: The 7 AI Categories ─── */
export function AICategoryMap() {
  const cats = [
    { num: '1', name: 'Content + Communication', example: 'Auto-generate newsletters, social posts, internal docs', color: '#3b82f6' },
    { num: '2', name: 'Customer Experience', example: 'AI chatbots, personalized onboarding, ticket routing', color: '#8b5cf6' },
    { num: '3', name: 'Data + Analytics', example: 'Natural language queries on dashboards, anomaly detection', color: '#10b981' },
    { num: '4', name: 'Operations + Workflows', example: 'Invoice processing, scheduling, inventory forecasting', color: '#f59e0b' },
    { num: '5', name: 'Knowledge Management', example: 'Search across docs, auto-summarize meetings, onboarding bots', color: '#ef4444' },
    { num: '6', name: 'Creative + Design', example: 'Product mockups, ad variations, brand asset generation', color: '#ec4899' },
    { num: '7', name: 'Decision Support', example: 'Risk scoring, pricing optimization, demand prediction', color: '#06b6d4' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">7 Categories of AI Applications</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Where AI creates real value for organizations</p>
        <div className="space-y-1.5">
          {cats.map(c => (
            <div key={c.num} className="rounded-[3px] border border-[#e3e3e0] px-4 py-2.5 flex flex-col md:flex-row md:items-center gap-1 md:gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: c.color }}>
              <span className="text-xs font-bold min-w-[200px]" style={{ color: c.color }}>{c.name}</span>
              <span className="text-[10px] text-muted-foreground">{c.example}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 1: Boring Niche Framework ─── */
export function BoringNicheFramework() {
  const niches = [
    { niche: 'Invoice processing', pain: '4 hours/week manual data entry', ai: 'OCR + LLM extracts line items in seconds', score: '9/10' },
    { niche: 'Tenant maintenance', pain: 'Phone calls, lost tickets, slow fixes', ai: 'Photo → auto-categorize → dispatch contractor', score: '8/10' },
    { niche: 'Insurance claims', pain: '2-week review cycle, manual matching', ai: 'Auto-match claim to policy, flag fraud patterns', score: '9/10' },
    { niche: 'Restaurant menus', pain: 'Update across 5 platforms manually', ai: 'Change once, sync everywhere + auto-translate', score: '7/10' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">The Boring Niche + AI Framework</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">The best AI startups solve boring problems really well</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-[#e3e3e0]">
              {['Boring Niche', 'Current Pain', 'AI Solution', 'Opportunity'].map(h => (
                <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {niches.map(n => (
                <tr key={n.niche} className="border-b border-[#e3e3e0]/40">
                  <td className="px-2 py-2 font-bold text-[#37352f]">{n.niche}</td>
                  <td className="px-2 py-2 text-muted-foreground">{n.pain}</td>
                  <td className="px-2 py-2 text-muted-foreground">{n.ai}</td>
                  <td className="px-2 py-2 font-mono font-bold text-emerald-600">{n.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] px-4 py-2.5">
          <span className="text-[11px] text-[#37352f]"><strong>Pattern:</strong> Find a process someone does manually every week. If it involves reading text, sorting data, or making repetitive decisions, AI can probably do it faster.</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 2: Position Statement Template ─── */
export function PositionStatement() {
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">The Position Statement</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Fill this in before writing a single line of code</p>
        <div className="rounded-[3px] border-2 border-blue-300 bg-blue-50/30 p-5 font-mono text-sm leading-relaxed text-[#37352f]">
          <span className="text-muted-foreground">For </span><span className="bg-blue-100 px-1.5 py-0.5 rounded font-bold text-blue-700 whitespace-nowrap">[WHO]</span>
          <span className="text-muted-foreground">, who </span><span className="bg-amber-100 px-1.5 py-0.5 rounded font-bold text-amber-700 whitespace-nowrap">[PAIN]</span>
          <span className="text-muted-foreground">,</span><br />
          <span className="bg-emerald-100 px-1.5 py-0.5 rounded font-bold text-emerald-700 whitespace-nowrap">[PRODUCT]</span>
          <span className="text-muted-foreground"> is a </span><span className="bg-purple-100 px-1.5 py-0.5 rounded font-bold text-purple-700 whitespace-nowrap">[CATEGORY]</span>
          <span className="text-muted-foreground"> that </span><span className="bg-emerald-100 px-1.5 py-0.5 rounded font-bold text-emerald-700 whitespace-nowrap">[KEY BENEFIT]</span>
          <span className="text-muted-foreground">.</span><br />
          <span className="text-muted-foreground">Unlike </span><span className="bg-red-100 px-1.5 py-0.5 rounded font-bold text-red-700 whitespace-nowrap">[ALTERNATIVE]</span>
          <span className="text-muted-foreground">, it </span><span className="bg-emerald-100 px-1.5 py-0.5 rounded font-bold text-emerald-700 whitespace-nowrap">[DIFFERENTIATOR]</span>
          <span className="text-muted-foreground">.</span>
        </div>
        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] px-4 py-2.5">
          <span className="text-[11px] text-[#37352f]"><strong>Example:</strong> For freelance designers, who waste 3 hours/week writing project proposals, ProposalAI is an AI writing tool that generates client-ready proposals from a 2-minute brief. Unlike ChatGPT, it knows design industry pricing and formats output as a branded PDF.</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 2: Security Holes ─── */
export function SecurityHoles() {
  const holes = [
    { num: '1', hole: 'API keys in frontend code', risk: 'Anyone can view source and steal your keys', fix: 'Move to server-side .env file, use API routes', color: '#ef4444' },
    { num: '2', hole: 'No rate limiting on AI endpoints', risk: 'One user can burn your entire API budget in minutes', fix: 'Add per-user rate limits (e.g. 10 req/min)', color: '#f59e0b' },
    { num: '3', hole: 'No input validation', risk: 'Prompt injection can make your AI do anything', fix: 'Sanitize inputs, use system prompts as guardrails', color: '#ef4444' },
    { num: '4', hole: 'Unencrypted user data', risk: 'Data breach exposes everything in plain text', fix: 'Use Supabase RLS, encrypt sensitive fields', color: '#f59e0b' },
    { num: '5', hole: 'No auth on admin routes', risk: 'Anyone who guesses /admin can access everything', fix: 'Add authentication check on every protected route', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">5 Security Holes in Every Vibe-Coded App</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Know these before you write a single line of code</p>
        <div className="space-y-1.5">
          {holes.map(h => (
            <div key={h.num} className="rounded-[3px] border border-[#e3e3e0] overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: h.color }}>
              <div className="px-4 py-2.5">
                <div className="flex items-start gap-3">
                  <div className="text-xs font-bold min-w-[180px]" style={{ color: h.color }}>{h.hole}</div>
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground">{h.risk}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Fix: {h.fix}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 3: Tool Decision Tree ─── */
export function ToolDecisionTree() {
  const paths = [
    { question: 'Have you coded before?', no: 'Lovable - full apps from English descriptions', yes: 'Next question ↓', color: '#3b82f6' },
    { question: 'Do you want full control?', no: 'Bolt.new - fast prototyping, less config', yes: 'Next question ↓', color: '#8b5cf6' },
    { question: 'Terminal or IDE?', no: 'Cursor - VS Code with AI built in', yes: 'Claude Code - terminal-based, autonomous', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">Pick Your Tool</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Answer three questions, get your starting weapon</p>
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0]" />
          <div className="space-y-2.5">
            {paths.map((p, i) => (
              <div key={i} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-1">
                  <div className="w-[9px] h-[9px] rounded-full" style={{ backgroundColor: p.color }} />
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] p-3">
                  <span className="text-xs font-bold" style={{ color: p.color }}>{p.question}</span>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-[10px] rounded-[3px] bg-red-50 px-2.5 py-1.5"><span className="font-bold text-red-600">No → </span><span className="text-red-800/70">{p.no}</span></div>
                    <div className="text-[10px] rounded-[3px] bg-green-50 px-2.5 py-1.5"><span className="font-bold text-green-600">Yes → </span><span className="text-green-800/70">{p.yes}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] px-4 py-2.5">
          <span className="text-[11px] text-[#37352f]"><strong>Quick UI?</strong> Use v0 by Vercel. Describe any interface in English, get production React components. Great for landing pages and dashboards.</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 4: Multi-Modal AI Stack ─── */
export function MultiModalStack() {
  const modalities = [
    { mode: 'Text', tools: 'Claude, GPT-4, Gemini', cost: '~$3/M input tokens', best: 'Reasoning, analysis, writing', color: '#3b82f6' },
    { mode: 'Image', tools: 'Flux, DALL-E 3', cost: '~$0.04/image', best: 'Product mockups, illustrations', color: '#8b5cf6' },
    { mode: 'Voice', tools: 'ElevenLabs, Whisper', cost: '~$0.18/1K chars', best: 'Narration, transcription', color: '#10b981' },
    { mode: 'Video', tools: 'Luma, Pika, Runway', cost: '~$0.50/5s clip', best: 'Demos, ads, tutorials', color: '#f59e0b' },
    { mode: 'Music', tools: 'Suno, Udio', cost: '~$0.05/song', best: 'Background music, jingles', color: '#ec4899' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">The Multi-Modal AI Stack</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Five modalities you can wire into your app today</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-[#e3e3e0]">
              {['Modality', 'Best Tools', 'Cost', 'Best For'].map(h => (
                <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {modalities.map(m => (
                <tr key={m.mode} className="border-b border-[#e3e3e0]/40">
                  <td className="px-2 py-2 font-bold" style={{ color: m.color }}>{m.mode}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{m.tools}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{m.cost}</td>
                  <td className="px-2 py-2 text-muted-foreground/60">{m.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] px-4 py-2.5">
          <span className="text-[11px] text-[#37352f]"><strong>Winning pattern:</strong> Combine 2+ modalities. Photo of fridge → recipe (text) + voice instructions. Meeting recording (voice) → summary (text) + action items (text) + follow-up email (text).</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 4: Design Checklist ─── */
export function DesignChecklist() {
  const rules = [
    { rule: 'Use a real font', bad: 'System default (Times, Arial)', good: 'Inter, Outfit, or Instrument Sans', color: '#3b82f6' },
    { rule: 'Pick 2 colors max', bad: 'Rainbow of 7 colors', good: 'One primary + one neutral gray', color: '#8b5cf6' },
    { rule: 'Add whitespace', bad: 'Everything crammed together', good: '16-24px padding, 32-48px section gaps', color: '#10b981' },
    { rule: 'Round your corners', bad: 'Sharp 90-degree boxes', good: 'border-radius: 8-12px on cards', color: '#f59e0b' },
    { rule: 'Mobile first', bad: 'Desktop-only layout', good: 'Design for phone, scale up to desktop', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">The 5-Minute Design Upgrade</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Five changes that make any app look professional</p>
        <div className="space-y-2">
          {rules.map(r => (
            <div key={r.rule} className="rounded-[3px] border border-[#e3e3e0] p-3">
              <span className="text-xs font-bold" style={{ color: r.color }}>{r.rule}</span>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <div className="text-[10px] rounded-[3px] bg-red-50 px-2.5 py-1.5"><span className="font-bold text-red-600">Don't: </span><span className="text-red-800/70">{r.bad}</span></div>
                <div className="text-[10px] rounded-[3px] bg-green-50 px-2.5 py-1.5"><span className="font-bold text-green-600">Do: </span><span className="text-green-800/70">{r.good}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 5: Deploy Stack ─── */
export function ShipStack() {
  const layers = [
    { layer: 'Auth', tool: 'Supabase', what: 'Magic links, OAuth, 50K free MAU', color: '#3b82f6' },
    { layer: 'Database', tool: 'Supabase PostgreSQL', what: 'Real-time, row-level security, free 500MB', color: '#8b5cf6' },
    { layer: 'Payments', tool: 'Stripe Checkout', what: '3 lines of code to accept money', color: '#10b981' },
    { layer: 'Hosting', tool: 'Vercel', what: 'Push to GitHub, auto-deploy, free tier', color: '#f59e0b' },
    { layer: 'Domain', tool: 'Cloudflare / Namecheap', what: '$10/year, point DNS at Vercel', color: '#ef4444' },
    { layer: 'Analytics', tool: 'PostHog / Plausible', what: 'Privacy-friendly, see what users do', color: '#ec4899' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">The Ship Stack</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Everything you need to go from localhost to production</p>
        <div className="space-y-1.5">
          {layers.map(l => (
            <div key={l.layer} className="rounded-[3px] border border-[#e3e3e0] overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: l.color }}>
              <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                <div>
                  <span className="text-xs font-bold" style={{ color: l.color }}>{l.layer}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">{l.tool}</span>
                </div>
                <span className="text-[10px] text-muted-foreground/60">{l.what}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 6: Growth Channels ─── */
export function GrowthChannels() {
  const channels = [
    { channel: 'Reddit', effort: '30 min', reach: 'High', tip: 'Add value first. Answer questions in your niche for a week, then share your tool.', color: '#ef4444' },
    { channel: 'Product Hunt', effort: '2 hours', reach: 'Medium', tip: 'Even a soft launch gets 100+ views. Use a clear tagline and 3 screenshots.', color: '#f59e0b' },
    { channel: 'Cold DMs', effort: '1 hour', reach: 'Low but targeted', tip: 'Personalize every message. Mention something specific about them.', color: '#3b82f6' },
    { channel: 'Build in Public', effort: '15 min/day', reach: 'Compounds', tip: 'Post what you shipped + screenshot + what you learned. Daily.', color: '#10b981' },
    { channel: 'Word of Mouth', effort: '0 min', reach: 'Highest quality', tip: 'Ask every tester to invite one friend. That is it.', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">5 Channels to Get Your First 25 Users</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Ranked by effort vs reach for solo founders</p>
        <div className="space-y-1.5">
          {channels.map(c => (
            <div key={c.channel} className="rounded-[3px] border border-[#e3e3e0] px-4 py-2.5" style={{ borderLeftWidth: '3px', borderLeftColor: c.color }}>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold min-w-[110px]" style={{ color: c.color }}>{c.channel}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#f7f6f3] text-muted-foreground whitespace-nowrap">{c.effort}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: c.color + '12', color: c.color }}>{c.reach}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{c.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 7: Pricing Models ─── */
export function PricingModels() {
  const models = [
    { model: 'Subscription', example: '$19/month', when: 'Used daily, predictable value', pros: 'Stable revenue, easy to forecast', cons: 'Higher churn if not sticky', color: '#3b82f6' },
    { model: 'Usage-based', example: '$0.10/doc', when: 'High API costs, variable use', pros: 'Fair, scales with value', cons: 'Unpredictable revenue', color: '#8b5cf6' },
    { model: 'Freemium', example: '10 free/mo, $9 unlimited', when: 'Need growth, viral product', pros: 'Low barrier, word of mouth', cons: 'Hard to convert free users', color: '#10b981' },
    { model: 'One-time', example: '$49 lifetime', when: 'Simple tool, clear scope', pros: 'Easy sell, no churn', cons: 'No recurring revenue', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">4 Pricing Models for AI Apps</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Pick one. You can change it later.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {models.map(m => (
            <div key={m.model} className="rounded-[3px] border border-[#e3e3e0] overflow-hidden" style={{ borderTopWidth: '3px', borderTopColor: m.color }}>
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: m.color }}>{m.model}</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: m.color }}>{m.example}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-1.5">{m.when}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="text-[10px] rounded-[3px] bg-green-50 px-2 py-1"><span className="font-bold text-green-600">+ </span><span className="text-green-800/70">{m.pros}</span></div>
                  <div className="text-[10px] rounded-[3px] bg-red-50 px-2 py-1"><span className="font-bold text-red-600">- </span><span className="text-red-800/70">{m.cons}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 7: Ramen Profitable Calculator ─── */
export function RamenMath() {
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">The Ramen Profitable Math</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">From Paul Graham - the minimum to keep building</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-[3px] border-2 border-red-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-500 font-mono">$2,000</div>
            <div className="text-[10px] text-muted-foreground mt-1">Your monthly costs</div>
            <div className="text-[10px] text-muted-foreground/60">Server + API + domain + food</div>
          </div>
          <div className="rounded-[3px] border-2 border-blue-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-500 font-mono">$20/mo</div>
            <div className="text-[10px] text-muted-foreground mt-1">Your price point</div>
            <div className="text-[10px] text-muted-foreground/60">After API costs per user</div>
          </div>
          <div className="rounded-[3px] border-2 border-emerald-200 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-500 font-mono">100</div>
            <div className="text-[10px] text-muted-foreground mt-1">Users needed</div>
            <div className="text-[10px] text-muted-foreground/60">To cover costs and keep going</div>
          </div>
        </div>
        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] px-4 py-2.5">
          <span className="text-[11px] text-[#37352f]"><strong>Do this math before launch.</strong> If your API costs $0.50/user/month and you charge $20/month, your real margin is $19.50. At $2000/month expenses you need 103 users. If API costs are $5/user/month, you need 134 users. Big difference.</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Day 7: Pitch Deck Structure ─── */
export function PitchDeckStructure() {
  const slides = [
    { num: '01', slide: 'Title', tip: 'Name, tagline, your name. 10 words max.', time: '10s', color: '#6b7280' },
    { num: '02', slide: 'Problem', tip: 'Make them feel the pain. One specific story.', time: '60s', color: '#ef4444' },
    { num: '03', slide: 'Solution', tip: 'Your product. One screenshot. One sentence.', time: '30s', color: '#3b82f6' },
    { num: '04', slide: 'Why Now', tip: 'What changed? New tech, new regulation, new behavior.', time: '20s', color: '#8b5cf6' },
    { num: '05', slide: 'Market', tip: 'TAM/SAM/SOM. Be honest about your starting wedge.', time: '20s', color: '#10b981' },
    { num: '06', slide: 'Demo', tip: 'Live demo or 30-second video. Show, don\'t tell.', time: '60s', color: '#f59e0b' },
    { num: '07', slide: 'Business Model', tip: 'How you make money. Pricing + unit economics.', time: '20s', color: '#06b6d4' },
    { num: '08', slide: 'Traction', tip: 'Real numbers. Even small ones. 47 users > 0 users.', time: '30s', color: '#10b981' },
    { num: '09', slide: 'Team', tip: 'Why you? What have you built before?', time: '15s', color: '#ec4899' },
    { num: '10', slide: 'Ask', tip: 'How much. What for. Be specific.', time: '15s', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f]">The 10-Slide Pitch Deck</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Sequoia format - fits in a 5-minute pitch</p>
        <div className="space-y-1">
          {slides.map(s => (
            <div key={s.num} className="rounded-[3px] border border-[#e3e3e0] px-4 py-2 flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold text-muted-foreground/40 min-w-[20px]">{s.num}</span>
              <span className="text-xs font-bold min-w-[100px]" style={{ color: s.color }}>{s.slide}</span>
              <span className="text-[10px] text-muted-foreground flex-1">{s.tip}</span>
              <span className="text-[9px] font-mono text-muted-foreground/40 hidden md:block">{s.time}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
