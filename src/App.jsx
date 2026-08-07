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
  Send
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  
  // Chat States
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

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
  const [isSyncingDiscord, setIsSyncingDiscord] = useState(false);
  const [activeVoiceSession, setActiveVoiceSession] = useState(null);

  // Modals & Forms State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isUploadGalleryOpen, setIsUploadGalleryOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Gallery Upload Form State
  const [galleryForm, setGalleryForm] = useState({ title: '', tag: 'Gaming', imgUrl: '' });
  const [galleryPreview, setGalleryPreview] = useState(null);

  // Member Register Form State
  const [regForm, setRegForm] = useState({
    username: '',
    fullName: '',
    city: 'Jogja',
    discordTag: '',
    favoriteGame: 'Roblox'
  });
  const [regAvatarPreview, setRegAvatarPreview] = useState(null);

  // Event Creation Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Gaming',
    gameType: 'Roblox',
    date: '',
    time: '',
    prize: '',
    maxSlots: 10,
    description: '',
    bannerUrl: ''
  });

  // AI Chat Bot States
  const [aiMessages, setAiMessages] = useState([
    { sender: 'bot', text: 'Halo Lur! Aku Mas JST, AI penolong komunitas Jawa Semua Teman. Ada yang bisa tak bantu seputar mabar, event, atau Discord?' }
  ]);
  const [aiInput, setAiInput] = useState('');

  // Autentikasi Anonim & Sinkronisasi Realtime Firestore
  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.error("Auth error:", err));

    // Sinkronisasi Realtime Members
    const unsubMembers = onSnapshot(collection(db, "members"), (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    // Sinkronisasi Realtime Events
    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    // Sinkronisasi Realtime Gallery
    const unsubGallery = onSnapshot(collection(db, "gallery"), (snapshot) => {
      setGalleryItems(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    // Sinkronisasi Realtime Chat (diurutkan berdasarkan waktu)
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
    setIsSyncingDiscord(true);
    try {
      const res = await fetch(`https://discord.com/api/v10/invites/${DISCORD_INVITE_CODE}?with_counts=true`);
      if (res.ok) {
        const data = await res.json();
        setDiscordApiData(prev => ({
          ...prev,
          guildName: data.guild?.name || prev.guildName,
          onlineCount: data.approximate_presence_count || prev.onlineCount,
          totalCount: data.approximate_member_count || prev.totalCount
        }));
      }
    } catch (e) {
      console.log('Using cached Discord invite data');
    } finally {
      setIsSyncingDiscord(false);
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
      fullName: regForm.fullName || regForm.username,
      city: regForm.city,
      discordTag: regForm.discordTag || `${regForm.username}#0000`,
      favoriteGame: regForm.favoriteGame,
      avatar: regAvatarPreview || fallbackAvatar,
      level: 1,
      xp: 15,
      voiceMinutes: 0,
      badge: '🔥 Active Member',
      role: 'Member JST',
      joinDate: 'Agustus 2026'
    };

    try {
      await addDoc(collection(db, "members"), newMember);
      setCurrentUser(newMember);
      setIsRegisterOpen(false);
      setRegForm({ username: '', fullName: '', city: 'Jogja', discordTag: '', favoriteGame: 'Roblox' });
      setRegAvatarPreview(null);
    } catch (err) {
      console.error("Gagal mendaftar:", err);
    }
  };

  // Kirim Pesan Chat Antar Member
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
      console.error("Gagal mengirim pesan chat:", err);
    }
  };

  const handleCreateEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    const newEvent = {
      id: Date.now(),
      title: eventForm.title,
      category: eventForm.category,
      gameType: eventForm.gameType,
      date: eventForm.date || 'Sabtu, 15 Agustus 2026',
      time: eventForm.time || '19:30 WIB',
      prize: eventForm.prize || 'Sertifikat & Role Discord',
      host: currentUser ? currentUser.username : 'Pengurus JST',
      maxSlots: parseInt(eventForm.maxSlots) || 10,
      participants: currentUser ? [currentUser.id] : [],
      description: eventForm.description || 'Mari mabar dan ramaikan event komunitas JST!',
      banner: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80'
    };

    try {
      await addDoc(collection(db, "events"), newEvent);
      setIsCreateEventOpen(false);
      setEventForm({ title: '', category: 'Gaming', gameType: 'Roblox', date: '', time: '', prize: '', maxSlots: 10, description: '', bannerUrl: '' });
    } catch (err) {
      console.error("Gagal buat event:", err);
    }
  };

  const handleGalleryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreview(reader.result);
        setGalleryForm({ ...galleryForm, imgUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryForm.title.trim() || !galleryForm.imgUrl) return;

    const newItem = {
      id: Date.now(),
      title: galleryForm.title,
      tag: galleryForm.tag,
      img: galleryForm.imgUrl,
      uploader: currentUser ? currentUser.username : 'Member JST',
      date: 'Baru saja'
    };

    try {
      await addDoc(collection(db, "gallery"), newItem);
      setIsUploadGalleryOpen(false);
      setGalleryForm({ title: '', tag: 'Gaming', imgUrl: '' });
      setGalleryPreview(null);
    } catch (err) {
      console.error("Gagal upload galeri:", err);
    }
  };

  const toggleJoinEvent = async (ev) => {
    if (!currentUser) {
      setIsRegisterOpen(true);
      return;
    }
    const isAlreadyJoined = ev.participants.includes(currentUser.id);
    const updatedParticipants = isAlreadyJoined
      ? ev.participants.filter(id => id !== currentUser.id)
      : [...ev.participants, currentUser.id];

    try {
      await updateDoc(doc(db, "events", ev.docId), { participants: updatedParticipants });
    } catch (err) {
      console.error("Gagal gabung event:", err);
    }
  };

  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setAiMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setAiInput('');

    setTimeout(() => {
      let botResponse = 'Mbois tenan lur! Matur nuwun wis takon. Silakan gabung ke Discord resmi JST untuk mabar bareng squad kami.';
      const textLower = userText.toLowerCase();

      if (textLower.includes('roblox') || textLower.includes('game')) {
        botResponse = 'Di JST banyak seng seneng mabar Roblox & Mobile Legends! Monggo cek bagian Game Hub atau langsung gabung voice channel Discord ya.';
      } else if (textLower.includes('daftar') || textLower.includes('member')) {
        botResponse = 'Carane gampang banget! Cukup klik tombol "Daftar Member" di navbar, isi gamertag karo unggah foto galeri profilmu!';
      } else if (textLower.includes('discord') || textLower.includes('voice')) {
        botResponse = `Server Discord resmi JST ada di link ${DISCORD_INVITE_URL}. Saiki lagi rame voice room lur!`;
      }

      setAiMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  const sortedMembers = [...members].sort((a, b) => b.xp - a.xp);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Aurora Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px]" />
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 text-lg sm:text-xl">JST</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">JST</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-400 rounded-md border border-indigo-500/30">COMMUNITY</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Jawa Semua Teman</p>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-300">
            <a href="#hero" className="hover:text-indigo-400 transition">Beranda</a>
            <a href="#community-chat" className="hover:text-indigo-400 transition text-indigo-400 font-bold">💬 Live Chat</a>
            <a href="#events" className="hover:text-indigo-400 transition">Event</a>
            <a href="#voice" className="hover:text-indigo-400 transition">Voice Chat</a>
            <a href="#games" className="hover:text-indigo-400 transition">Game Hub</a>
            <a href="#leaderboard" className="hover:text-indigo-400 transition">Peringkat</a>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 pr-3">
                <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-xl object-cover border border-indigo-500/40" />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight">{currentUser.username}</div>
                  <div className="text-[10px] text-indigo-400 font-medium">Lv. {currentUser.level} • {currentUser.city}</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Daftar Member</span>
              </button>
            )}

            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="hidden sm:inline">Discord</span>
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-5 space-y-3">
            <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-slate-200">Beranda</a>
            <a href="#community-chat" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-indigo-400">💬 Live Chat Antar Member</a>
            <a href="#events" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-slate-200">Event Komunitas</a>
            <a href="#voice" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-slate-200">Voice Chat & Discord</a>
            <a href="#games" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-slate-200">Game Hub</a>
            <a href="#leaderboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-slate-200">Peringkat Keaktifan</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>Komunitas Gaming & Nongkrong Indonesia</span>
        </div>

        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-5xl mx-auto mb-6">
          Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300">JST</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-xl max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
          <strong className="text-slate-200 font-semibold">Jawa Semua Teman</strong> — Tempat mabar, ngobrol real-time lintas perangkat, dan nongkrong tanpa sekat.
        </p>
      </section>

      {/* ========================================== */}
      {/* FITUR BARU: LIVE COMMUNITY CHAT (TEXT CHAT) */}
      {/* ========================================== */}
      <section id="community-chat" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-white text-base sm:text-lg">JST Global Community Chat</h3>
                <p className="text-xs text-indigo-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Realtime Cloud Messages
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-indigo-200 bg-black/20 px-3 py-1.5 rounded-xl hidden sm:block">
              {currentUser ? `Login sebagai: ${currentUser.username}` : 'Belum Login Member'}
            </div>
          </div>

          {/* Messages Box */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/60">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-bold">Belum ada percakapan di chatroom.</p>
                <p className="text-xs">Jadilah yang pertama mengirim pesan menyapa kawan JST!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = currentUser && msg.username === currentUser.username;
                return (
                  <div key={msg.docId || index} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <img src={msg.avatar || 'https://ui-avatars.com/api/?name=User'} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0" />
                    <div className={`max-w-[75%] sm:max-w-[60%] ${isMe ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-xs font-extrabold text-indigo-300">{msg.username}</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
            <input
              type="text"
              placeholder={currentUser ? "Tulis pesan ke sesama member JST..." : "Silakan daftar/login member dulu untuk mengetik chat..."}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={!currentUser}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!currentUser || !chatInput.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition shrink-0"
            >
              <span>Kirim</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* ========================================== */}
      {/* VOICE CHAT SECTION (JITSI / DISCORD EMBED) */}
      {/* ========================================== */}
      <section id="voice" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Instant Web Voice Rooms
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Voice Chat Antar Player</h2>
              <p className="text-slate-400 text-xs sm:text-base mt-1">
                Gunakan ruang suara langsung di web atau sambungkan ke server Discord resmi JST.
              </p>
            </div>

            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#5865F2]/30 transition"
            >
              <Radio className="w-4 h-4" />
              <span>Buka Server Discord Utama</span>
            </a>
          </div>

          {/* Voice Rooms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {discordApiData.voiceRooms.map((room) => {
              const isConnected = activeVoiceSession === room.id;
              return (
                <div key={room.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200 truncate">{room.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-4">Ruang Suara Komunitas JST</p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          setIsRegisterOpen(true);
                          return;
                        }
                        setActiveVoiceSession(isConnected ? null : room.id);
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                        isConnected
                          ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isConnected ? 'Keluar Voice Room' : 'Masuk Voice Room'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Embedded Jitsi WebRTC Voice Room (Muncul saat user klik masuk voice) */}
          {activeVoiceSession && (
            <div className="mt-6 bg-slate-950 border border-indigo-500/50 rounded-3xl p-4 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" /> Terhubung ke Room: {activeVoiceSession}
                </span>
                <button
                  onClick={() => setActiveVoiceSession(null)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Tutup Voice
                </button>
              </div>
              <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={`https://meet.jit.si/JSTCommunityRoom_${activeVoiceSession}`}
                  allow="camera; microphone; fullscreen; display-capture"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold mb-2">
              <Calendar className="w-3.5 h-3.5" /> Agenda Komunitas
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Event & Turnamen Buatan Member</h2>
          </div>

          <button
            onClick={() => {
              if (!currentUser) setIsRegisterOpen(true);
              else setIsCreateEventOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/25 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Event Baru</span>
          </button>
        </div>

        {events.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white text-lg mb-1">Belum Ada Event Aktif</h3>
            <button
              onClick={() => {
                if (!currentUser) setIsRegisterOpen(true);
                else setIsCreateEventOpen(true);
              }}
              className="mt-4 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              + Buat Event Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => {
              const isJoined = currentUser && ev.participants.includes(currentUser.id);
              return (
                <div key={ev.docId || ev.id} className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col hover:border-purple-500/40 transition">
                  <div className="h-44 relative">
                    <img src={ev.banner} alt={ev.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-extrabold text-indigo-300 border border-slate-700">
                      {ev.category} • {ev.gameType}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white mb-2 leading-snug">{ev.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">{ev.description}</p>
                      <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{ev.date} — {ev.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-purple-400" />
                          <span>Peserta: {ev.participants.length} / {ev.maxSlots} Slots</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleJoinEvent(ev)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                        isJoined ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isJoined ? '✓ Terdaftar (Batal)' : 'Ikut Event Ini'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Game Hub Section */}
      <section id="games" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-2">
            <Gamepad2 className="w-3.5 h-3.5" /> Game Hub JST
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">Game Favorit Anggota Komunitas</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GAMES_LIST.map((game) => (
            <div key={game.id} className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition duration-300">
              <div className="h-40 relative overflow-hidden">
                <img src={game.banner} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <span className="absolute top-3 left-3 text-2xl">{game.icon}</span>
              </div>
              <div className="p-5">
                <h3 className="font-extrabold text-white text-base mb-1">{game.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{game.category}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold text-indigo-400">{game.activeCount}</span>
                  <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-bold text-xs transition">
                    Join Squad
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard Section */}
      <section id="leaderboard" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" /> Peringkat Anggota
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">Peringkat Keaktifan Member JST</h2>
        </div>
        {members.length === 0 ? (
          <div className="py-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-6">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white text-base mb-1">Papan Peringkat Masih Kosong</h3>
            <button onClick={() => setIsRegisterOpen(true)} className="mt-3 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">
              Daftar Jadi Member Pertama
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 text-xs font-bold border-b border-slate-800">
                    <th className="p-4 pl-6">Rank</th>
                    <th className="p-4">Member</th>
                    <th className="p-4">Kota</th>
                    <th className="p-4">Level & XP</th>
                    <th className="p-4">Game Favorit</th>
                    <th className="p-4 pr-6">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-semibold">
                  {sortedMembers.map((m, idx) => (
                    <tr key={m.docId || m.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 pl-6 font-extrabold text-white">
                        {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={m.avatar} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                          <div>
                            <div className="font-bold text-white">{m.username}</div>
                            <div className="text-[10px] text-slate-400">{m.discordTag}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{m.city}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold">
                          Lv.{m.level} ({m.xp} XP)
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{m.favoriteGame}</td>
                      <td className="p-4 pr-6">
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-300 text-[10px] font-extrabold">
                          {m.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* AI Assistant Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {isAiChatOpen ? (
          <div className="w-[calc(100vw-3rem)] sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[480px]">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-white" />
                <div>
                  <h3 className="font-extrabold text-white text-sm leading-tight">Mas JST (AI Bot)</h3>
                  <p className="text-[10px] text-indigo-200">Asisten Komunitas Jawa Semua Teman</p>
                </div>
              </div>
              <button onClick={() => setIsAiChatOpen(false)} className="text-white hover:text-slate-200 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50 text-xs">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleAiSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Tanya Mas JST..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsAiChatOpen(true)}
            className="p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/40 hover:scale-105 transition flex items-center gap-2 group"
          >
            <Bot className="w-6 h-6" />
            <span className="font-bold text-xs pr-1 hidden sm:inline">Tanya Mas JST</span>
          </button>
        )}
      </div>

      {/* Registration Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsRegisterOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-white mb-1">Daftar Member JST</h3>
            <p className="text-xs text-slate-400 mb-5">Bergabung dengan komunitas Jawa Semua Teman dan dapatkan akses penuh!</p>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Unggah Foto Galeri Profil</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                    {regAvatarPreview ? (
                      <img src={regAvatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <label className="cursor-pointer flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span>Pilih Foto dari Perangkat</span>
                    <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Gamertag / Username *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MasSurya_JST"
                  value={regForm.username}
                  onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Asal Kota</label>
                  <select
                    value={regForm.city}
                    onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Jogja">Jogja</option>
                    <option value="Solo">Solo</option>
                    <option value="Semarang">Semarang</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Malang">Malang</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Lainnya">Kota Lain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Game Utamamu</label>
                  <select
                    value={regForm.favoriteGame}
                    onChange={(e) => setRegForm({ ...regForm, favoriteGame: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Roblox">Roblox</option>
                    <option value="Valorant">Valorant</option>
                    <option value="Mobile Legends">Mobile Legends</option>
                    <option value="PUBG Mobile">PUBG Mobile</option>
                    <option value="Minecraft">Minecraft</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 mt-2"
              >
                Selesaikan Pendaftaran
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreateEventOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsCreateEventOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-white mb-1">Buat Event / Turnamen</h3>
            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Judul Event *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Turnamen Roblox Survival JST"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 text-white font-extrabold text-xs">
                Publikasikan Event Komunitas
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-xs text-slate-500">
        <p>© 2026 JST Community Platform. All rights reserved.</p>
      </footer>

    </div>
  );
}
