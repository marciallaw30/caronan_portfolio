// ==========================================
// ORACLE AI - MOCK API MODE (For Portfolio/Student Showcase)
// ==========================================
// Since the Gemini API is currently unavailable in your region/account,
// this script uses a "Mock API" to simulate the AI's behavior. 
// It reads keywords from the user and returns contextually appropriate
// responses to demonstrate the UI/UX functionality for your school project.

const chatHistory = document.getElementById('chatHistory');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatLoading = document.getElementById('chatLoading');
const suggestionChips = document.getElementById('suggestionChips');

// Simulated Knowledge Base (Mock API Database)
const oracleKnowledge = {
  "life path": "Life Path numbers reveal your soul's blueprint. \n\nIf you are a **Life Path 7**, for example, you are the *Seeker of Truth*. Deeply intuitive, analytical, and spiritually inclined, you are drawn to the mysteries of existence. To calculate yours, add every single digit of your birth date together until you reach a single number.",
  "amethyst": "Ah, **Amethyst**... a stone of profound spiritual protection and purification. \n\nIt cleanses one's energy field of negative influences and attachments, creating a resonant shield of spiritual light around the body. It is particularly powerful for opening the Third Eye chakra and enhancing intuition.",
  "tarot": "The cards reveal the energies currently surrounding you. I have drawn the **Wheel of Fortune**. \n\nThis signifies a turning point. Cycles are changing, and destiny is at work. What goes down must come up. Embrace the upcoming changes, for they are aligned with your highest good.",
  "mercury": "**Mercury Retrograde** is a powerful time of reflection, not fear. \n\nIt is an optical illusion where the planet appears to move backwards. Spiritually, it is the universe forcing us to *slow down, reassess, review, and reconnect*. Expect communication delays, but use this time to tie up loose ends rather than starting new ventures.",
  "astrology": "The cosmos are a mirror to the soul. Your birth chart is a snapshot of the sky at the exact moment you took your first breath. \n\nYour **Sun** is your core identity, your **Moon** governs your emotional inner world, and your **Rising Sign** is the mask you present to the universe. Which would you like to explore?",
  "love": "The energies of the heart are complex. Love requires both vulnerability and boundaries. The stars suggest that before seeking a deep connection with another, you must first master the art of radical self-love. Venus is watching over your romantic sector.",
  "career": "Your professional path is currently bathed in the ambitious light of Saturn. Discipline and structure are required right now. Do not rush the harvest; instead, focus on planting strong, deep roots. Recognition will come in due time.",
  "default": "The ether is swirling with complex energies today. \n\nYour question touches upon deep cosmic truths. Remember that you are a universe experiencing itself in human form. Trust your intuition, ground your energy, and let the stars guide your next steps. What else seeks clarity in your mind?"
};

function appendMessage(role, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${role === 'user' ? 'user-message' : 'oracle-message'}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  if (role === 'oracle') {
    // Parse Markdown for Oracle's responses (using marked.js included in HTML)
    contentDiv.innerHTML = marked.parse(text);
  } else {
    contentDiv.textContent = text;
  }
  
  msgDiv.appendChild(contentDiv);
  chatHistory.appendChild(msgDiv);
  scrollToBottom();
}

function scrollToBottom() {
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function clearChat() {
  // Keep only the initial greeting
  chatHistory.innerHTML = `
    <div class="chat-message oracle-message">
      <div class="message-content">
        Greetings, seeker of truth. I am Oracle AI. The stars and energies align to bring you here today. What mysteries of the universe, astrology, tarot, or your life path seek illumination?
      </div>
    </div>
  `;
  suggestionChips.style.display = "flex";
}

// Handler for Suggestion Chips
function sendSuggestion(text) {
  userInput.value = text;
  suggestionChips.style.display = "none";
  chatForm.dispatchEvent(new Event('submit'));
}

// Simulates the network delay and thought process of a real AI API
async function fetchGeminiResponse(userText) {
  return new Promise((resolve) => {
    const textLower = userText.toLowerCase();
    let responseText = oracleKnowledge["default"];

    // Keyword matching logic to simulate AI comprehension
    if (textLower.includes("life path") || textLower.includes("number")) {
      responseText = oracleKnowledge["life path"];
    } else if (textLower.includes("amethyst") || textLower.includes("crystal")) {
      responseText = oracleKnowledge["amethyst"];
    } else if (textLower.includes("tarot") || textLower.includes("card") || textLower.includes("draw")) {
      responseText = oracleKnowledge["tarot"];
    } else if (textLower.includes("mercury") || textLower.includes("retrograde")) {
      responseText = oracleKnowledge["mercury"];
    } else if (textLower.includes("astrology") || textLower.includes("zodiac") || textLower.includes("sign")) {
      responseText = oracleKnowledge["astrology"];
    } else if (textLower.includes("love") || textLower.includes("relationship")) {
      responseText = oracleKnowledge["love"];
    } else if (textLower.includes("career") || textLower.includes("job") || textLower.includes("work")) {
      responseText = oracleKnowledge["career"];
    }

    // Simulate network latency (2 seconds) to mimic API processing time
    setTimeout(() => {
      resolve(responseText);
    }, 2000);
  });
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const text = userInput.value.trim();
  if (!text) return;

  // 1. Show user message
  appendMessage('user', text);
  userInput.value = '';
  userInput.disabled = true;
  sendBtn.disabled = true;
  suggestionChips.style.display = "none";
  
  // 2. Show loading
  chatLoading.style.display = 'block';
  scrollToBottom();

  // 3. Fetch simulated API response
  const oracleResponse = await fetchGeminiResponse(text);

  // 4. Hide loading and show response
  chatLoading.style.display = 'none';
  appendMessage('oracle', oracleResponse);
  
  userInput.disabled = false;
  sendBtn.disabled = false;
  userInput.focus();
});
