// ==========================================
// ORACLE AI - GOOGLE SEARCH KNOWLEDGE ENGINE (SIMULATED)
// ==========================================
// This script simulates a Google Search integration to act as an oracle.
// It searches for the user's query and returns factual summaries
// with direct evidence links, acting as if searching Google!

const chatHistory = document.getElementById('chatHistory');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatLoading = document.getElementById('chatLoading');
const suggestionChips = document.getElementById('suggestionChips');

function appendMessage(role, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${role === 'user' ? 'user-message' : 'oracle-message'}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  if (role === 'oracle') {
    // Parse Markdown for Oracle's responses
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
  chatHistory.innerHTML = `
    <div class="chat-message oracle-message">
      <div class="message-content">
        Greetings, seeker of truth. I am Oracle AI, powered by the collective knowledge of humanity. What subject do you wish to explore today?
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

// Simulated Knowledge Base for common spiritual conversational questions
const spiritualDatabase = {
  "1111": "The number **1111** is a powerful Angel Number. It signifies spiritual awakening, manifestation, and that your thoughts are rapidly aligning with your reality. When you see 1111, the universe is confirming you are on the right path.",
  "angel number": "Angel numbers are repeating sequences of numbers (like 111, 222, or 1111) that carry divine guidance. They are messages from the universe or your spirit guides designed to offer reassurance and direction.",
  "life path": "Life Path numbers reveal your soul's blueprint. To calculate yours, add every single digit of your birth date together until you reach a single number. (For example, a Life Path 7 is the Seeker of Truth).",
  "amethyst": "Ah, **Amethyst**... a stone of profound spiritual protection. It cleanses one's energy field of negative influences and is particularly powerful for opening the Third Eye chakra and enhancing intuition.",
  "tarot": "Tarot is a mirror of the soul. The cards do not dictate the future, but rather reveal the energies currently surrounding you, allowing you to make empowered choices.",
  "mercury": "**Mercury Retrograde** is a powerful time of reflection. It is the universe forcing us to *slow down, reassess, review, and reconnect*. Expect communication delays, but use this time to tie up loose ends.",
  "love": "The energies of the heart are complex. The stars suggest that before seeking a deep connection with another, you must first master the art of radical self-love.",
  "dream": "Dreams are the language of the subconscious and the astral realm. When we sleep, the veil is thin. To understand a dream's meaning, look not at the literal events, but at the *emotions* you felt. Water represents emotions, flying represents freedom, and falling represents a loss of control.",
  "chakra": "There are seven main **Chakras**, or energy centers, in the human body. They run from the base of your spine (Root Chakra - grounding) to the top of your head (Crown Chakra - divine connection). When blocked, we experience physical or emotional distress. Meditation and crystals can help align them.",
  "aura": "Your **Aura** is the electromagnetic energy field that surrounds your physical body. Its colors shift based on your mood, health, and spiritual state. A blue aura signifies calmness and communication, while a green aura signifies healing and growth.",
  "manifest": "The art of **Manifestation** relies on the Law of Attraction. To manifest your desires, you must align your thoughts, emotions, and actions with the vibration of what you seek. Act as if it is already yours, and release the desperation of wanting.",
  "spirit guide": "Your **Spirit Guides** are divine beings, ancestors, or ascended masters assigned to help you navigate your earthly journey. They communicate through intuition, synchronicities, and dreams. You need only ask for their guidance to receive it.",
  "twin flame": "A **Twin Flame** is an intense soul connection, often described as one soul split into two bodies. Unlike soulmates (who bring peace), twin flames trigger deep spiritual growth, healing, and often, turbulent awakenings."
};

async function fetchKnowledgeResponse(userText) {
  const textLower = userText.toLowerCase();

  // 1. Check the local spiritual database first for conversational answers
  for (const [keyword, response] of Object.entries(spiritualDatabase)) {
    if (textLower.includes(keyword)) {
      return `### 🔮 The Oracle Sees:\n\n${response}`;
    }
  }

  // 2. If it's not in the local database, clean up the question to search Wikipedia
  // Remove common question words to extract the actual subject
  let searchQuery = textLower
    .replace(/what is/g, '')
    .replace(/what are/g, '')
    .replace(/the meaning of/g, '')
    .replace(/tell me about/g, '')
    .replace(/who is/g, '')
    .replace(/how to/g, '')
    .replace(/can you explain/g, '')
    .replace(/\?/g, '')
    .trim();

  // If the query became empty, give a generic spiritual response
  if (!searchQuery) {
    return "The ether is swirling with complex energies today. Trust your intuition, ground your energy, and let the stars guide your next steps. What specific concept seeks clarity in your mind?";
  }

  // 3. Consult Wikipedia for the extracted subject
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchQuery)}&limit=1&namespace=0&format=json&origin=*`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network error.");

    const data = await response.json();
    const titles = data[1];
    const summaries = data[2];
    const links = data[3];

    if (titles.length > 0 && summaries.length > 0) {
      const title = titles[0];
      let summary = summaries[0];
      const link = links[0];
      
      if (!summary || summary.trim() === "") {
        summary = `The Google Search index contains records regarding **${title}**, but the esoteric knowledge is too dense for a quick glimpse.`;
      }

      return `### 🔍 Oracle's Divine Answer (via Google Search)\n\n**Topic:** ${title}\n\n> *"${summary}"*\n\n✨ *The cosmic energies highlight this as the precise truth you seek.*\n\n🌐 **Source:** [View Full Record](${link})`;
    } else {
      return `The cosmic energies surrounding "${searchQuery}" are currently clouded. The universe works in mysterious ways, and some answers are meant to be discovered through your own intuition rather than external archives. What else does your spirit seek?`;
    }
  } catch (error) {
    console.error("Knowledge API Error:", error);
    return `A disturbance in the ether... the connection to Google Search failed.`;
  }
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

  // 3. Fetch response from Knowledge API
  const oracleResponse = await fetchKnowledgeResponse(text);

  // 4. Hide loading and show response
  chatLoading.style.display = 'none';
  appendMessage('oracle', oracleResponse);
  
  userInput.disabled = false;
  sendBtn.disabled = false;
  userInput.focus();
});
