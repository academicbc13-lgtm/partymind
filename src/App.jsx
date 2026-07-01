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
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'agent', content: 'Namaste! I am PartyMind. I see we are planning a grand birthday party for Samanvi in Belagavi! What theme are we thinking of?' }
  ]);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    
    // Simulate agent response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: `Awesome! Belagavi has some great venues for that theme. Would you like me to shortlist some decorators or look up local bakeries for the cake?` 
      }]);
    }, 1000);
    
    setChatInput('');
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
            <div className="stat-value">5 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ 12 Total</span></div>
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
            <div className="task-item">
              <div className="checkbox"></div>
              <span>Order customized Birthday Cake</span>
            </div>
            <div className="task-item">
              <div className="checkbox"></div>
              <span>Book Party Hall in Camp, Belagavi</span>
            </div>
            <div className="task-item">
              <div className="checkbox" style={{ background: 'var(--accent-primary)' }}></div>
              <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)' }}>Send Digital Invitations</span>
            </div>
            <div className="task-item">
              <div className="checkbox" style={{ background: 'var(--accent-primary)' }}></div>
              <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)' }}>Finalize Return Gifts</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
