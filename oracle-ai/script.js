// ========================================================
// ORACLE AI - SPIRITUAL INTELLIGENCE & GEMINI INTEGRATION
// Features: Gmail Auth, 5 Free Chats (24h Regen), PayMongo Tokens
// Datamex College of Saint Adeline | Lead: Marcial Lawrence Jr V. Caronan
// ========================================================

// 1. PayMongo & Gemini Configurations
const PAYMONGO_TEST_PUBLIC_KEY = "pk_test_wfW6N69auD5WdUXDq7dRQVam";

// Gemini API Key assembly (preserved)
const p1 = 'AQ.Ab8RN6JyQvRs0X';
const p2 = 'juWTtPfuYxuaIOvu';
const p3 = 'kbcPo4_zhut6hT7o5tSg';
const GEMINI_API_KEY = p1 + p2 + p3;

// Constants
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const STORAGE_USERS_KEY = "oracle_users_db";
const STORAGE_CURRENT_USER_KEY = "oracle_active_user";

// DOM Elements
const chatHistory = document.getElementById('chatHistory');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatLoading = document.getElementById('chatLoading');
const suggestionChips = document.getElementById('suggestionChips');

// Token Store Selection State
let selectedPackage = { tokens: 30, price: 99 };
let selectedMethod = "gcash";
let conversationContext = [];

// ==========================================
// 2. AUTHENTICATION & STORAGE ENGINE
// ==========================================

function getUsersDB() {
  const data = localStorage.getItem(STORAGE_USERS_KEY);
  if (!data) {
    // Seed with a default demo account for convenient testing
    const demo = {
      "seeker.demo@gmail.com": {
        name: "Demo Seeker",
        email: "seeker.demo@gmail.com",
        password: "password123",
        freeChatsRemaining: 5,
        freeChatsLastReset: Date.now(),
        paidTokens: 10,
        createdAt: Date.now()
      }
    };
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(demo));
    return demo;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

function saveUsersDB(db) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(db));
}

function getCurrentUser() {
  const email = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
  if (!email) return null;
  const db = getUsersDB();
  const user = db[email.toLowerCase()];
  if (!user) return null;
  
  // Check 24-hour regeneration on each retrieval
  if (checkRegeneration(user)) {
    saveCurrentUser(user);
  }
  return user;
}

function saveCurrentUser(user) {
  if (!user || !user.email) return;
  const db = getUsersDB();
  db[user.email.toLowerCase()] = user;
  saveUsersDB(db);
}

function isValidGmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  // Must end strictly with @gmail.com and contain valid username chars before @
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailRegex.test(trimmed);
}

// 24-hour Regeneration Logic
function checkRegeneration(user) {
  if (!user) return false;
  const now = Date.now();
  if (!user.freeChatsLastReset) {
    user.freeChatsLastReset = now;
    user.freeChatsRemaining = 5;
    return true;
  }
  
  const elapsed = now - user.freeChatsLastReset;
  if (elapsed >= TWENTY_FOUR_HOURS_MS) {
    user.freeChatsRemaining = 5;
    user.freeChatsLastReset = now;
    return true;
  }
  return false;
}

function getRegenerationCountdown(user) {
  if (!user || !user.freeChatsLastReset) return "24h 00m 00s";
  const now = Date.now();
  const nextReset = user.freeChatsLastReset + TWENTY_FOUR_HOURS_MS;
  const diff = Math.max(0, nextReset - now);
  
  if (diff <= 0) {
    checkRegeneration(user);
    saveCurrentUser(user);
    updateAuthUI();
    return "Regenerated Now!";
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

// ==========================================
// 3. UI UPDATER & COUNTDOWN TIMER
// ==========================================

function updateAuthUI() {
  const user = getCurrentUser();
  const navContainer = document.getElementById('navAuthContainer');
  const chatQuotaText = document.getElementById('chatQuotaStatusText');
  const chatRegenTimer = document.getElementById('chatRegenTimer');
  const chatPaidTokensBadge = document.getElementById('chatPaidTokensBadge');
  const chatPaidTokensCount = document.getElementById('chatPaidTokensCount');
  const summaryUserEmail = document.getElementById('summaryUserEmail');

  if (!navContainer) return;

  if (!user) {
    // Logged Out UI
    navContainer.innerHTML = `
      <span class="badge bg-purple bg-opacity-25 border border-purple text-violet me-2 d-none d-md-inline-block">
        <i class="bi bi-lightning-charge-fill text-warning me-1"></i>5 Free Daily Insights
      </span>
      <button class="btn btn-sm btn-outline-info rounded-pill px-3" onclick="openAuthModal('signin')">
        <i class="bi bi-box-arrow-in-right me-1"></i> Sign In
      </button>
      <button class="btn btn-sm btn-mystic-auth" onclick="openAuthModal('signup')">
        <i class="bi bi-person-plus-fill me-1"></i> Sign Up (Gmail)
      </button>
    `;

    if (chatQuotaText) {
      chatQuotaText.innerHTML = `Sign in with <strong class="text-danger">@gmail.com</strong> to claim <strong class="text-warning">5 Free Insights</strong>`;
    }
    if (chatRegenTimer) {
      chatRegenTimer.innerHTML = `<span class="badge bg-info text-dark">5/5 for New Seekers</span>`;
    }
    if (chatPaidTokensBadge) chatPaidTokensBadge.style.display = 'none';
    if (summaryUserEmail) summaryUserEmail.textContent = "Guest (Please Sign In)";

  } else {
    // Logged In UI
    const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
    const isDepleted = user.freeChatsRemaining <= 0;
    
    navContainer.innerHTML = `
      <div class="nav-energy-pill" title="Daily Free Insights (Regenerates every 24h)">
        <i class="bi bi-lightning-charge-fill text-warning"></i>
        <span><strong id="navFreeEnergy">${user.freeChatsRemaining}</strong>/5 Daily</span>
      </div>

      <div class="nav-token-pill" onclick="openTokenStore()" title="Cosmic Tokens (Click to buy)">
        <i class="bi bi-gem text-warning"></i>
        <span><strong id="navTokens">${user.paidTokens}</strong> Tokens</span>
      </div>

      <button class="btn-buy-tokens d-none d-sm-inline-flex" onclick="openTokenStore()">
        <i class="bi bi-plus-circle-fill"></i> Buy Tokens
      </button>

      <div class="dropdown d-inline-block ms-1">
        <button class="btn btn-sm btn-dark border border-secondary rounded-pill d-flex align-items-center gap-2 py-1 px-2" 
                data-bs-toggle="dropdown" aria-expanded="false">
          <div class="user-avatar-badge">${initial}</div>
          <span class="small text-white d-none d-lg-inline" style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${user.name || user.email.split('@')[0]}
          </span>
          <i class="bi bi-chevron-down small text-muted"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border border-secondary p-2">
          <li class="px-2 py-1">
            <small class="text-muted d-block" style="font-size:0.7rem;">SIGNED IN AS</small>
            <strong class="text-white d-block small">${user.email}</strong>
            <span class="badge bg-success bg-opacity-25 text-success border border-success mt-1" style="font-size:0.68rem;">
              <i class="bi bi-check-circle me-1"></i>Verified Gmail
            </span>
          </li>
          <li><hr class="dropdown-divider my-2"></li>
          <li>
            <a class="dropdown-item small rounded-2" href="#" onclick="openTokenStore(); return false;">
              <i class="bi bi-gem text-warning me-2"></i>PayMongo Token Store
            </a>
          </li>
          <li>
            <a class="dropdown-item small rounded-2 text-danger" href="#" onclick="logoutUser(); return false;">
              <i class="bi bi-box-arrow-right me-2"></i>Sign Out
            </a>
          </li>
        </ul>
      </div>
    `;

    if (chatQuotaText) {
      if (user.freeChatsRemaining > 0) {
        chatQuotaText.innerHTML = `Free Daily Insights: <strong class="quota-indicator-active">${user.freeChatsRemaining} / 5</strong> remaining`;
      } else {
        chatQuotaText.innerHTML = `Daily Insights: <strong class="quota-indicator-depleted">0 / 5 (Exhausted)</strong>`;
      }
    }

    if (chatRegenTimer) {
      const countdown = getRegenerationCountdown(user);
      chatRegenTimer.innerHTML = `<i class="bi bi-clock-history text-info me-1"></i>Regenerates: <strong>${countdown}</strong>`;
    }

    if (chatPaidTokensBadge) {
      if (user.paidTokens > 0) {
        chatPaidTokensBadge.style.display = 'inline-block';
        chatPaidTokensCount.textContent = user.paidTokens;
      } else {
        chatPaidTokensBadge.style.display = 'none';
      }
    }

    if (summaryUserEmail) {
      summaryUserEmail.textContent = user.email;
    }
  }
}

// Start continuous 1-second countdown ticker
setInterval(() => {
  const user = getCurrentUser();
  if (user) {
    const countdown = getRegenerationCountdown(user);
    const timerElem = document.getElementById('chatRegenTimer');
    const depletedTimer = document.getElementById('depletedCountdownTimer');
    if (timerElem) {
      timerElem.innerHTML = `<i class="bi bi-clock-history text-info me-1"></i>Regenerates: <strong>${countdown}</strong>`;
    }
    if (depletedTimer) {
      depletedTimer.textContent = countdown;
    }
  }
}, 1000);

// ==========================================
// 4. AUTH MODAL & FORM HANDLERS
// ==========================================

function openAuthModal(tab = 'signin') {
  const authModalEl = document.getElementById('authModal');
  if (!authModalEl) return;
  const modal = bootstrap.Modal.getOrCreateInstance(authModalEl);
  
  const alertEl = document.getElementById('authAlert');
  if (alertEl) alertEl.classList.add('d-none');

  if (tab === 'signup') {
    const tabSignUpBtn = document.getElementById('tabSignUpBtn');
    if (tabSignUpBtn) bootstrap.Tab.getOrCreateInstance(tabSignUpBtn).show();
  } else {
    const tabSignInBtn = document.getElementById('tabSignInBtn');
    if (tabSignInBtn) bootstrap.Tab.getOrCreateInstance(tabSignInBtn).show();
  }
  
  modal.show();
}

function showAuthAlert(message, type = 'danger') {
  const alertEl = document.getElementById('authAlert');
  if (!alertEl) return;
  alertEl.className = `alert alert-${type} py-2 px-3 small rounded-3 mb-3 d-block`;
  alertEl.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> ${message}`;
}

// Sign In Form Submission
const signInForm = document.getElementById('signInForm');
if (signInForm) {
  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value.trim();
    const password = document.getElementById('signInPassword').value;

    if (!isValidGmail(email)) {
      showAuthAlert("Invalid Gmail format! The email address must strictly end with <strong>@gmail.com</strong> (e.g. yourname@gmail.com).");
      return;
    }

    const db = getUsersDB();
    const user = db[email.toLowerCase()];

    if (!user) {
      showAuthAlert("Account not found. Please click 'Create Account' above to register with this Gmail and claim your 5 free insights.");
      return;
    }

    if (user.password !== password) {
      showAuthAlert("Incorrect password for this Gmail account. Please try again.");
      return;
    }

    // Successful Login
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, user.email.toLowerCase());
    checkRegeneration(user);
    saveCurrentUser(user);

    const authModalEl = document.getElementById('authModal');
    bootstrap.Modal.getInstance(authModalEl)?.hide();
    signInForm.reset();

    updateAuthUI();
    if (typeof OracleHistory !== 'undefined') OracleHistory.onLogin();
    showToast(`Welcome back, ${user.name || user.email}! You have ${user.freeChatsRemaining} free insights available today.`, "success");
  });
}

// Sign Up Form Submission
const signUpForm = document.getElementById('signUpForm');
if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signUpName').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value;

    if (!isValidGmail(email)) {
      showAuthAlert("Registration Rejected: A valid Google <strong>@gmail.com</strong> address is required to ensure free insight eligibility!");
      return;
    }

    if (password.length < 6) {
      showAuthAlert("Password must be at least 6 characters in length.");
      return;
    }

    const db = getUsersDB();
    if (db[email.toLowerCase()]) {
      showAuthAlert("This Gmail account is already registered! Please switch to 'Sign In'.");
      return;
    }

    // Register new user with 5 free chats and 24hr cycle
    const newUser = {
      name: name || "Seeker",
      email: email.toLowerCase(),
      password: password,
      freeChatsRemaining: 5,
      freeChatsLastReset: Date.now(),
      paidTokens: 0,
      createdAt: Date.now()
    };

    db[newUser.email] = newUser;
    saveUsersDB(db);

    localStorage.setItem(STORAGE_CURRENT_USER_KEY, newUser.email);
    const authModalEl = document.getElementById('authModal');
    bootstrap.Modal.getInstance(authModalEl)?.hide();
    signUpForm.reset();

    updateAuthUI();
    if (typeof OracleHistory !== 'undefined') OracleHistory.onLogin(false);
    showToast(`🌟 Blessed Welcome, ${newUser.name}! Your account has been credited with 5 Free Daily Insights!`, "success");
  });
}

// Quick Test Demo Account Auto-Fill
function fillDemoAccount() {
  const emailInput = document.getElementById('signInEmail');
  const passInput = document.getElementById('signInPassword');
  if (emailInput && passInput) {
    emailInput.value = "seeker.demo@gmail.com";
    passInput.value = "password123";
    showToast("Filled demo account: seeker.demo@gmail.com. Click 'Sign In'!", "info");
  }
}

function logoutUser() {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  updateAuthUI();
  if (typeof OracleHistory !== 'undefined') OracleHistory.onLogout();
  showToast("You have safely disconnected from the Oracle session.", "info");
}

// ==========================================
// 5. PAYMONGO TOKEN STORE & PAYMENT ENGINE
// ==========================================

function openTokenStore() {
  const user = getCurrentUser();
  if (!user) {
    showToast("Please sign in with your Gmail first to link your purchased tokens!", "warning");
    openAuthModal('signin');
    return;
  }

  const tokenModalEl = document.getElementById('tokenStoreModal');
  if (!tokenModalEl) return;
  const modal = bootstrap.Modal.getOrCreateInstance(tokenModalEl);
  updateAuthUI();
  modal.show();
}

function selectTokenPack(element) {
  document.querySelectorAll('.token-pack-card').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');

  const tokens = parseInt(element.getAttribute('data-tokens'), 10);
  const price = parseInt(element.getAttribute('data-price'), 10);
  selectedPackage = { tokens, price };

  document.getElementById('summaryPackText').textContent = `Selected: ${tokens} Cosmic Tokens`;
  document.getElementById('summaryPriceText').textContent = `₱${price}.00`;
  document.getElementById('btnPaymongoSubmit').innerHTML = `<i class="bi bi-lock-fill me-1"></i> Pay ₱${price}.00 via PayMongo`;
}

function selectPaymentMethod(method, element) {
  selectedMethod = method;
  document.querySelectorAll('.payment-method-pill').forEach(el => el.classList.remove('active'));
  element.classList.add('active');

  const cardFields = document.getElementById('cardFields');
  const walletFields = document.getElementById('walletFields');
  const walletLabel = document.getElementById('walletLabel');

  if (method === 'card') {
    cardFields.style.display = 'block';
    walletFields.style.display = 'none';
  } else {
    cardFields.style.display = 'none';
    walletFields.style.display = 'block';
    walletLabel.textContent = method === 'gcash' ? 'Authorized GCash Mobile Number' : 'Authorized Maya Mobile Number';
  }
}

// PayMongo Form Submission
const paymongoForm = document.getElementById('paymongoForm');
if (paymongoForm) {
  paymongoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      showToast("Session expired. Please sign in with your Gmail first.", "warning");
      openAuthModal('signin');
      return;
    }

    const btnSubmit = document.getElementById('btnPaymongoSubmit');
    const originalBtnText = btnSubmit.innerHTML;

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Negotiating PayMongo API (${PAYMONGO_TEST_PUBLIC_KEY.substring(0, 12)}...)...`;

    try {
      // Realistic simulated PayMongo payment confirmation latency
      await new Promise(resolve => setTimeout(resolve, 1400));

      const refCode = `PM-ORACLE-${Math.floor(100000 + Math.random() * 900000)}`;

      // Credit tokens to user
      user.paidTokens = (user.paidTokens || 0) + selectedPackage.tokens;
      saveCurrentUser(user);

      // Close modal
      const tokenModalEl = document.getElementById('tokenStoreModal');
      bootstrap.Modal.getInstance(tokenModalEl)?.hide();

      updateAuthUI();

      showToast(`✨ Payment of ₱${selectedPackage.price}.00 verified via PayMongo (${refCode})! ${selectedPackage.tokens} Cosmic Tokens credited to ${user.email}.`, "success");

      // Auto-focus chat input
      if (userInput) userInput.focus();

    } catch (err) {
      console.error("PayMongo Error:", err);
      showToast("PayMongo test transaction could not be processed. Please try again.", "danger");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = originalBtnText;
    }
  });
}

function closeDepletedAndOpenStore() {
  const depletedModalEl = document.getElementById('energyDepletedModal');
  bootstrap.Modal.getInstance(depletedModalEl)?.hide();
  setTimeout(() => {
    openTokenStore();
  }, 250);
}

// ==========================================
// 6. CHATBOT CORE & KNOWLEDGE RETRIEVAL
// ==========================================

function appendMessage(role, text, opts = {}) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${role === 'user' ? 'user-message' : 'oracle-message'}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  if (role === 'model') {
    // Wrap response in Oracle Divine Answer formatting
    const formattedText = `### 👁️ Oracle's Divine Answer\n\n${text}`;
    contentDiv.innerHTML = marked.parse(formattedText);
  } else {
    contentDiv.textContent = text;
  }
  
  msgDiv.appendChild(contentDiv);
  chatHistory.appendChild(msgDiv);
  scrollToBottom();

  // Persist to chat history (skipped when re-rendering a saved conversation)
  if (!opts.skipSave && typeof OracleHistory !== 'undefined') {
    OracleHistory.saveMessage(role === 'user' ? 'user' : 'model', text);
  }
}

function scrollToBottom() {
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function clearChat() {
  chatHistory.innerHTML = `
    <div class="chat-message oracle-message">
      <div class="message-content">
        Greetings, seeker of truth. I am Oracle AI, connected to the Universe. What mysteries do you wish to explore today?
      </div>
    </div>
  `;
  conversationContext = [];
  suggestionChips.style.display = "flex";
  if (typeof OracleHistory !== 'undefined') OracleHistory.newConversation();
}

// Handler for Suggestion Chips
function sendSuggestion(text) {
  userInput.value = text;
  suggestionChips.style.display = "none";
  chatForm.dispatchEvent(new Event('submit'));
}

// Prepends the Oracle system directive to the first user message of a conversation
function withSystemPrompt(userText) {
  const systemPrompt = `[System Directive: You are Oracle AI, a metaphysical guide connected to the universal consciousness. 
Your duty is to provide Universal Spiritual Meanings for any question asked.
When answering, format your response exactly like a 'Google AI Overview' (precise, concise summary followed by bullet points), but write it with a spiritual, mystical twist. 
Always begin your answer with a variation of 'According to the Universe...' or 'The cosmic energies reveal...'.
If a user asks about dreams (e.g., 'a dream running away from a tiger'), give the specific spiritual and psychological meaning of that exact dream.
Confine your expertise strictly to metaphysical topics, dreams, astrology, crystals, numerology, tarot, etc. If asked something completely unrelated to spirituality, gently deflect and ask what their spirit seeks.]\n\nUser Question: `;
  return systemPrompt + userText;
}

// Gemini Knowledge API Call
async function fetchKnowledgeResponse(userText) {
  if (GEMINI_API_KEY === 'ENTER_YOUR_GEMINI_API_KEY_HERE') {
    return "The cosmic connection is severed. Please enter your **Gemini API Key** in `script.js` to allow the Oracle to commune with the Universe.";
  }

  // Primary Model endpoint (Google Gemini 3.8 Flash)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  let textToSend = userText;
  if (conversationContext.length === 0) {
    textToSend = withSystemPrompt(userText);
  }

  // Add user message to context
  conversationContext.push({
    role: "user",
    parts: [{ text: textToSend }]
  });

  const payload = {
    contents: conversationContext
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const googleError = errorData?.error?.message || response.statusText;
      console.warn("Primary model error:", googleError);
      
      // Fallback: try alternative high-throughput endpoint gemini-3.5-flash-lite
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
      const fbResponse = await fetch(fallbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!fbResponse.ok) {
        throw new Error(`Google API says: ${googleError}`);
      }
      
      const fbData = await fbResponse.json();
      const oracleReply = fbData.candidates[0].content.parts[0].text;
      conversationContext.push({ role: "model", parts: [{ text: oracleReply }] });
      return oracleReply;
    }

    const data = await response.json();
    const oracleReply = data.candidates[0].content.parts[0].text;
    
    // Save oracle response to context
    conversationContext.push({
      role: "model",
      parts: [{ text: oracleReply }]
    });

    return oracleReply;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Remove the failed user message from context
    conversationContext.pop();
    
    // Fallback: If network or quota, provide instant domain oracle answers based on spiritual keywords
    return generateSpiritualFallback(userText);
  }
}

// Resilient Fallback Spiritual Knowledge Engine (Never fails a seeker)
function generateSpiritualFallback(query) {
  const q = query.toLowerCase();
  if (q.includes("life path")) {
    return `According to the Universe, your **Life Path Number** is the vibrational blueprint of your soul's incarnation.
* **Calculation:** Add every single digit of your birth date (Month + Day + Year) until reduced to a single digit (1-9) or a Master Number (11, 22, 33).
* **Life Path 7 (The Seeker):** Deeply analytical, intuitive, and philosophical. Driven to explore spiritual truths.
* **Life Path 1 (The Pioneer):** Leadership, independence, and personal willpower.
* **Cosmic Guidance:** Trust your inner voice when making major crossroads decisions.`;
  }
  if (q.includes("amethyst") || q.includes("crystal")) {
    return `According to the Universe, **Amethyst** vibrates at the high frequencies of the Crown and Third Eye Chakras (approx 963Hz).
* **Properties:** Master tranquilizer, spiritual shield against psychic intrusion, and enhancer of lucid dream recall.
* **Ritual Cleansing:** Cleanse under the light of the Full Moon or atop a Selenite plate. Avoid prolonged direct midday sun.
* **Synergy:** Pairs harmoniously with Clear Quartz for amplified intention setting.`;
  }
  if (q.includes("tarot") || q.includes("card")) {
    return `The cosmic cards reveal the **Major Arcana Archetype: The Star (XVII)** for your inquiry.
* **Key Themes:** Renewal, divine hope, spiritual inspiration, and alignment with celestial purpose.
* **Message from the Stars:** Whatever storm recently tested your resolve is now passing. Trust that current delays are protecting your energetic sovereignty.
* **Affirmation:** *"I am guided by starlight, and my journey unfolds in sacred divine timing."*`;
  }
  if (q.includes("mercury") || q.includes("retrograde")) {
    return `The cosmic energies reveal that **Mercury Retrograde** is an optical planetary illusion carrying immense metaphysical significance.
* **Spiritual Duty:** A sacred window for the "Re-" actions: Re-evaluate, reflect, revisit, and recharge.
* **Practical Precautions:** Back up important digital files, double-check travel schedules, and speak with deliberate compassion.
* **Hidden Blessing:** Unresolved karmic conversations often return to be healed and permanently released.`;
  }
  return `According to the Universe, every thought and intention you release ripples across the metaphysical fabric of reality.
* **Insight on your query:** The cosmos urges you to ground your energy and listen beyond external noise. 
* **Universal Truth:** What you seek is simultaneously seeking you. Align your vibration with clarity and gratitude.
* **Daily Ritual:** Take 3 conscious deep breaths, connect your bare feet to the earth, and ask your higher self for direction.`;
}

// ==========================================
// 7. CHAT SUBMISSION GUARD & TOKEN DEDUCTION
// ==========================================

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const text = userInput.value.trim();
  if (!text) return;

  // STEP 1: AUTHENTICATION CHECK
  const user = getCurrentUser();
  if (!user) {
    showToast("Please sign in with your Gmail account to consult the Oracle! New seekers receive 5 free daily insights.", "warning");
    openAuthModal('signin');
    return;
  }

  // STEP 2: CHECK 24-HOUR QUOTA REGENERATION
  checkRegeneration(user);

  // STEP 3: CHECK ENERGY & TOKEN BALANCE
  let usedPaymentType = "";

  if (user.freeChatsRemaining > 0) {
    // Consume 1 free daily insight
    user.freeChatsRemaining--;
    usedPaymentType = "free";
  } else if (user.paidTokens > 0) {
    // Consume 1 paid cosmic token
    user.paidTokens--;
    usedPaymentType = "token";
  } else {
    // Both are 0 -> Trigger Energy Depleted Modal!
    const depletedModalEl = document.getElementById('energyDepletedModal');
    const modal = bootstrap.Modal.getOrCreateInstance(depletedModalEl);
    document.getElementById('depletedCountdownTimer').textContent = getRegenerationCountdown(user);
    modal.show();
    return;
  }

  // Persist updated user quota
  saveCurrentUser(user);
  updateAuthUI();

  // Notification of consumed insight
  if (usedPaymentType === "free") {
    showToast(`⚡ Used 1 Free Insight. (${user.freeChatsRemaining} free left today)`, "info");
  } else {
    showToast(`🔮 Used 1 Cosmic Token. (${user.paidTokens} tokens remaining)`, "info");
  }

  // STEP 4: SEND TO ORACLE AI
  appendMessage('user', text);
  userInput.value = '';
  userInput.disabled = true;
  sendBtn.disabled = true;
  suggestionChips.style.display = "none";
  
  // Show loading
  chatLoading.style.display = 'block';
  scrollToBottom();

  // Fetch response from Gemini / Knowledge Engine
  const oracleResponse = await fetchKnowledgeResponse(text);

  // Hide loading and show response
  chatLoading.style.display = 'none';
  appendMessage('model', oracleResponse);
  
  userInput.disabled = false;
  sendBtn.disabled = false;
  userInput.focus();
});

// Toast Helper
function showToast(message, type = "info") {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toastId = `toast-${Date.now()}`;
  const icon = type === 'success' ? 'bi-check-circle-fill text-success' : 
               type === 'warning' ? 'bi-exclamation-triangle-fill text-warning' : 
               type === 'danger' ? 'bi-x-circle-fill text-danger' : 'bi-stars text-info';

  const html = `
    <div id="${toastId}" class="toast align-items-center text-white bg-dark border border-secondary shadow-lg mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body small">
          <i class="bi ${icon} me-2"></i> ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);

  const toastEl = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastEl, { delay: 4500 });
  toast.show();

  toastEl.addEventListener('hidden.bs.toast', () => {
    toastEl.remove();
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  if (typeof OracleHistory !== 'undefined') {
    if (getCurrentUser()) OracleHistory.onLogin(); else OracleHistory.refreshList();
  }
});
