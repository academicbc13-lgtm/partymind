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

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are PartyMind, an expert AI event planner specialized in Indian events, specifically birthday parties. 
You are currently planning a birthday party for 'Samanvi' in Belagavi, Karnataka.
Be highly enthusiastic, helpful, and culturally aware of Indian traditions, food, and logistics.
Keep responses concise, friendly, and formatted nicely. Avoid long essays.
If a user asks a planning question, give them practical advice, suggest tasks they should add to their checklist, and estimate costs in INR (₹).`;

// API Endpoint for Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // Format history for Gemini
    const formattedHistory = (history || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    // Create a chat session
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    
    // We can't easily pass full history to the new SDK chat in one go if it's already instantiated,
    // so we'll just send a direct generateContent request if we want to include history easily, 
    // or use the chat interface if we just pass the latest message.
    // For simplicity, let's use generateContent with the full history array.
    
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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
