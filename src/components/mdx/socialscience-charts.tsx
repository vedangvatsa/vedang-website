'use client';

import React from 'react';

/* ─── Data Source Disruption ─── */
export function DataSourceDisruption() {
  const sources = [
    { platform: 'Twitter/X', status: 'Restricted', cost: '$42K/mo', papers: '25,000+', impact: 'Primary source lost for most researchers', color: '#18181b' },
    { platform: 'Meta (FB/IG)', status: 'Limited partnerships', cost: 'Application-based', papers: '15,000+', impact: '2023 Science studies via Meta partnership', color: '#18181b' },
    { platform: 'Reddit', status: 'Restricted (2023)', cost: '$0.24/1K API calls', papers: '10,000+', impact: 'Pushshift archive shut down', color: '#52525b' },
    { platform: 'Bluesky', status: 'Open (AT Protocol)', cost: 'Free', papers: 'Emerging', impact: 'Decentralized, firehose API available', color: '#3f3f46' },
    { platform: 'Mastodon', status: 'Open (ActivityPub)', cost: 'Free', papers: 'Growing', impact: 'Federated, instance-level access', color: '#71717a' },
    { platform: 'TikTok', status: 'Minimal', cost: 'Research API (limited)', papers: '2,000+', impact: 'Most studied via scraping, not API', color: '#a1a1aa' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">The Data Access Crisis</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Platform API access for academic researchers (2025)</p>

        <div className="space-y-2">
          {sources.map((s) => (
            <div key={s.platform} className="rounded-[3px] border border-[#e3e3e0] p-3" style={{ borderLeftWidth: '3px', borderLeftColor: s.color }}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-[#37352f]">{s.platform}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: s.color + '15', color: s.color }}>{s.status}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-[9px]">
                <div><span className="text-muted-foreground">Cost:</span> <span className="font-medium text-[#37352f]">{s.cost}</span></div>
                <div><span className="text-muted-foreground">Papers built on:</span> <span className="font-medium text-[#37352f]">{s.papers}</span></div>
                <div><span className="text-muted-foreground">Impact:</span> <span className="font-medium" style={{ color: s.color }}>{s.impact}</span></div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: ICWSM conference proceedings, Twitter/X developer portal, Reddit API documentation. Paper counts are estimates from Google Scholar.
        </p>
      </div>
    </figure>
  );
}

/* ─── Methodological Evolution ─── */
export function MethodologicalEvolution() {
  const methods = [
    { name: 'API Scraping (traditional)', era: '2006-2023', scale: 'Millions of posts', privacy: 'Public data', limitation: 'Platform-dependent, shut down', maturity: 90, declining: true, color: '#a1a1aa' },
    { name: 'Browser Extension Studies', era: '2020-present', scale: 'Thousands of participants', privacy: 'Informed consent', limitation: 'Small sample, self-selection bias', maturity: 65, declining: false, color: '#18181b' },
    { name: 'Data Donation (GDPR Art. 15)', era: '2021-present', scale: 'Hundreds to thousands', privacy: 'User-controlled export', limitation: 'Very small scale, labor-intensive', maturity: 45, declining: false, color: '#3f3f46' },
    { name: 'LLM Digital Twins', era: '2023-present', scale: 'Unlimited synthetic agents', privacy: 'No real users exposed', limitation: 'Validity of synthetic behavior', maturity: 30, declining: false, color: '#71717a' },
    { name: 'Algorithmic Auditing', era: '2019-present', scale: 'Controlled experiments', privacy: 'Researcher-created accounts', limitation: 'Platform detection, ToS violations', maturity: 55, declining: false, color: '#52525b' },
    { name: 'Platform Partnerships', era: '2018-present', scale: 'Millions (platform-controlled)', privacy: 'NDA-governed', limitation: 'Corporate veto on findings', maturity: 40, declining: false, color: '#a1a1aa' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Methodological Evolution</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">How CSS adapted after the API shutdown</p>

        <div className="space-y-3">
          {methods.map((m) => (
            <div key={m.name}>
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <span className="text-[11px] font-bold text-[#37352f]">{m.name}</span>
                  {m.declining && <span className="text-[8px] ml-1.5 px-1.5 py-0.5 rounded-full font-bold bg-[#f4f4f5] text-[#18181b]">declining</span>}
                </div>
                <span className="text-[9px] text-muted-foreground">{m.era}</span>
              </div>
              <div className="w-full h-2.5 bg-[#f7f6f3] rounded-md overflow-hidden mb-1">
                <div className="h-full rounded-md" style={{ width: `${m.maturity}%`, backgroundColor: m.color, opacity: 0.5 }} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-[9px]">
                <div><span className="text-muted-foreground">Scale:</span> <span className="text-[#37352f]">{m.scale}</span></div>
                <div><span className="text-muted-foreground">Privacy:</span> <span className="text-[#37352f]">{m.privacy}</span></div>
                <div><span className="text-muted-foreground">Limitation:</span> <span className="text-muted-foreground">{m.limitation}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Polarization Research Findings ─── */
export function PolarizationFindings() {
  const findings = [
    { study: 'Meta/Science (2023): Chronological feed', n: '23,000', finding: 'Algorithmic feed ↑ ideological sorting; chronological feed did not ↓ polarization', implication: 'Short-term manipulation ≠ attitude change', color: '#18181b' },
    { study: 'Meta/Science (2023): Remove reshares', n: '23,000', finding: 'Removing reshared content ↓ political news & misinformation exposure significantly', implication: 'Reshare mechanism is the primary amplification vector', color: '#3f3f46' },
    { study: 'Meta/Science (2023): Like-minded sources', n: '23,000', finding: 'Reducing like-minded content ↓ news from untrustworthy sources', implication: 'Echo chambers are algorithmically maintained', color: '#52525b' },
    { study: 'Bail et al. (2018): Cross-cutting exposure', n: '1,220', finding: 'Exposure to opposing views ↑ polarization (for Republicans)', implication: 'More information ≠ less polarization', color: '#a1a1aa' },
    { study: 'Allcott et al. (2020): Facebook deactivation', n: '2,743', finding: '4-week deactivation ↓ political knowledge, ↓ polarization slightly', implication: 'Platform use maintains engagement in political discourse', color: '#71717a' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">What the Research Actually Shows</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Landmark CSS studies on algorithmic polarization</p>

        <div className="space-y-2.5">
          {findings.map((f) => (
            <div key={f.study} className="rounded-[3px] border border-[#e3e3e0] p-3" style={{ borderLeftWidth: '3px', borderLeftColor: f.color }}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[10px] font-bold text-[#37352f]">{f.study}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: f.color + '12', color: f.color }}>n={f.n}</span>
              </div>
              <p className="text-[10px] text-[#37352f] mb-0.5">{f.finding}</p>
              <p className="text-[9px] text-muted-foreground italic">{f.implication}</p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Science (2023), PNAS (2018, 2020). Meta studies conducted during 2020 US election cycle.
        </p>
      </div>
    </figure>
  );
}

/* ─── Observer Effect ─── */
export function ObserverEffectChart() {
  const biases = [
    { platform: 'Twitter/X', designBias: 'Brevity (280 chars), public performance', algorithmicBias: 'Engagement optimization → outrage amplification', populationBias: 'Younger, male, urban, politically engaged', color: '#18181b' },
    { platform: 'Facebook', designBias: 'Social graph, reshare mechanics', algorithmicBias: 'Predicted engagement → ideological sorting', populationBias: 'Older, broader demographics, declining youth', color: '#18181b' },
    { platform: 'TikTok', designBias: 'Short video, low-friction creation', algorithmicBias: 'Watch time optimization → sensationalism', populationBias: 'Gen Z / Gen Alpha, global', color: '#a1a1aa' },
    { platform: 'Reddit', designBias: 'Pseudonymous, community-gated', algorithmicBias: 'Upvote sorting → popularity bias', populationBias: 'Male-skewed, tech-literate, Western', color: '#52525b' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">The Observer Effect at Platform Scale</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">How platform design distorts the behavior it measures</p>

        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-[90px_1fr_1fr_1fr] gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Platform</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Design Bias</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Algorithmic Bias</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Population Bias</span>
            </div>
            {biases.map((b) => (
              <div key={b.platform} className="grid grid-cols-[90px_1fr_1fr_1fr] gap-2 border-t border-[#e3e3e0] py-2">
                <span className="text-[11px] font-bold" style={{ color: b.color }}>{b.platform}</span>
                <span className="text-[10px] text-[#37352f]">{b.designBias}</span>
                <span className="text-[10px] text-[#37352f]">{b.algorithmicBias}</span>
                <span className="text-[10px] text-muted-foreground">{b.populationBias}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Twitter sentiment is the sentiment of people who express opinions on Twitter, filtered by an algorithm that amplifies emotionally charged content.
        </p>
      </div>
    </figure>
  );
}
