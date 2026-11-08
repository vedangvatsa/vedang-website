// Dependency-free timing shared by the lightweight workflow gate and publishers.
export function selectDuePost(posts, now = new Date()) {
  const active = posts.filter(p => p.paused !== true);
  const due = active.filter(p => Date.parse(`${p.scheduleDate}T${p.scheduleTime}:00+05:30`) <= now.getTime())
    .sort((a, b) => `${a.scheduleDate} ${a.scheduleTime}`.localeCompare(`${b.scheduleDate} ${b.scheduleTime}`));
  if (!due.length) return {};
  const ist = new Date(now.getTime() + 5.5 * 3600000);
  let day = ist.toISOString().slice(0, 10);
  const time = ist.toISOString().slice(11, 16);
  const unpostedActive = active.filter(p => !p.posted);
  const times = [...new Set((unpostedActive.length ? unpostedActive : active).map(p => p.scheduleTime))].sort();
  let slotTime = times.filter(t => t <= time).at(-1);
  if (!slotTime) {
    day = new Date(ist.getTime() - 86400000).toISOString().slice(0, 10);
    slotTime = times.at(-1);
  }
  const slot = `${day}T${slotTime}`;
  const blocked = active.find(p => !p.posted && ['publishing', 'uncertain', 'failed', 'submitted'].includes(p.state || ''));
  if (blocked) throw new Error(`${blocked.id} is ${blocked.state}; reconcile it before sending another video`);
  if (posts.some(p => p.attemptedSlot === slot)) return { slot };

  // COOLDOWN: enforce an 8-hour gap between posts (with a 7-hour minimum buffer for cron jitter).
  // Overridable via VIZ_COOLDOWN_HOURS env var (e.g. set to '0' in tests).
  const cooldownHours = Number(process.env.VIZ_COOLDOWN_HOURS ?? '7');
  if (cooldownHours > 0) {
    const minGapMs = cooldownHours * 3600000;
    const recentlyAttempted = posts.some(p => {
      const ts = p.attemptedAt || p.postedAt;
      if (!ts) return false;
      const t = Date.parse(ts);
      return Number.isFinite(t) && (now.getTime() - t) < minGapMs;
    });
    if (recentlyAttempted) return { slot };
  }

  return { slot, post: due.find(p => !p.posted) };
}

export function needsBufferWork(posts, now = new Date()) {
  // Accepted posts need status reconciliation even before another slot is due,
  // but only if attempted recently (within 2 hours) to avoid hammering APIs on stale entries.
  const hasRecentPending = posts.some(p => {
    if (p.paused || !p.bufferPostId || p.posted || p.state === 'failed') return false;
    if (!p.attemptedAt) return true;
    return (now.getTime() - Date.parse(p.attemptedAt)) < 2 * 3600000;
  });
  if (hasRecentPending) return true;
  return Boolean(selectDuePost(posts, now).post);
}
