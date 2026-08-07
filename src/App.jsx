import React, { useState, useEffect } from 'react';
import {
  Users,
  Radio,
  Trophy,
  Calendar,
  Gamepad2,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Upload,
  Plus,
  Clock,
  Zap,
  Bot,
  UserCheck,
  Film,
  Volume2,
  MessageSquare,
  Send,
  Home,
  Flame,
  Gamepad,
  Award,
  Layers
} from 'lucide-react';

// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  doc,
  query,
  orderBy 
} from "firebase/firestore";
import { 
  getAuth, 
  signInAnonymously 
} from "firebase/auth";

// Konfigurasi Firebase Proyek Anda
const firebaseConfig = {
  apiKey: "AIzaSyAWCXIdc80wTjCkQ_VW3Vq6dS-lR3GJJZY",
  authDomain: "jst-official.firebaseapp.com",
  projectId: "jst-official",
  storageBucket: "jst-official.appspot.com",
  messagingSenderId: "481567359336",
  appId: "1:481567359336:web:6c7ac453c61550374496dd",
  measurementId: "G-43CHG2Z9T6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const DISCORD_INVITE_CODE = '4GzW6KTAyZ';
const DISCORD_INVITE_URL = `https://discord.gg/${DISCORD_INVITE_CODE}`;

// Daftar Kota & Kabupaten Super Lengkap di Indonesia (Termasuk Blitar, dll)
const INDONESIA_CITIES = [
  'Blitar', 'Kediri', 'Malang', 'Surabaya', 'Jogja', 'Solo', 'Semarang', 
  'Jakarta', 'Bandung', 'Medan', 'Makassar', 'Bali', 'Banten', 'Bogor', 
  'Depok', 'Tangerang', 'Bekasi', 'Sidoarjo', 'Jember', 'Banyuwangi', 
  'Madiun', 'Probolinggo', 'Pasuruan', 'Cirebon', 'Purwokerto', 'Magelang', 
  'Salatiga', 'Yogyakarta', 'Pontianak', 'Banjarmasin', 'Samarinda', 'Balikpapan', 
  'Manado', 'Palembang', 'Lampung', 'Padang', 'Pekanbaru', 'Lainnya'
];

const GAMES_LIST = [
  { id: 'roblox', name: 'Roblox', category: 'Sandbox & Party', activeCount: '25+ Squad', rating: '4.9', icon: '🟥', banner: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80' },
  { id: 'valorant', name: 'Valorant', category: 'Tactical FPS', activeCount: '18+ Squad', rating: '4.8', icon: '🎯', banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' },
  { id: 'mlbb', name: 'Mobile Legends', category: 'Mobile MOBA', activeCount: '30+ Squad', rating: '4.9', icon: '⚔️', banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80' },
  { id: 'pubg', name: 'PUBG Mobile', category: 'Battle Royale', activeCount: '12+ Squad', rating: '4.7', icon: '🪂', banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80' },
  { id: 'minecraft', name: 'Minecraft JST Server', category: 'Survival & Craft', activeCount: '15+ Online', rating: '4.9', icon: '⛏️', banner: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=800&q=80' },
  { id: 'cs2', name: 'Counter Strike 2', category: 'Competitive FPS', activeCount: '10+ Squad', rating: '4.8', icon: '💣', banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
  { id: 'gta5', name: 'GTA V / FiveM', category: 'Roleplay & Action', activeCount: '14+ Squad', rating: '4.8', icon: '🚗', banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80' },
  { id: 'dota2', name: 'Dota 2', category: 'Strategy MOBA', activeCount: '8+ Squad', rating: '4.7', icon: '🛡️', banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' }
];

export default function App() {
  // Navigation & Layout State
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'chat', 'voice', 'events', 'games', 'leaderboard', 'minigames'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  
  // Chat States
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Mini Games State
  const [wordChainInput, setWordChainInput] = useState('');
  const [wordChainHistory, setWordChainHistory] = useState(['Jawa', 'Ayam', 'Mabar', 'Roblox']);
  const [triviaAnswer, setTriviaAnswer] = useState('');
  const [triviaScore, setTriviaScore] = useState(0);

  // Discord Realtime API States
  const [discordApiData, setDiscordApiData] = useState({
    guildName: 'JST (Jawa Semua Teman)',
    onlineCount: 42,
    totalCount: 250,
    voiceRooms: [
      { id: 'v1', name: '☕ │ Cangkrukan Santai', count: 6 },
      { id: 'v2', name: '🟥 │ Mabar Roblox Party', count: 8 },
      { id: 'v3', name: '🎯 │ Valorant Squad #1', count: 5 },
      { id: 'v4', name: '🍿 │ Nobar Cinema & Film', count: 12 }
    ]
  });
  const [activeVoiceSession, setActiveVoiceSession] = useState(null);

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isUploadGalleryOpen, setIsUploadGalleryOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Forms
  const [regForm, setRegForm] = useState({
    username: '',
    fullName: '',
    city: 'Blitar',
    discordTag: '',
    favoriteGame: 'Roblox'
  });
  const [regAvatarPreview, setRegAvatarPreview] = useState(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Gaming',
    gameType: 'Roblox',
    date: '',
    time: '',
    prize: '',
    maxSlots: 10,
    description: ''
  });

  const [galleryForm, setGalleryForm] = useState({ title: '', tag: 'Gaming', imgUrl: '' });
  const [galleryPreview, setGalleryPreview] = useState(null);

  const [aiMessages, setAiMessages] = useState([
    { sender: 'bot', text: 'Halo Lur! Aku Mas JST, AI penolong komunitas. Ada yang bisa tak bantu?' }
  ]);
  const [aiInput, setAiInput] = useState('');

  // Firebase Synchronization
  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.error("Auth error:", err));

    const unsubMembers = onSnapshot(collection(db, "members"), (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    const unsubGallery = onSnapshot(collection(db, "gallery"), (snapshot) => {
      setGalleryItems(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    const qChat = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    const unsubChat = onSnapshot(qChat, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    fetchDiscordData();

    return () => {
      unsubMembers();
      unsubEvents();
      unsubGallery();
      unsubChat();
    };
  }, []);

  const fetchDiscordData = async () => {
    try {
      const res = await fetch(`https://discord.com/api/v10/invites/${DISCORD_INVITE_CODE}?with_counts=true`);
      if (res.ok) {
        const data = await res.json();
        setDiscordApiData(prev => ({
          ...prev,
          onlineCount: data.approximate_presence_count || prev.onlineCount,
          totalCount: data.approximate_member_count || prev.totalCount
        }));
      }
    } catch (e) {
      console.log('Using cached Discord data');
    }
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setRegAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.username.trim()) return;

    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(regForm.username)}&background=6366f1&color=fff&font-size=0.4`;

    const newMember = {
      id: Date.now(),
      username: regForm.username,
      city: regForm.city,
      discordTag: regForm.discordTag || `${regForm.username}#0000`,
      favoriteGame: regForm.favoriteGame,
      avatar: regAvatarPreview || fallbackAvatar,
      level: 1,
      xp: 25,
      badge: '🔥 Founding Member',
      joinDate: 'Agustus 2026'
    };

    try {
      await addDoc(collection(db, "members"), newMember);
      setCurrentUser(newMember);
      setIsRegisterOpen(false);
      setRegForm({ username: '', fullName: '', city: 'Blitar', discordTag: '', favoriteGame: 'Roblox' });
      setRegAvatarPreview(null);
    } catch (err) {
      console.error("Gagal mendaftar:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (!currentUser) {
      setIsRegisterOpen(true);
      return;
    }

    const newMessage = {
      username: currentUser.username,
      avatar: currentUser.avatar,
      text: chatInput,
      timestamp: Date.now()
    };

    try {
      await addDoc(collection(db, "chats"), newMessage);
      setChatInput('');
    } catch (err) {
      console.error("Gagal mengirim chat:", err);
    }
  };

  const handleClaimXp = async () => {
    if (!currentUser) {
      setIsRegisterOpen(true);
      return;
    }
    alert("Berhasil klaim +50 XP harian! Mbois tenan lur!");
  };

  const sortedMembers = [...members].sort((a, b) => b.xp - a.xp);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex relative overflow-x-hidden">
      
      {/* Background Aurora */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]" />
      </div>

      {/* ================= SIDEBAR NAVIGATION ================= */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-300 flex flex-col justify-between`}>
        <div>
          {/* Logo Area */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">JST</span>
                </div>
              </div>
              <div>
                <h1 className="font-extrabold text-white text-base tracking-tight">JST Official</h1>
                <p className="text-[10px] text-slate-400">Jawa Semua Teman</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Links */}
          <div className="p-4 space-y-1.5 text-xs font-semibold">
            <button 
              onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Home className="w-4 h-4" />
              <span>Beranda Utama</span>
            </button>

            <button 
              onClick={() => { setActiveTab('chat'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>💬 Live Chat Global</span>
            </button>

            <button 
              onClick={() => { setActiveTab('voice'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'voice' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Volume2 className="w-4 h-4" />
              <span>🎧 Voice Rooms</span>
            </button>

            <button 
              onClick={() => { setActiveTab('minigames'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'minigames' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Gamepad className="w-4 h-4" />
              <span>🎮 Mini Games (Mabar)</span>
            </button>

            <button 
              onClick={() => { setActiveTab('events'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'events' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Calendar className="w-4 h-4" />
              <span>📅 Event & Turnamen</span>
            </button>

            <button 
              onClick={() => { setActiveTab('games'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'games' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>🕹️ Game Hub Squad</span>
            </button>

            <button 
              onClick={() => { setActiveTab('leaderboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'leaderboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Trophy className="w-4 h-4" />
              <span>🏆 Peringkat Keaktifan</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="p-4 border-t border-slate-800">
          {currentUser ? (
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <img src={currentUser.avatar} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-indigo-500/40" />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{currentUser.username}</div>
                <div className="text-[10px] text-indigo-400 font-medium">{currentUser.city} • Lv.{currentUser.level}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Daftar Member</span>
            </button>
          )}
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen z-10">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>{discordApiData.onlineCount} Member Online Discord</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClaimXp}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Klaim XP Harian</span>
            </button>

            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#5865F2]/25 transition"
            >
              <Radio className="w-4 h-4" />
              <span>Discord</span>
            </a>
          </div>
        </header>

        {/* Dynamic Tab Contents */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-12">
              <div className="text-center py-8 sm:py-16 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Komunitas Gaming & Nongkrong Indonesia</span>
                </div>
                <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight mb-6">
                  Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">JST</span>
                </h1>
                <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto mb-8">
                  <strong className="text-slate-200">Jawa Semua Teman</strong> — Wadah mabar, nobar film, ngobrol seru, dan minigames interaktif lintas daerah dari Blitar hingga seluruh Indonesia.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button onClick={() => setActiveTab('chat')} className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition">
                    💬 Mulai Live Chat
                  </button>
                  <button onClick={() => setActiveTab('minigames')} className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition">
                    🎮 Main Mini Games
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHAT */}
          {activeTab === 'chat' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px]">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base">JST Global Community Chat</h3>
                    <p className="text-xs text-indigo-200">Kirim pesan realtime ke seluruh anggota</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/60">
                {messages.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-bold">Belum ada pesan.</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = currentUser && msg.username === currentUser.username;
                    return (
                      <div key={msg.docId || index} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <img src={msg.avatar || 'https://ui-avatars.com/api/?name=User'} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0" />
                        <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-xs font-extrabold text-indigo-300">{msg.username}</span>
                          </div>
                          <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'}`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
                <input
                  type="text"
                  placeholder={currentUser ? "Tulis pesan..." : "Daftar dulu untuk mengetik chat..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={!currentUser}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
                <button type="submit" disabled={!currentUser || !chatInput.trim()} className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50">
                  <span>Kirim</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB: VOICE ROOMS */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white">🎧 Voice Rooms Komunitas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {discordApiData.voiceRooms.map((room) => {
                  const isConnected = activeVoiceSession === room.id;
                  return (
                    <div key={room.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1">{room.name}</h3>
                        <p className="text-xs text-slate-400 mb-4">{room.count} Member Aktif</p>
                      </div>
                      <button
                        onClick={() => {
                          if (!currentUser) { setIsRegisterOpen(true); return; }
                          setActiveVoiceSession(isConnected ? null : room.id);
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${isConnected ? 'bg-rose-600 text-white animate-pulse' : 'bg-indigo-600 text-white'}`}
                      >
                        {isConnected ? 'Keluar Voice Room' : 'Masuk Voice Room'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {activeVoiceSession && (
                <div className="bg-slate-950 border border-indigo-500/50 rounded-3xl p-4 shadow-2xl">
                  <div className="flex justify-between mb-3 px-2">
                    <span className="text-xs font-bold text-indigo-300">Terhubung ke Ruang Suara</span>
                    <button onClick={() => setActiveVoiceSession(null)} className="text-xs text-slate-400 hover:text-white">Tutup</button>
                  </div>
                  <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-black">
                    <iframe src={`https://meet.jit.si/JSTCommunityRoom_${activeVoiceSession}`} allow="camera; microphone; fullscreen" width="100%" height="100%" style={{ border: 0 }}></iframe>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: MINI GAMES */}
          {activeTab === 'minigames' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">🎮 Mini Games Interaktif JST</h2>
                <p className="text-xs sm:text-sm text-slate-400">Mainkan game seru bareng member lain dan kumpulkan XP!</p>
              </div>

              {/* Game 1: Sambung Kata */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <h3 className="font-extrabold text-white text-base mb-2">🕹️ Sambung Kata Komunitas</h3>
                <p className="text-xs text-slate-400 mb-4">Sambung kata terakhir dari kata sebelumnya!</p>
                <div className="flex flex-wrap gap-2 mb-4 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  {wordChainHistory.map((word, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-xl text-xs font-bold">{word}</span>
                  ))}
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!wordChainInput.trim()) return;
                  setWordChainHistory([...wordChainHistory, wordChainInput.trim()]);
                  setWordChainInput('');
                }} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ketik sambungan kata..."
                    value={wordChainInput}
                    onChange={(e) => setWordChainInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">Kirim</button>
                </form>
              </div>

              {/* Game 2: Tebak Trivia Gaming */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <h3 className="font-extrabold text-white text-base mb-2">🎯 Trivia Tebak Game</h3>
                <p className="text-xs text-slate-400 mb-3">Soal: Game sandbox populer dengan karakter balok dan bisa survival di server JST?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Jawabanmu..."
                    value={triviaAnswer}
                    onChange={(e) => setTriviaAnswer(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                  <button onClick={() => {
                    if (triviaAnswer.toLowerCase().includes('minecraft')) {
                      alert("Benar! +20 XP ditambahkan!");
                      setTriviaScore(triviaScore + 20);
                      setTriviaAnswer('');
                    } else {
                      alert("Masih salah lur, coba lagi!");
                    }
                  }} className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs">Jawab</button>
                </div>
                <div className="mt-3 text-xs text-amber-400 font-bold">Skor Trivia Kamu: {triviaScore} XP</div>
              </div>
            </div>
          )}

          {/* TAB: EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white">📅 Event & Turnamen</h2>
                <button onClick={() => { if (!currentUser) setIsRegisterOpen(true); else setIsCreateEventOpen(true); }} className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs">
                  + Buat Event
                </button>
              </div>
              {events.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
                  <p className="text-xs text-slate-400">Belum ada event aktif.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((ev) => (
                    <div key={ev.docId || ev.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
                      <h3 className="font-bold text-white text-base mb-2">{ev.title}</h3>
                      <p className="text-xs text-slate-400 mb-4">{ev.description}</p>
                      <div className="text-xs text-indigo-300 font-bold">{ev.date} — {ev.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: GAMES */}
          {activeTab === 'games' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white">🕹️ Game Hub Squad</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {GAMES_LIST.map((game) => (
                  <div key={game.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                    <div className="h-36 relative overflow-hidden">
                      <img src={game.banner} alt={game.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 text-2xl">{game.icon}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white text-sm mb-1">{game.name}</h3>
                      <p className="text-[11px] text-slate-400 mb-3">{game.category}</p>
                      <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className="block w-full py-2 rounded-xl bg-indigo-600 text-white text-center font-bold text-xs">
                        Join Squad
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-white">🏆 Peringkat Keaktifan Member</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-xs font-bold border-b border-slate-800">
                      <th className="p-4 pl-6">Rank</th>
                      <th className="p-4">Member</th>
                      <th className="p-4">Asal Kota</th>
                      <th className="p-4">XP & Level</th>
                      <th className="p-4 pr-6">Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs font-semibold">
                    {sortedMembers.map((m, idx) => (
                      <tr key={m.docId || m.id} className="hover:bg-slate-800/40">
                        <td className="p-4 pl-6 font-extrabold text-white">#{idx + 1}</td>
                        <td className="p-4 flex items-center gap-3">
                          <img src={m.avatar} alt="Avatar" className="w-8 h-8 rounded-xl object-cover" />
                          <span className="font-bold text-white">{m.username}</span>
                        </td>
                        <td className="p-4 text-slate-300">{m.city}</td>
                        <td className="p-4 text-indigo-300 font-bold">Lv.{m.level} ({m.xp} XP)</td>
                        <td className="p-4 pr-6 text-amber-300 font-bold">{m.badge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= REGISTRATION MODAL ================= */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsRegisterOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-white mb-1">Daftar Member JST</h3>
            <p className="text-xs text-slate-400 mb-5">Gabung komunitas dan atur profilmu!</p>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Foto Profil</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                    {regAvatarPreview ? <img src={regAvatarPreview} alt="Preview" className="w-full h-full object-cover" /> : <Users className="w-6 h-6 text-slate-600" />}
                  </div>
                  <label className="cursor-pointer flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span>Upload Foto</span>
                    <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Username / Gamertag *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MasSurya_Blitar"
                  value={regForm.username}
                  onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Asal Kota / Kabupaten</label>
                <select
                  value={regForm.city}
                  onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  {INDONESIA_CITIES.map((cityName) => (
                    <option key={cityName} value={cityName}>{cityName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Game Utamamu</label>
                <select
                  value={regForm.favoriteGame}
                  onChange={(e) => setRegForm({ ...regForm, favoriteGame: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Roblox">Roblox</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Mobile Legends">Mobile Legends</option>
                  <option value="Minecraft">Minecraft</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 mt-2">
                Selesaikan Pendaftaran
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
