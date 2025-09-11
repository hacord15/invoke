# 🧠 AI Chatbot with Groq + Tavily + Node.js

**A real-time AI assistant that combines Groq LLM reasoning with Tavily web search to deliver accurate, context-aware, and up-to-date answers.**  

This project demonstrates how to integrate a large language model (Groq) with an external web-search tool (Tavily) and lightweight session caching to build a chat experience that can both reason from its model knowledge and fetch live information when needed. It includes a minimal frontend and a Node.js backend that handles conversation state, automatic tool calls for web searches, and caching to improve responsiveness and reduce redundant requests.

**Key features**
- LLM-powered conversational responses (Groq `llama-3.3-70b-versatile` in examples)
- Automatic, on-demand web search via Tavily when the model needs fresh or time-sensitive information
- Conversation memory using an in-memory cache to keep context across turns
- Clear response guidelines and tool-driven search strategy so the assistant knows *when* to search
- Minimal, practical setup ideal for prototyping or learning integrations of LLMs + live data

**Tech stack**
- Node.js + Express (backend)
- Groq SDK (LLM)
- Tavily API (real-time web search)
- node-cache (session caching)
- Plain HTML/JS frontend for quick testing

**Who it's for**
- Developers prototyping LLM + tool integrations  
- Teams building chat assistants that require both reasoning and live-data lookups  
- Learners who want a compact example of model-tool-calling and session memory


## OpenAI Parameters Explained

### 1. `temperature`
- Controls **randomness/creativity** of the output.
- `0` = very strict & predictable.
- `1` = balanced (default).
- Higher values = more random and creative.

### 2. `top_p`
- Alternative to `temperature` (called **nucleus sampling**).
- Chooses words only from the most likely options.
- `1` = no restriction (default).
- Lower values (e.g., `0.5`) = focuses only on the top probable words.

> ⚡ Usually, adjust **either `temperature` OR `top_p`**, not both.

### 3. `stop`
- Defines a **stop sequence**.
- The model stops generating once it encounters this text.
- Example: `"stop": ["END"]` → output ends when `"END"` appears.

### 4. `max_completion_tokens`
- Maximum number of tokens (words/parts of words) the model can generate.
- Example: `1000` ≈ ~750 words.

### 5. `max_tokens`
- Similar to `max_completion_tokens` (used in older APIs).
- Defines the **length limit** of the response.

### 6. `frequency_penalty`
- Controls how much the model **avoids repeating the same words/phrases**.
- Range: `-2.0` to `2.0`.
- Higher = less repetition.

### 7.
### 7. `presence_penalty`
- Controls how much the model is encouraged to **talk about new topics**.
- Range: `-2.0` to `2.0`.
- Higher = more likely to bring new ideas into the response.
