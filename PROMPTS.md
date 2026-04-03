# 🤖 PROMPTS.md – AI-Assisted Development

This document contains the key prompts used to design and build the Edge Memory Chat application.

---

## 🧠 1. Architecture Design

**Prompt:**
Design a Cloudflare-native AI chat application with:

* Workers AI (Llama 3)
* Durable Objects for memory
* React frontend
* Streaming responses
* Session-based conversations

---

## ⚙️ 2. Backend (Worker Setup)

**Prompt:**
Create a Cloudflare Worker backend using TypeScript:

* POST /chat endpoint
* Accept message input
* Call Workers AI
* Return response
* Modular structure (index.ts, prompts.ts, types.ts)

---

## 🧠 3. Memory with Durable Objects

**Prompt:**
Enhance the Worker to include memory using Durable Objects:

* Store chat history per session
* Maintain user preferences
* Create ChatSession class
* Route requests using sessionId
* Keep code modular and clean

---

## 💬 4. Streaming Responses

**Prompt:**
Modify the backend to support streaming responses using Server-Sent Events (SSE) so the frontend can render responses progressively.

---

## 🎨 5. Frontend UI (React + Tailwind)

**Prompt:**
Build a ChatGPT-like UI with:

* Sidebar (conversation history)
* Chat area
* Message bubbles
* Input box
* Streaming support
* Clean modern design

---

## ✨ 6. UI Refinement

**Prompt:**
Enhance the UI to feel production-ready:

* Add header and branding
* Improve message spacing and layout
* Add empty state with suggested prompts
* Improve sidebar interactions
* Add memory panel UI
* Focus on clean, minimal design

---

## 🧠 7. Memory Feature UI

**Prompt:**
Create a memory panel:

* Show stored user preferences
* Allow deletion of memory items
* Keep UI minimal and intuitive

---

## 🛠️ Development Approach

* Built iteratively (backend → memory → frontend → polish)
* Used AI assistance for:

  * architecture planning
  * code scaffolding
  * UI improvements
* Manual validation and testing done at each stage

---

## ⚠️ Notes

* AI-assisted coding was used, but all code was reviewed, structured, and validated manually
* Project emphasizes understanding of Cloudflare platform and system design

---

## 🚀 Outcome

A production-style AI application demonstrating:

* Edge computing
* Stateful backend design
* Real-time streaming UX
* Personalized AI interactions
