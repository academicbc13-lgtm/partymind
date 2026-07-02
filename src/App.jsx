import React, { useState } from 'react';
import { 
  Sparkles, 
  CalendarDays, 
  LayoutDashboard, 
  CheckCircle2, 
  Users, 
  MessageSquare,
  Send,
  MapPin
} from 'lucide-react';
import './index.css';

function App() {
  // ----------------------------------------------------------------------
  // COMPONENT STATE & CONVERSATION HISTORY
  // ----------------------------------------------------------------------
  // We maintain the chat history locally on the client to provide immediate 
  // feedback to the user. This history is then sent to the stateless Node.js 
  // backend on every request, allowing the Gemini agent to maintain context 
  // across the conversation (e.g., remembering previously chosen themes).
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'agent', content: 'Namaste! I am PartyMind. I see we are planning a grand birthday party for Samanvi in Belagavi! What theme are we thinking of?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Order customized Birthday Cake', completed: false },
    { id: 2, text: 'Book Party Hall in Camp, Belagavi', completed: false },
    { id: 3, text: 'Send Digital Invitations', completed: true },
    { id: 4, text: 'Finalize Return Gifts', completed: true },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleSend = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const userMsg = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsLoading(true);
    
    try {
      // ----------------------------------------------------------------------
      // BACKEND COMMUNICATION
      // ----------------------------------------------------------------------
      // The frontend delegates all AI processing to our secure backend proxy. 
      // This ensures that the Gemini API key is never exposed to the client.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: chatInput,
          history: messages.map(m => ({ sender: m.role, text: m.content }))
        })
      });
      
      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'agent', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'agent', content: 'Oops! Something went wrong on my end.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'agent', content: 'Could not connect to PartyMind servers.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Sparkles className="text-gold" />
          PartyMind
        </div>
        
        <ul className="nav-menu">
          <li className="nav-item active">
            <LayoutDashboard size={20} />
            Dashboard
          </li>
          <li className="nav-item">
            <MessageSquare size={20} />
            AI Planner
          </li>
          <li className="nav-item">
            <CalendarDays size={20} />
            Itinerary
          </li>
          <li className="nav-item">
            <Users size={20} />
            Guest List
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <div>
            <h1>Samanvi's Birthday Bash 🎂</h1>
            <p style={{ color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <MapPin size={16} /> Belagavi, Karnataka • 14 Days Left
            </p>
          </div>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Budget Tracker</span>
            <strong style={{ color: '#fbbf24' }}>₹ 15,000 / ₹ 30,000</strong>
          </div>
        </div>

        {/* Top Widgets */}
        <div className="dashboard-grid">
          <div className="glass-card">
            <h3 style={{ color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Users size={18} /> Confirmed Guests
            </h3>
            <div className="stat-value">45 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ 60 Invited</span></div>
          </div>
          
          <div className="glass-card">
            <h3 style={{ color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <CheckCircle2 size={18} /> Tasks Completed
            </h3>
            <div className="stat-value">{tasks.filter(t => t.completed).length} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ {tasks.length} Total</span></div>
          </div>
        </div>

        {/* AI & Tasks Section */}
        <div className="ai-section">
          {/* AI Chat */}
          <div className="glass-card chat-box">
            <h3 style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Sparkles size={18} color="var(--accent-primary)" /> Plan with PartyMind
            </h3>
            
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
            </div>
            
            <div className="chat-input-container">
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Ask for ideas (e.g. Best cake shop in Belagavi...)"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="send-btn" onClick={handleSend}>
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem' }}>Upcoming Tasks</h3>
            {tasks.map(task => (
              <div key={task.id} className="task-item" onClick={() => toggleTask(task.id)} style={{ cursor: 'pointer' }}>
                <div className="checkbox" style={{ background: task.completed ? 'var(--accent-primary)' : 'transparent' }}>
                  {task.completed && <CheckCircle2 size={14} color="white" />}
                </div>
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-secondary)' : 'inherit' }}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
