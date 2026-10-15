// ========================================================
// ORACLE AI - CHAT HISTORY
// Stores conversations in Supabase (oracle_conversations / oracle_messages).
// Automatically falls back to browser localStorage if the database or its
// tables are unreachable, so history never silently disappears.
// ========================================================

const OracleHistory = (() => {
  const SUPABASE_URL = 'https://phapzopmnlbidrlacsfc.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_kuQMzUN56wuLH2OsziqaIQ__rl_q4DN';
  const LOCAL_KEY = 'oracle_history_local';

  let client = null;
  let remoteOk = false;      // true once a remote call has succeeded
  let remoteFailed = false;  // true after a remote error -> use localStorage
  let currentId = null;
  let busy = Promise.resolve(); // serialises writes so message order is kept

  // ---------- helpers ----------
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() :
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    }));

  function getClient() {
    if (client) return client;
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      try { client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); } catch (e) { client = null; }
    }
    return client;
  }

  const useRemote = () => !remoteFailed && !!getClient();

  function markRemoteError(err) {
    console.warn('[OracleHistory] Database unavailable, using local storage:', err && err.message ? err.message : err);
    remoteFailed = true;
    updateStatusBadge();
  }

  // ---------- local fallback store ----------
  function localDB() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || { conversations: [] }; }
    catch (e) { return { conversations: [] }; }
  }
  const saveLocalDB = db => localStorage.setItem(LOCAL_KEY, JSON.stringify(db));

  function localEnsure(db, id, email, title) {
    let c = db.conversations.find(x => x.id === id);
    if (!c) {
      c = { id, user_email: email, title: title || 'New conversation',
            created_at: new Date().toISOString(), updated_at: new Date().toISOString(), messages: [] };
      db.conversations.push(c);
    }
    return c;
  }

  // ---------- public API ----------
  function userEmail() {
    const u = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    return u ? u.email.toLowerCase() : null;
  }

  async function list() {
    const email = userEmail();
    if (!email) return [];
    if (useRemote()) {
      const { data, error } = await getClient().from('oracle_conversations')
        .select('id,title,updated_at').eq('user_email', email)
        .order('updated_at', { ascending: false }).limit(50);
      if (!error) { remoteOk = true; updateStatusBadge(); return data || []; }
      markRemoteError(error);
    }
    return localDB().conversations
      .filter(c => c.user_email === email)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .map(({ id, title, updated_at }) => ({ id, title, updated_at }));
  }

  async function loadMessages(id) {
    if (useRemote()) {
      const { data, error } = await getClient().from('oracle_messages')
        .select('role,content,created_at').eq('conversation_id', id)
        .order('created_at', { ascending: true });
      if (!error) return data || [];
      markRemoteError(error);
    }
    const c = localDB().conversations.find(x => x.id === id);
    return c ? c.messages : [];
  }

  // Saves one message, creating the conversation on first message.
  function saveMessage(role, content) {
    const email = userEmail();
    if (!email) return busy;
    busy = busy.then(async () => {
      const isNew = !currentId;
      if (isNew) currentId = uuid();
      const id = currentId;
      const now = new Date().toISOString();
      const title = content.replace(/\s+/g, ' ').trim().slice(0, 60) || 'New conversation';

      if (useRemote()) {
        const c = getClient();
        let err = null;
        if (isNew) {
          ({ error: err } = await c.from('oracle_conversations')
            .insert({ id, user_email: email, title, created_at: now, updated_at: now }));
        }
        if (!err) {
          ({ error: err } = await c.from('oracle_messages')
            .insert({ conversation_id: id, user_email: email, role, content, created_at: now }));
        }
        if (!err && !isNew) {
          ({ error: err } = await c.from('oracle_conversations').update({ updated_at: now }).eq('id', id));
        }
        if (!err) { remoteOk = true; updateStatusBadge(); refreshList(); return; }
        markRemoteError(err);
        // Re-create this conversation locally so nothing is lost
        const db = localDB();
        const lc = localEnsure(db, id, email, title);
        lc.messages.push({ role, content, created_at: now });
        lc.updated_at = now;
        saveLocalDB(db);
        refreshList();
        return;
      }

      const db = localDB();
      const lc = localEnsure(db, id, email, title);
      lc.messages.push({ role, content, created_at: now });
      lc.updated_at = now;
      saveLocalDB(db);
      refreshList();
    }).catch(e => console.warn('[OracleHistory] save failed', e));
    return busy;
  }

  async function remove(id) {
    if (useRemote()) {
      const { error } = await getClient().from('oracle_conversations').delete().eq('id', id);
      if (error) markRemoteError(error);
    }
    const db = localDB();
    db.conversations = db.conversations.filter(c => c.id !== id);
    saveLocalDB(db);
    if (currentId === id) { currentId = null; if (typeof clearChat === 'function') clearChat(); }
    refreshList();
  }

  function newConversation() { currentId = null; }

  async function open(id) {
    const msgs = await loadMessages(id);
    currentId = id;
    chatHistory.innerHTML = '';
    conversationContext = [];
    msgs.forEach(m => {
      appendMessage(m.role === 'user' ? 'user' : 'model', m.content, { skipSave: true });
      const text = m.role === 'user' && conversationContext.length === 0
        ? withSystemPrompt(m.content) : m.content;
      conversationContext.push({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text }] });
    });
    if (suggestionChips) suggestionChips.style.display = 'none';
    const oc = document.getElementById('historyOffcanvas');
    if (oc && window.bootstrap) bootstrap.Offcanvas.getInstance(oc)?.hide();
    highlightActive();
  }

  // ---------- UI ----------
  function formatWhen(iso) {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  async function refreshList() {
    const box = document.getElementById('historyList');
    if (!box) return;
    if (!userEmail()) {
      box.innerHTML = '<div class="history-empty"><i class="bi bi-person-lock"></i><p>Sign in with your Gmail to save and revisit your conversations.</p></div>';
      return;
    }
    const items = await list();
    if (!items.length) {
      box.innerHTML = '<div class="history-empty"><i class="bi bi-chat-square-text"></i><p>No saved conversations yet. Ask the Oracle something!</p></div>';
      return;
    }
    box.innerHTML = '';
    items.forEach(it => {
      const row = document.createElement('div');
      row.className = 'history-item';
      row.dataset.id = it.id;
      const main = document.createElement('button');
      main.type = 'button';
      main.className = 'history-item-main';
      const t = document.createElement('span');
      t.className = 'history-item-title';
      t.textContent = it.title;
      const w = document.createElement('span');
      w.className = 'history-item-when';
      w.textContent = formatWhen(it.updated_at);
      main.append(t, w);
      main.addEventListener('click', () => open(it.id));
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'history-item-del';
      del.title = 'Delete conversation';
      del.innerHTML = '<i class="bi bi-trash3"></i>';
      del.addEventListener('click', e => {
        e.stopPropagation();
        if (confirm('Delete this conversation permanently?')) remove(it.id);
      });
      row.append(main, del);
      box.appendChild(row);
    });
    highlightActive();
  }

  function highlightActive() {
    document.querySelectorAll('.history-item').forEach(el =>
      el.classList.toggle('active', el.dataset.id === currentId));
  }

  function updateStatusBadge() {
    const el = document.getElementById('historyDbStatus');
    if (!el) return;
    if (remoteFailed) {
      el.className = 'badge history-db-badge local';
      el.innerHTML = '<i class="bi bi-hdd me-1"></i>Saved on this device';
      el.title = 'Database tables not found. Run oracle-ai/schema.sql in Supabase to enable cloud sync.';
    } else if (remoteOk) {
      el.className = 'badge history-db-badge cloud';
      el.innerHTML = '<i class="bi bi-cloud-check me-1"></i>Synced to database';
      el.title = 'Conversations are stored in Supabase.';
    } else {
      el.className = 'badge history-db-badge';
      el.innerHTML = '<i class="bi bi-cloud me-1"></i>Connecting…';
    }
  }

  // Called after sign in / page load: restore the most recent conversation.
  async function onLogin(restoreLatest = true) {
    currentId = null;
    await refreshList();
    if (!restoreLatest) return;
    const items = await list();
    if (items.length) await open(items[0].id);
  }

  function onLogout() {
    currentId = null;
    refreshList();
    if (typeof clearChat === 'function') clearChat();
  }

  function openPanel() {
    const oc = document.getElementById('historyOffcanvas');
    if (!oc || !window.bootstrap) return;
    refreshList();
    updateStatusBadge();
    bootstrap.Offcanvas.getOrCreateInstance(oc).show();
  }

  return { saveMessage, newConversation, onLogin, onLogout, openPanel, refreshList, open, remove };
})();
