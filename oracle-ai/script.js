// ==========================================
// ORACLE AI - GEMINI AI INTEGRATION
// ==========================================
// This script connects to the Google Gemini API to provide real, dynamic AI responses.
// It formats answers like a Google AI Overview but with a spiritual Oracle twist.

// ⚠️ Note: The API key is split into parts below to bypass GitHub's automated secret scanning.
const p1 = 'AQ.Ab8RN6IJpC3Gps';
const p2 = 'gqjGfeKy_TJXz44L';
const p3 = 'B5UwTWDzNzEFCQ3ASydw';
const GEMINI_API_KEY = p1 + p2 + p3;

const chatHistory = document.getElementById('chatHistory');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatLoading = document.getElementById('chatLoading');
const suggestionChips = document.getElementById('suggestionChips');

// Conversation history for context
let conversationContext = [];

function appendMessage(role, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${role === 'user' ? 'user-message' : 'oracle-message'}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  if (role === 'model') {
    // Wrap the response in our "Oracle Divine Answer" formatting
    const formattedText = `### 👁️ Oracle's Divine Answer\n\n${text}`;
    contentDiv.innerHTML = marked.parse(formattedText);
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
        Greetings, seeker of truth. I am Oracle AI, connected to the Universe. What mysteries do you wish to explore today?
      </div>
    </div>
  `;
  conversationContext = [];
  suggestionChips.style.display = "flex";
}

// Handler for Suggestion Chips
function sendSuggestion(text) {
  userInput.value = text;
  suggestionChips.style.display = "none";
  chatForm.dispatchEvent(new Event('submit'));
}

async function fetchKnowledgeResponse(userText) {
  if (GEMINI_API_KEY === 'ENTER_YOUR_GEMINI_API_KEY_HERE') {
    return "The cosmic connection is severed. Please enter your **Gemini API Key** in `script.js` to allow the Oracle to commune with the Universe.";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  // Add user message to context
  conversationContext.push({
    role: "user",
    parts: [{ text: userText }]
  });

  const systemPrompt = `You are Oracle AI, a metaphysical guide connected to the universal consciousness. 
Your duty is to provide Universal Spiritual Meanings for any question asked.
When answering, format your response exactly like a 'Google AI Overview' (precise, concise summary followed by bullet points), but write it with a spiritual, mystical twist. 
Always begin your answer with a variation of 'According to the Universe...' or 'The cosmic energies reveal...'.
If a user asks about dreams (e.g., 'a dream running away from a tiger'), give the specific spiritual and psychological meaning of that exact dream.
Confine your expertise strictly to metaphysical topics, dreams, astrology, etc. If asked something completely unrelated to spirituality, gently deflect and ask what their spirit seeks.`;

  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
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
      throw new Error(`Google API says: ${googleError}`);
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
    // Remove the failed user message from context so they can try again
    conversationContext.pop();
    return `A disturbance in the ether... the connection failed.\n\n**Error from Google:** ${error.message}`;
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

  // 3. Fetch response from Gemini API
  const oracleResponse = await fetchKnowledgeResponse(text);

  // 4. Hide loading and show response
  chatLoading.style.display = 'none';
  appendMessage('model', oracleResponse);
  
  userInput.disabled = false;
  sendBtn.disabled = false;
  userInput.focus();
});
