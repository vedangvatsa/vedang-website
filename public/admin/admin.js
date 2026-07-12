// admin.js – client side logic for the admin UI
// Uses FullCalendar (already loaded via CDN in index.html) and the password‑protected API.

// Prompt for password (simple demo). In production replace with a proper login UI.
const password = prompt('Enter admin password');
if (!password) {
  alert('Access denied');
  document.body.innerHTML = '<h2 style="color:red;text-align:center;margin-top:2rem;">Access denied</h2>';
  throw new Error('No password');
}

// Helper to call the API with Authorization header
async function apiFetch(method, platform, data = null) {
  const url = `/api/admin/posts?platform=${platform}`;
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: password,
    },
  };
  if (data) opts.body = JSON.stringify(data);
  const resp = await fetch(url, opts);
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`API error ${resp.status}: ${err}`);
  }
  return resp.json();
}

// Initialize FullCalendar
function initCalendar(events) {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    selectable: true,
    editable: true,
    events,
    eventClick: async info => {
      const { id, title, start, extendedProps } = info.event;
      const newText = prompt('Edit post text', title);
      if (newText === null) return; // cancelled
      // Update the event locally
      info.event.setProp('title', newText);
      // Save back to JSON
      await saveAllEvents();
    },
    select: async (info) => {
      const text = prompt('New post text');
      if (!text) return;
      const newEvent = {
        id: Date.now().toString(),
        title: text,
        start: info.startStr,
        end: info.endStr,
        extendedProps: { platform: 'linkedin' }, // default; you can change later via UI
      };
      calendar.addEvent(newEvent);
      await saveAllEvents();
    },
  });
  calendar.render();
  // Expose for later saving
  window.__adminCalendar = calendar;
}

// Convert JSON posts (array) to FullCalendar event format
function postsToEvents(posts) {
  return posts.map(p => ({
    id: p.id,
    title: p.text,
    start: `${p.scheduleDate}T${p.scheduleTime}`,
    extendedProps: { platform: p.platform || 'linkedin' },
  }));
}

// Convert FullCalendar events back to the JSON schema expected by the scheduler scripts
function eventsToPosts(events) {
  return events.map(ev => ({
    id: ev.id,
    text: ev.title,
    scheduleDate: ev.startStr.split('T')[0],
    scheduleTime: ev.startStr.split('T')[1] || '09:00',
    posted: false,
    // Preserve any media path if it exists in extendedProps
    image: ev.extendedProps?.image,
    video: ev.extendedProps?.video,
    platform: ev.extendedProps?.platform || 'linkedin',
  }));
}

async function loadAndRender() {
  // Load posts for each platform we support – here we demo LinkedIn only.
  const platform = 'linkedin';
  const posts = await apiFetch('GET', platform);
  const events = postsToEvents(posts.map(p => ({...p, platform })));
  initCalendar(events);
}

async function saveAllEvents() {
  const calendar = window.__adminCalendar;
  const events = calendar.getEvents().map(ev => ev.toPlainObject());
  const posts = eventsToPosts(events);
  // For simplicity we post the whole array back for the selected platform (LinkedIn).
  await apiFetch('PUT', 'linkedin', posts);
}

// Kick off
loadAndRender().catch(err => {
  console.error(err);
  alert('Failed to load posts: ' + err.message);
});
