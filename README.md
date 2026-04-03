# 🚀 Edge Memory Chat (Cloudflare AI App)

A full-stack AI chat application built on Cloudflare’s edge platform with persistent memory, real-time streaming, and a modern UI.

## 🌐 Overview

Edge Memory Chat is a Cloudflare-native AI assistant that:

* runs on Cloudflare Workers + Workers AI
* uses Durable Objects for session-based memory
* delivers low-latency responses at the edge
* provides a polished ChatGPT-like frontend experience

This project demonstrates building intelligent, stateful applications at Internet scale.

---

## ✨ Features

* 💬 AI Chat powered by Llama 3 (Workers AI)
* ⚡ Edge execution using Cloudflare Workers
* 🧠 Persistent memory using Durable Objects
* 🔄 Session-based conversations
* ⏳ Streaming responses (real-time typing effect)
* 🎨 Modern UI (React + Tailwind CSS)
* 📱 Responsive design
* 📂 Conversation history sidebar
* 🧾 Memory panel (view & manage stored preferences)

---

## 🏗️ Tech Stack

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS (v3)

### Backend

* Cloudflare Workers
* Workers AI (Llama 3.3)
* Durable Objects (state & memory)

---

## 🧠 Architecture

* **Worker API (`/chat`)**

  * Receives message + sessionId
  * Routes request to Durable Object

* **Durable Object (ChatSession)**

  * Stores chat history per session
  * Maintains user memory/preferences
  * Calls Workers AI for response generation

* **Frontend**

  * Sends user input
  * Streams responses
  * Displays memory & conversation history

---

## 📁 Project Structure

```
cf_ai_edge_memory_chat/
  frontend/
    src/
      components/
      pages/
  worker/
    src/
      index.ts
      prompts.ts
      types.ts
      durable/
        ChatSession.ts
```

---

## ⚙️ Setup Instructions

### 1. Clone repository

```
git clone https://github.com/mili-virani/cf_ai_edge_memory_chat.git
cd cf_ai_edge_memory_chat
```

---

### 2. Run backend (Worker)

```
cd worker
npm install
npx wrangler dev
```

Runs at:

```
http://127.0.0.1:8787
```

---

### 3. Run frontend

```
cd frontend
npm install
npm run dev
```

Runs at:

```
http://localhost:5173
```

---

## 🧪 Example API Request

```
POST /chat
{
  "sessionId": "chat-1",
  "message": "Help me prepare for software engineering internships"
}
```

---

## 🔐 Environment Notes

* Uses Cloudflare Workers AI (no external API keys required)
* Do NOT commit `.env` files or secrets

---

## 🚀 Future Improvements

* Authentication (optional)
* Multi-user session management
* Better memory extraction using AI
* Deployment to production (Workers + Pages)
* Analytics / usage tracking

---

## 💡 Why this project?

This project showcases:

* Full-stack engineering
* Cloudflare ecosystem (Workers, AI, Durable Objects)
* Scalable backend design
* Real-time systems
* Product-level UI/UX thinking

---

## 👤 Author

Mili Virani
MS Computer Science, CSULB

GitHub: https://github.com/mili-virani
LinkedIn: https://www.linkedin.com/in/mili-virani-a31780256/

---

## 📝 License

MIT License
