# Project: Oracle AI (Spiritual & Metaphysical Guide)

## Overview
**Oracle AI** is an interactive, browser-based chatbot application that acts as a spiritual and metaphysical guide. Integrated directly with Google's Gemini AI API, the platform provides users with intuitive, structured insights covering astrology, numerology, palm reading, tarot card interpretations, crystal knowledge, and general spiritual wellness.

The project demonstrates advanced capabilities in API consumption, prompt engineering, and modern UI/UX design, blending cutting-edge generative AI with esoteric concepts.

## Key Technologies & Architecture
1. **Frontend Architecture:** 
   - **HTML5 & CSS3:** Semantic structure with a custom, midnight-cosmic aesthetic.
   - **Bootstrap 5:** Ensures a fully responsive, mobile-first design framework.
   - **Custom CSS (`style.css`):** Implements glassmorphism effects, floating animations, and gradient typography to evoke a mystical atmosphere.

2. **Backend / API Integration:**
   - **Google Gemini API (`gemini-1.5-flash` / `pro`):** Serves as the core NLP (Natural Language Processing) engine.
   - **JavaScript Fetch API:** Handles asynchronous HTTP requests to the Gemini REST endpoint.
   - **Marked.js:** A markdown parser used on the client-side to render Gemini's structured responses (bolding, lists, etc.) into clean HTML.

## Technical Implementation Details

### 1. System Persona Injection (Prompt Engineering)
A critical part of the system is enforcing the AI's persona. Before the user interacts with the model, a hidden `System Prompt` is injected into the context array. This prompt explicitly instructs the Gemini model to:
- Adopt the persona of "Oracle AI".
- Maintain a wise, objective, and insightful tone.
- Confine its expertise *strictly* to metaphysical topics (astrology, tarot, crystals, etc.).
- Deflect off-topic technical or mundane queries gracefully.

### 2. State Management & Context Window
The JavaScript logic (`script.js`) maintains a `conversationContext` array. Every time the user sends a message or the Oracle responds, the interaction is pushed into this array. When calling the API, the *entire* array is sent as the payload. This ensures the AI retains "memory" of the conversation, allowing for follow-up questions and contextual continuity.

### 3. Asynchronous UI Handling
To prevent UI blocking during API calls, the system implements:
- **Input disabling:** The input field and send button are disabled while waiting for a response to prevent duplicate requests.
- **Loading State:** A dynamic spinner/loading text ("Oracle is consulting the stars...") is toggled on and off based on the fetch promise lifecycle.
- **Auto-Scrolling:** The chat interface automatically scrolls to the newest message upon injection into the DOM.

## UI/UX Design Considerations
- **Immersive Aesthetic:** The dark theme with subtle violet and indigo gradients (`#c084fc`, `#7c3aed`) reflects the "spiritual" theme, offering a visually distinct experience from standard corporate dashboards.
- **Suggestion Chips:** Pre-configured query buttons (e.g., "What is my life path number?") guide new users on how to interact with the system, reducing friction and demonstrating the AI's capabilities immediately.

## Future Enhancements
- **Backend Proxy Integration:** Currently, the API key must be hardcoded in the client-side JavaScript for demonstration purposes. A production deployment would involve moving the API call to a secure serverless function (e.g., Node.js or Python Flask) to protect the API key.
- **Daily Tarot/Horoscope Caching:** Implementing local storage to save the user's daily reading so it persists across page reloads.
