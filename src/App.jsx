import React, { useState, useEffect } from 'react';
import {
  Users, Radio, Trophy, Calendar, Gamepad2, Image as ImageIcon, Sparkles, 
  Menu, X, Upload, Plus, Volume2, MessageSquare, Send, Home, Flame, Gamepad, ExternalLink
} from 'lucide-react';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAWCXIdc80wTjCKq_VW3Vq6dS-lR3GJJZY",
  authDomain: "jst-official.firebaseapp.com",
  projectId: "jst-official",
  storageBucket: "jst-official.firebasestorage.app",
  messagingSenderId: "481567359336",
  appId: "1:481567359336:web:6c7ac453c61550374496dd",
  measurementId: "G-43CHG2Z9T6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Assets & Settings
const LOGO_URL = "https://cdn.phototourl.com/free/2026-08-08-cc31cf77-f33d-4f92-acfd-9931efb5991a.png";
const DISCORD_SERVER_ID = 'MASUKKAN_SERVER_ID_ANDA'; // Pastikan ganti dengan ID Server Anda
const DISCORD_INVITE_URL = `https://discord.gg/4GzW6KTAyZ`;

const INDONESIA_CITIES = ['Blitar', 'Kediri', 'Malang', 'Surabaya', 'Jogja', 'Solo', 'Semarang', 'Jakarta', 'Bandung', 'Lainnya'];
const ARCADE_GAMES = [
  { id: 'krunker', name: 'Krunker.io', url: 'https://krunker.io/', banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80' },
  { id: 'shellshock', name: 'Shell Shockers', url: 'https://shellshock.io/', banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80' },
  { id: 'smashkarts', name: 'Smash Karts', url: 'https://smashkarts.io/', banner: 'https://images.unsplash.com/photo-1511871893393-82e4c166a988?auto=format&fit=crop&w=600&q=80' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [discordData, setDiscordData] = useState({ presence_count: 0, channels: [], members: [] });
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    signInAnonymously(auth);
    onSnapshot(collection(db, "members"), (s) => setMembers(s.docs.map(d => ({ docId: d.id, ...d.data() }))));
    const qChat = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    onSnapshot(qChat, (s) => setMessages(s.docs.map(d => ({ docId: d.id, ...d.data() }))));
    
    fetch(`https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`)
      .then(res => res.json()).then(setDiscordData).catch(console.log);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentUser) return;
    await addDoc(collection(db, "chats"), { username: currentUser.username, text: chatInput, timestamp: Date.now(), avatar: currentUser.avatar });
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
      {/* Sidebar */}
      <aside className={`fixed z-50 w-72 h-full bg-slate-900 border-r border-slate-800 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain" />
          <div><h1 className="font-black text-white">JST Official</h1><p className="text-[10px] text-slate-400">Jawa Semua Teman</p></div>
        </div>
        <nav className="p-4 space-y-2">
          {['home', 'chat', 'discord', 'games', 'members'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${activeTab === tab ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
              {tab === 'home' && <Home className="w-4 h-4"/>}
              {tab === 'chat' && <MessageSquare className="w-4 h-4"/>}
              <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 lg:ml-72 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-wider">{activeTab}</h2>
          <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800">
            <span className="text-sm font-bold text-emerald-400">● {discordData.presence_count} Online</span>
          </div>
        </header>

        {activeTab === 'home' && (
          <div className="text-center py-20 bg-gradient-to-br from-indigo-900/20 to-slate-900 rounded-3xl border border-indigo-500/20">
            <img src={LOGO_URL} alt="Hero" className="w-40 h-40 mx-auto mb-6 object-contain" />
            <h1 className="text-5xl font-black mb-4">Selamat Datang di JST</h1>
            <p className="text-slate-400 max-w-lg mx-auto">Komunitas Gaming & Nongkrong. Sambungkan akun Discord dan mainkan game seru!</p>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARCADE_GAMES.map(game => (
              <div key={game.id} className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
                <img src={game.banner} className="w-full h-32 object-cover rounded-xl mb-4" />
                <h3 className="font-bold mb-2">{game.name}</h3>
                <button onClick={() => setSelectedGame(game.url)} className="w-full py-2 bg-indigo-600 rounded-xl text-xs font-bold">Mainkan</button>
              </div>
            ))}
          </div>
        )}

        {selectedGame && (
          <div className="fixed inset-0 z-50 bg-black/90 p-10">
            <button onClick={() => setSelectedGame(null)} className="absolute top-5 right-5 text-white text-2xl font-bold">Close X</button>
            <iframe src={selectedGame} className="w-full h-full" />
          </div>
        )}
      </main>
    </div>
  );
}
