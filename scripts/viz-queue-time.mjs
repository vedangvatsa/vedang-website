// Dependency-free timing shared by the lightweight workflow gate and publishers.
export function selectDuePost(posts, now = new Date()) {
  const due = posts.filter(p => Date.parse(`${p.scheduleDate}T${p.scheduleTime}:00+05:30`) <= now.getTime())
    .sort((a, b) => `${a.scheduleDate} ${a.scheduleTime}`.localeCompare(`${b.scheduleDate} ${b.scheduleTime}`));
  if (!due.length) return {};
  const ist = new Date(now.getTime() + 5.5 * 3600000);
  let day = ist.toISOString().slice(0, 10);
  const time = ist.toISOString().slice(11, 16);
  const times = [...new Set(posts.map(p => p.scheduleTime))].sort();
  let slotTime = times.filter(t => t <= time).at(-1);
  if (!slotTime) {
    day = new Date(ist.getTime() - 86400000).toISOString().slice(0, 10);
    slotTime = times.at(-1);
  }
  const slot = `${day}T${slotTime}`;
  const blocked = posts.find(p => !p.posted && ['publishing', 'uncertain', 'failed', 'submitted'].includes(p.state || ''));
  if (blocked) throw new Error(`${blocked.id} is ${blocked.state}; reconcile it before sending another video`);
  if (posts.some(p => p.attemptedSlot === slot)) return { slot };
  return { slot, post: due.find(p => !p.posted) };
}

export function needsBufferWork(posts, now = new Date()) {
  // Accepted posts need status reconciliation even before another slot is due.
  if (posts.some(p => p.bufferPostId && !p.posted && p.state !== 'failed')) return true;
  return Boolean(selectDuePost(posts, now).post);
}
