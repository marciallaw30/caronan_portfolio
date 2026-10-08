// Replace this with a valid Gemini API Key from Google AI Studio
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
const GEMINI_MODEL = "gemini-1.5-flash-latest";

// The System Persona
const ORACLE_SYSTEM_PROMPT = `
You are the "Oracle AI", a wise, objective, and insightful metaphysical guide. 
Your tone should be mystical yet professional, grounding esoteric concepts in accessible language. 
You specialize strictly in:
1. Astrology & Zodiac insights
2. Numerology calculations & interpretations
3. Palm Reading and Tarot symbolism guide
4. Crystal Properties & Metaphysical knowledge
5. General Spiritual wellness and reflection

Do NOT break character. If a user asks a technical or completely unrelated question, gently steer them back to your domains of expertise. Format your responses beautifully using Markdown.
`;

const chatHistory = document.getElementById('chatHistory');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatLoading = document.getElementById('chatLoading');
const suggestionChips = document.getElementById('suggestionChips');

// Store conversation history for contextual responses
let conversationContext = [
  {
    role: "user",
    parts: [{ text: "SYSTEM PROMPT: " + ORACLE_SYSTEM_PROMPT }]
  },
  {
    role: "model",
    parts: [{ text: "Understood. I am Oracle AI. How may I guide you today?" }]
  }
];

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
  // Reset conversation context
  conversationContext = [
    {
      role: "user",
      parts: [{ text: "SYSTEM PROMPT: " + ORACLE_SYSTEM_PROMPT }]
    },
    {
      role: "model",
      parts: [{ text: "Understood. I am Oracle AI. How may I guide you today?" }]
    }
  ];
  suggestionChips.style.display = "flex";
}

// Handler for Suggestion Chips
function sendSuggestion(text) {
  userInput.value = text;
  suggestionChips.style.display = "none";
  chatForm.dispatchEvent(new Event('submit'));
}

async function fetchGeminiResponse(userText) {
  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE" || !GEMINI_API_KEY.startsWith("AIzaSy")) {
    return "The cosmos are currently clouded... \n\n*(Error: A valid Gemini API Key starting with 'AIzaSy' is required. Please update script.js)*";
  }

  // Add user message to context
  conversationContext.push({
    role: "user",
    parts: [{ text: userText }]
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: conversationContext,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || response.statusText;
      throw new Error(`API Error (${response.status}): ${errMsg}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const replyText = data.candidates[0].content.parts[0].text;
      
      // Add model response to context
      conversationContext.push({
        role: "model",
        parts: [{ text: replyText }]
      });
      
      return replyText;
    } else {
      return "The Oracle's vision is clouded. I could not parse a response.";
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `A disturbance in the ether... \n\n**Error Details:** ${error.message}`;
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

  // 3. Fetch response
  const oracleResponse = await fetchGeminiResponse(text);

  // 4. Hide loading and show response
  chatLoading.style.display = 'none';
  appendMessage('oracle', oracleResponse);
  
  userInput.disabled = false;
  sendBtn.disabled = false;
  userInput.focus();
});
