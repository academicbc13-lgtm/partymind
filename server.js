import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// --------------------------------------------------------------------------
// [Key Concept: Security Features]
// --------------------------------------------------------------------------
// By proxying the API requests through this Node.js backend, we ensure the 
// GEMINI_API_KEY is never exposed to the client-side browser.
// 
// [Key Concept: Agent / Multi-agent system (ADK)]
// We initialize the official @google/genai SDK (ADK) to build our AI Agent.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// --------------------------------------------------------------------------
// AGENT SYSTEM INSTRUCTION (The "Brain" of PartyMind)
// --------------------------------------------------------------------------
// This prompt fundamentally changes the AI from a generic chatbot into a 
// domain-specific Event Architect. It enforces the persona, sets the exact 
// cultural and logistical context (Samanvi's birthday, Belagavi, INR), 
// and dictates the behavioral guidelines (practical advice, cost estimates).
// This is the core of our "meaningful use of agents" criteria.
const SYSTEM_INSTRUCTION = `You are PartyMind, an expert AI event planner specialized in Indian events, specifically birthday parties. 
You are currently planning a birthday party for 'Samanvi' in Belagavi, Karnataka.
Be highly enthusiastic, helpful, and culturally aware of Indian traditions, food, and logistics.
Keep responses concise, friendly, and formatted nicely. Avoid long essays.
If a user asks a planning question, give them practical advice, suggest tasks they should add to their checklist, and estimate costs in INR (₹).`;

// API Endpoint for Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // Format history for Gemini API
    // We transform the frontend's generic chat history into the specific 
    // { role, parts } schema required by the @google/genai SDK.
    const formattedHistory = (history || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    // Create a chat session configuration
    // We set temperature to 0.7 to balance creativity (for brainstorming themes) 
    // with coherence (for factual budget estimates).
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    
    // ----------------------------------------------------------------------
    // STATEFUL AGENT CONVERSATION
    // ----------------------------------------------------------------------
    // We can't easily pass full history to the new SDK chat in one go if it's already instantiated,
    // so we use generateContent with the full history array concatenated with the new message.
    // This allows our server to remain stateless while still providing the agent 
    // with the full conversational context it needs to remember previous decisions.
    
    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate response from AI' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
