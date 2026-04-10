/* ── LearnTogether — app.js ── */

// ── SEED DATA ──────────────────────────────────────────────────
const TOPICS = [
  { icon: '💻', label: 'Programming' },
  { icon: '🎨', label: 'Design' },
  { icon: '📐', label: 'Mathematics' },
  { icon: '🔬', label: 'Science' },
  { icon: '🗣️', label: 'Language' },
  { icon: '🎵', label: 'Music' },
  { icon: '📊', label: 'Business' },
  { icon: '🖌️', label: 'Art' },
];

const HOSTS = ['Alex M.', 'Priya S.', 'Daniel K.', 'Yuki T.', 'Sarah L.', 'Ravi P.', 'Mia C.', 'Omar F.'];
const AVATARS = ['AM','PS','DK','YT','SL','RP','MC','OF'];

const SEED_SESSIONS = [
  { id: 1, title: 'Python for Absolute Beginners', topic: 'Programming', host: 'Alex M.', hostAvatar: 'AM', level: 'Beginner', date: futureDateStr(1), time: '10:00', duration: 60, max: 8, joined: 3, desc: 'We will cover Python basics: variables, loops, functions, and write a small project together. No prior experience needed!', link: 'https://meet.google.com/example' },
  { id: 2, title: 'Figma UI Design Crash Course', topic: 'Design', host: 'Priya S.', hostAvatar: 'PS', level: 'Beginner', date: futureDateStr(2), time: '15:00', duration: 90, max: 10, joined: 7, desc: 'Learn Figma from scratch. We will design a mobile app screen together, covering frames, components, and auto layout.', link: '' },
  { id: 3, title: 'Calculus Intuition Made Simple', topic: 'Mathematics', host: 'Daniel K.', hostAvatar: 'DK', level: 'Intermediate', date: futureDateStr(1), time: '18:00', duration: 75, max: 6, joined: 4, desc: 'Struggling with derivatives and integrals? Let\'s build visual intuition using graphs and real-world examples.', link: '' },
  { id: 4, title: 'Spanish Conversation Practice', topic: 'Language', host: 'Mia C.', hostAvatar: 'MC', level: 'Beginner', date: futureDateStr(3), time: '09:00', duration: 45, max: 5, joined: 2, desc: 'Casual Spanish speaking practice for beginners. We will talk about everyday topics: food, travel, family. ¡Vamos!', link: '' },
  { id: 5, title: 'React Hooks Deep Dive', topic: 'Programming', host: 'Yuki T.', hostAvatar: 'YT', level: 'Intermediate', date: futureDateStr(4), time: '20:00', duration: 90, max: 12, joined: 9, desc: 'Explore useState, useEffect, useContext, and custom hooks with live coding. Bring questions and your projects!', link: '' },
  { id: 6, title: 'Music Theory Fundamentals', topic: 'Music', host: 'Sarah L.', hostAvatar: 'SL', level: 'Beginner', date: futureDateStr(2), time: '17:00', duration: 60, max: 8, joined: 5, desc: 'From notes to chords and scales — we cover the building blocks of music theory in a fun, practical way.', link: '' },
  { id: 7, title: 'Watercolor Painting: Basics', topic: 'Art', host: 'Omar F.', hostAvatar: 'OF', level: 'Beginner', date: futureDateStr(5), time: '11:00', duration: 90, max: 6, joined: 1, desc: 'Learn watercolor techniques: washes, blending, and layering. We\'ll paint a simple landscape together.', link: '' },
  { id: 8, title: 'Startup Pitch: How to Tell Your Story', topic: 'Business', host: 'Ravi P.', hostAvatar: 'RP', level: 'Advanced', date: futureDateStr(3), time: '14:00', duration: 60, max: 10, joined: 6, desc: 'Craft a compelling startup pitch. We\'ll cover storytelling, slide structure, and do live pitch practice with feedback.', link: '' },
];

function futureDateStr(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

// ── STATE ──────────────────────────────────────────────────────
let state = {
  sessions: JSON.parse(localStorage.getItem('lt_sessions') || 'null') || SEED_SESSIONS,
  nextId: parseInt(localStorage.getItem('lt_nextId') || '9'),
  joinedSessions: JSON.parse(localStorage.getItem('lt_joined') || '[]'),
  skills: JSON.parse(localStorage.getItem('lt_skills') || '["JavaScript","Design Thinking"]'),
  goals: JSON.parse(localStorage.getItem('lt_goals') || '["Learn Python","Improve Spanish"]'),
  activeFilter: null,
};

function save() {
  localStorage.setItem('lt_sessions', JSON.stringify(state.sessions));
  localStorage.setItem('lt_nextId', state.nextId);
  localStorage.setItem('lt_joined', JSON.stringify(state.joinedSessions));
  localStorage.setItem('lt_skills', JSON.stringify(state.skills));
  localStorage.setItem('lt_goals', JSON.stringify(state.goals));
}

// ── NAVIGATION ─────────────────────────────────────────────────
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  document.querySelectorAll(`[data-page="${page}"]`).forEach(l => l.classList.add('active'));

  if (page === 'home') renderHome();
  if (page === 'sessions') renderAllSessions();
  if (page === 'profile') renderProfile();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(link.dataset.page);
  });
});

// ── HOME ───────────────────────────────────────────────────────
function renderHome() {
  animateCounter('statLearners', 0, 1240, 1200);
  animateCounter('statSessions', 0, state.sessions.length, 800);
  animateCounter('statTopics', 0, TOPICS.length, 600);
  renderTopics();
  renderHomeSessionCards();
}

function animateCounter(id, start, end, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + (end - start) * ease).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function renderTopics() {
  const grid = document.getElementById('topicsGrid');
  if (!grid) return;
  grid.innerHTML = TOPICS.map(t => `
    <div class="topic-chip" onclick="filterByTopic('${t.label}')">
      <span class="icon">${t.icon}</span> ${t.label}
    </div>
  `).join('');
}

function filterByTopic(label) {
  navigateTo('sessions');
  setTimeout(() => {
    state.activeFilter = label;
    renderFilterChips();
    renderAllSessions();
  }, 50);
}

function renderHomeSessionCards() {
  const grid = document.getElementById('homeSessionsGrid');
  if (!grid) return;
  const upcoming = [...state.sessions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
  grid.innerHTML = upcoming.map(s => sessionCardHTML(s)).join('');
}

// ── SESSIONS PAGE ──────────────────────────────────────────────
function renderAllSessions() {
  renderFilterChips();
  const query = (document.getElementById('searchInput')?.value || '').toLowerCase();
  let filtered = state.sessions.filter(s => {
    const matchQuery = !query || s.title.toLowerCase().includes(query) || s.topic.toLowerCase().includes(query) || s.host.toLowerCase().includes(query);
    const matchFilter = !state.activeFilter || s.topic === state.activeFilter;
    return matchQuery && matchFilter;
  });
  filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

  const grid = document.getElementById('allSessionsGrid');
  if (!grid) return;
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results"><div class="icon">🔍</div><p>No sessions found. Try a different search!</p></div>`;
  } else {
    grid.innerHTML = filtered.map(s => sessionCardHTML(s)).join('');
  }
}

function renderFilterChips() {
  const container = document.getElementById('filterChips');
  if (!container) return;
  container.innerHTML = TOPICS.map(t => `
    <div class="filter-chip ${state.activeFilter === t.label ? 'active' : ''}" onclick="setFilter('${t.label}')">
      ${t.icon} ${t.label}
    </div>
  `).join('');
}

function setFilter(label) {
  state.activeFilter = state.activeFilter === label ? null : label;
  renderAllSessions();
}

function filterSessions() { renderAllSessions(); }

// ── SESSION CARD HTML ──────────────────────────────────────────
function sessionCardHTML(s) {
  const spotsLeft = s.max - s.joined;
  const isFull = spotsLeft <= 0;
  const isJoined = state.joinedSessions.includes(s.id);
  const dateStr = new Date(s.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  return `
    <div class="session-card" onclick="openSession(${s.id})">
      <div class="card-topic">${topicIcon(s.topic)} ${s.topic}</div>
      <div class="card-title">${s.title}</div>
      <div class="card-host">by ${s.host}</div>
      <div class="card-meta">
        <span class="meta-tag level">${s.level}</span>
        <span class="meta-tag">📅 ${dateStr} · ${formatTime(s.time)}</span>
        <span class="meta-tag">⏱ ${s.duration}m</span>
      </div>
      <div class="card-footer">
        <div class="spots-left"><span>${spotsLeft}</span> spots left</div>
        <button class="join-btn" ${isFull || isJoined ? 'disabled' : ''} onclick="event.stopPropagation(); quickJoin(${s.id})">
          ${isJoined ? '✓ Joined' : isFull ? 'Full' : 'Join'}
        </button>
      </div>
    </div>
  `;
}

function topicIcon(topic) {
  const t = TOPICS.find(x => x.label === topic);
  return t ? t.icon : '📚';
}

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`;
}

// ── SESSION MODAL ──────────────────────────────────────────────
function openSession(id) {
  const s = state.sessions.find(x => x.id === id);
  if (!s) return;
  const spotsLeft = s.max - s.joined;
  const isFull = spotsLeft <= 0;
  const isJoined = state.joinedSessions.includes(s.id);
  const dateStr = new Date(s.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-topic">${topicIcon(s.topic)} ${s.topic} · ${s.level}</div>
    <div class="modal-title">${s.title}</div>
    <div class="modal-host">Hosted by ${s.host}</div>
    <div class="modal-desc">${s.desc}</div>
    <div class="modal-details">
      <div class="modal-detail">
        <div class="modal-detail-label">📅 Date</div>
        <div class="modal-detail-value">${dateStr}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">🕐 Time</div>
        <div class="modal-detail-value">${formatTime(s.time)}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">⏱ Duration</div>
        <div class="modal-detail-value">${s.duration} minutes</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">👥 Spots</div>
        <div class="modal-detail-value">${spotsLeft} of ${s.max} left</div>
      </div>
    </div>
    <button class="modal-join-btn" ${isFull || isJoined ? 'disabled style="background:var(--surface2);color:var(--muted);cursor:not-allowed"' : ''} onclick="joinSession(${s.id})">
      ${isJoined ? '✓ Already Joined' : isFull ? 'Session Full' : '✦ Join This Session'}
    </button>
  `;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function joinSession(id) {
  const s = state.sessions.find(x => x.id === id);
  if (!s || state.joinedSessions.includes(id)) return;
  s.joined++;
  state.joinedSessions.push(id);
  save();
  closeModal();
  showToast('🎉 You joined "' + s.title + '"!', 'success');
  renderAllSessions();
  renderHomeSessionCards();
}

function quickJoin(id) {
  const s = state.sessions.find(x => x.id === id);
  if (!s || state.joinedSessions.includes(id) || s.joined >= s.max) return;
  s.joined++;
  state.joinedSessions.push(id);
  save();
  showToast('🎉 Joined "' + s.title + '"!', 'success');
  renderAllSessions();
  renderHomeSessionCards();
}

// ── CREATE SESSION ─────────────────────────────────────────────
function createSession(e) {
  e.preventDefault();
  const newSession = {
    id: state.nextId++,
    title: document.getElementById('sessionTitle').value,
    topic: document.getElementById('sessionTopic').value,
    level: document.getElementById('sessionLevel').value,
    date: document.getElementById('sessionDate').value,
    time: document.getElementById('sessionTime').value,
    duration: parseInt(document.getElementById('sessionDuration').value),
    max: parseInt(document.getElementById('sessionMax').value),
    joined: 0,
    desc: document.getElementById('sessionDesc').value,
    link: document.getElementById('sessionLink').value,
    host: 'John Student',
    hostAvatar: 'JS',
    isOwn: true,
  };
  state.sessions.push(newSession);
  save();
  document.getElementById('teachForm').reset();
  showToast('✦ Session created successfully!', 'success');
  setTimeout(() => navigateTo('profile'), 800);
}

// ── PROFILE ────────────────────────────────────────────────────
function renderProfile() {
  renderSkills();
  renderGoals();
  renderMySessions();
}

function renderSkills() {
  const list = document.getElementById('skillsList');
  if (!list) return;
  list.innerHTML = state.skills.map((s, i) => `
    <div class="skill-tag">${s}<span class="remove" onclick="removeSkill(${i})">✕</span></div>
  `).join('') || '<span style="color:var(--muted);font-size:0.85rem">No skills added yet</span>';
}

function renderGoals() {
  const list = document.getElementById('goalsList');
  if (!list) return;
  list.innerHTML = state.goals.map((g, i) => `
    <div class="goal-tag">${g}<span class="remove" onclick="removeGoal(${i})" style="cursor:pointer;color:var(--muted);font-size:0.75rem;margin-left:6px;">✕</span></div>
  `).join('') || '<span style="color:var(--muted);font-size:0.85rem">No goals added yet</span>';
}

function addSkill() {
  const input = document.getElementById('skillInput');
  const val = input.value.trim();
  if (!val || state.skills.includes(val)) { showToast('Already added or empty'); return; }
  state.skills.push(val);
  input.value = '';
  save();
  renderSkills();
}

function removeSkill(i) {
  state.skills.splice(i, 1);
  save();
  renderSkills();
}

function addGoal() {
  const input = document.getElementById('goalInput');
  const val = input.value.trim();
  if (!val || state.goals.includes(val)) { showToast('Already added or empty'); return; }
  state.goals.push(val);
  input.value = '';
  save();
  renderGoals();
}

function removeGoal(i) {
  state.goals.splice(i, 1);
  save();
  renderGoals();
}

function renderMySessions() {
  const list = document.getElementById('mySessionsList');
  if (!list) return;
  const joinedSessions = state.sessions.filter(s => state.joinedSessions.includes(s.id));
  const ownSessions = state.sessions.filter(s => s.isOwn);
  const all = [...ownSessions, ...joinedSessions.filter(s => !s.isOwn)];

  if (all.length === 0) {
    list.innerHTML = '<div class="empty-state">You haven\'t joined or created any sessions yet.</div>';
    return;
  }
  list.innerHTML = all.map(s => `
    <div class="my-session-item">
      <div class="my-session-info">
        <h4>${s.title}</h4>
        <p>${topicIcon(s.topic)} ${s.topic} · ${new Date(s.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} · ${formatTime(s.time)}</p>
      </div>
      <div class="my-session-status">${s.isOwn ? 'Hosting' : 'Joined'}</div>
    </div>
  `).join('');
}

// ── TOAST ──────────────────────────────────────────────────────
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => { t.classList.remove('show'); }, 2800);
}

// ── SKILL INPUT ENTER KEY ──────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (document.activeElement.id === 'skillInput') addSkill();
    if (document.activeElement.id === 'goalInput') addGoal();
  }
});

// ── SET MIN DATE FOR FORM ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('sessionDate');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  renderHome();
});
