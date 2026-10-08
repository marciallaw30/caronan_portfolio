// ==========================================
// ORACLE AI - WIKIPEDIA KNOWLEDGE ENGINE
// ==========================================
// This script uses the free, open Wikipedia API to act as an oracle.
// It searches for the user's query and returns factual summaries
// with direct evidence links, bypassing any need for API keys!

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

async function fetchKnowledgeResponse(query) {
  // Using the Wikipedia OpenSearch API (100% free, no API key needed, returns summaries + links)
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json&origin=*`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to consult the knowledge archives.");
    }

    const data = await response.json();
    
    // data format: [ "query", ["Title"], ["Summary"], ["Link"] ]
    const titles = data[1];
    const summaries = data[2];
    const links = data[3];

    if (titles.length > 0 && summaries.length > 0) {
      const title = titles[0];
      let summary = summaries[0];
      const link = links[0];
      
      // Sometimes the summary is empty, so we provide a fallback
      if (!summary || summary.trim() === "") {
        summary = `I found records regarding **${title}**, but the summary is too complex to summarize briefly.`;
      }

      // Format beautifully in Markdown
      return `### 🔮 The Oracle has found the answers:\n\n**${title}**\n\n${summary}\n\n📖 **Evidence / Read More:** [Click here to view the source](${link})`;
    } else {
      return `The archives are silent on the matter of "${query}". Try asking about a more specific topic, concept, or historical event.`;
    }
  } catch (error) {
    console.error("Knowledge API Error:", error);
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

  // 3. Fetch response from Knowledge API
  const oracleResponse = await fetchKnowledgeResponse(text);

  // 4. Hide loading and show response
  chatLoading.style.display = 'none';
  appendMessage('oracle', oracleResponse);
  
  userInput.disabled = false;
  sendBtn.disabled = false;
  userInput.focus();
});
