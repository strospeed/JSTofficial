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
  ExternalLink
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

const DISCORD_SERVER_ID = 'MASUKKAN_SERVER_ID_ANDA'; // Ganti dengan Server ID Discord Anda
const DISCORD_INVITE_URL = `https://discord.gg/4GzW6KTAyZ`;

// Daftar Kota & Kabupaten Super Lengkap (Termasuk Blitar)
const INDONESIA_CITIES = [
  'Blitar', 'Kediri', 'Malang', 'Surabaya', 'Jogja', 'Solo', 'Semarang', 
  'Jakarta', 'Bandung', 'Medan', 'Makassar', 'Bali', 'Banten', 'Bogor', 
  'Depok', 'Tangerang', 'Bekasi', 'Sidoarjo', 'Jember', 'Banyuwangi', 
  'Madiun', 'Probolinggo', 'Pasuruan', 'Cirebon', 'Purwokerto', 'Magelang', 
  'Salatiga', 'Pontianak', 'Banjarmasin', 'Samarinda', 'Balikpapan', 
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

// Game Arcade Embed untuk Game Lounge
const ARCADE_GAMES = [
  { id: 'krunker', name: 'Krunker.io (FPS)', url: 'https://krunker.io/', banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80' },
  { id: 'chess', name: 'Chess Online', url: 'https://www.chess.com/play/computer', banner: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80' },
  { id: 'paperio', name: 'Paper.io 2', url: 'https://paper.io/', banner: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Discord Live API States
  const [discordData, setDiscordData] = useState({
    name: 'JST (Jawa Semua Teman)',
    presence_count: 0,
    members: [],
    channels: [],
    instant_invite: DISCORD_INVITE_URL
  });
  const [selectedGameUrl, setSelectedGameUrl] = useState(null);

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isUploadGalleryOpen, setIsUploadGalleryOpen] = useState(false);

  // Form States
  const [regForm, setRegForm] = useState({ username: '', city: 'Blitar', favoriteGame: 'Roblox', discordTag: '' });
  const [regAvatarPreview, setRegAvatarPreview] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', category: 'Gaming', gameType: 'Roblox', date: '', time: '', prize: '', maxSlots: 10, description: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', tag: 'Gaming', imgUrl: '' });
  const [galleryPreview, setGalleryPreview] = useState(null);

  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.error("Auth error:", err));

    // Firestore Sync
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

    // Fetch Discord Realtime Data via Widget JSON API
    fetchDiscordRealtimeData();
    const interval = setInterval(fetchDiscordRealtimeData, 10000); // Refresh tiap 10 detik

    return () => {
      unsubMembers();
      unsubEvents();
      unsubGallery();
      unsubChat();
      clearInterval(interval);
    };
  }, []);

  const fetchDiscordRealtimeData = async () => {
    try {
      // Menggunakan API Widget Discord Resmi
      const res = await fetch(`https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`);
      if (res.ok) {
        const data = await res.json();
        setDiscordData(data);
      }
    } catch (e) {
      console.log('Gagal mengambil data Discord, pastikan Server Widget aktif.');
    }
  };

  const handleAvatarUpload = (e) => {
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
      xp: 30,
      badge: '🔥 Active Member',
      joinDate: 'Agustus 2026'
    };

    try {
      await addDoc(collection(db, "members"), newMember);
      setCurrentUser(newMember);
      setIsRegisterOpen(false);
      setRegForm({ username: '', city: 'Blitar', favoriteGame: 'Roblox', discordTag: '' });
      setRegAvatarPreview(null);
    } catch (err) {
      console.error("Gagal mendaftar:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!currentUser) { setIsRegisterOpen(true); return; }

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
      console.error("Gagal chat:", err);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;
    const newEvent = { ...eventForm, id: Date.now(), participants: [currentUser?.id] };
    await addDoc(collection(db, "events"), newEvent);
    setIsCreateEventOpen(false);
  };

  const handleUploadGallery = async (e) => {
    e.preventDefault();
    if (!galleryForm.title.trim() || !galleryForm.imgUrl) return;
    const newItem = { ...galleryForm, id: Date.now(), uploader: currentUser?.username || 'Member' };
    await addDoc(collection(db, "gallery"), newItem);
    setIsUploadGalleryOpen(false);
    setGalleryForm({ title: '', tag: 'Gaming', imgUrl: '' });
    setGalleryPreview(null);
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

          <div className="p-4 space-y-1.5 text-xs font-semibold">
            <button onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Home className="w-4 h-4" /><span>Beranda Utama</span>
            </button>
            <button onClick={() => { setActiveTab('chat'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <MessageSquare className="w-4 h-4" /><span>💬 Live Chat Global</span>
            </button>
            <button onClick={() => { setActiveTab('discord-live'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'discord-live' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Volume2 className="w-4 h-4 text-emerald-400" /><span>🔴 Live Discord Voice & Members</span>
            </button>
            <button onClick={() => { setActiveTab('gamelounge'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'gamelounge' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Gamepad className="w-4 h-4" /><span>🕹️ JST Game Lounge</span>
            </button>
            <button onClick={() => { setActiveTab('members'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'members' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Users className="w-4 h-4" /><span>👥 Daftar Member Lengkap</span>
            </button>
            <button onClick={() => { setActiveTab('events'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'events' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Calendar className="w-4 h-4" /><span>📅 Event & Turnamen</span>
            </button>
            <button onClick={() => { setActiveTab('gallery'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'gallery' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <ImageIcon className="w-4 h-4" /><span>🖼️ Galeri Momen</span>
            </button>
            <button onClick={() => { setActiveTab('leaderboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'leaderboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Trophy className="w-4 h-4" /><span>🏆 Peringkat Keaktifan</span>
            </button>
          </div>
        </div>

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
            <button onClick={() => setIsRegisterOpen(true)} className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
              <UserCheck className="w-4 h-4" /><span>Daftar Member</span>
            </button>
          )}
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen z-10">
        
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>{discordData.presence_count} Member Online di Discord</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href={discordData.instant_invite} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition">
              <Radio className="w-4 h-4" /><span>Gabung Discord</span>
            </a>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-12">
              <div className="text-center py-12 sm:py-20 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-12 shadow-2xl">
                <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight mb-6">
                  Komunitas <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">JST Official</span>
                </h1>
                <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto mb-8">
                  Jawa Semua Teman — Terhubung secara realtime dengan Discord server, direktori member lengkap dengan foto profil dari berbagai daerah seperti Blitar, Surabaya, Malang, dan lainnya.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button onClick={() => setActiveTab('discord-live')} className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg">
                    🔴 Cek Live Discord Voice
                  </button>
                  <button onClick={() => setActiveTab('gamelounge')} className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg">
                    🕹️ Main di Game Lounge
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LIVE DISCORD (REALTIME VOICE & MEMBERS) */}
          {activeTab === 'discord-live' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-white mb-2">🔴 Live Server Discord</h2>
                <p className="text-xs text-slate-400">Data ini diambil secara langsung dan realtime dari server Discord Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Voice Channels List */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-indigo-400" /> Daftar Voice Channel Aktif
                  </h3>
                  <div className="space-y-3">
                    {discordData.channels && discordData.channels.length > 0 ? (
                      discordData.channels.map((channel) => (
                        <div key={channel.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">🔊 {channel.name}</span>
                          <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">Channel Aktif</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">Tidak ada data channel atau widget belum diaktifkan di server Discord.</p>
                    )}
                  </div>
                </div>

                {/* Online Members List from Discord */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" /> Member Online di Discord ({discordData.presence_count})
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {discordData.members && discordData.members.length > 0 ? (
                      discordData.members.map((m, idx) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                          <img src={m.avatar_url} alt="Avatar" className="w-8 h-8 rounded-xl object-cover" />
                          <div>
                            <div className="text-xs font-bold text-white">{m.username}</div>
                            <div className="text-[10px] text-emerald-400">● Online</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">Belum ada member online yang terdeteksi widget.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GAME LOUNGE (EMBEDDED GAMES) */}
          {activeTab === 'gamelounge' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-white mb-2">🕹️ JST Game Lounge</h2>
                <p className="text-xs text-slate-400">Mainkan game web interaktif berkualitas tinggi langsung bersama komunitas!</p>
              </div>

              {selectedGameUrl ? (
                <div className="bg-slate-900 border border-indigo-500/50 rounded-3xl p-4 shadow-2xl">
                  <div className="flex justify-between mb-3 px-2">
                    <span className="text-xs font-bold text-indigo-300">Sedang Memainkan Game Arcade</span>
                    <button onClick={() => setSelectedGameUrl(null)} className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-bold text-white">Tutup Game</button>
                  </div>
                  <div className="w-full h-[600px] rounded-2xl overflow-hidden bg-black">
                    <iframe src={selectedGameUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen></iframe>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {ARCADE_GAMES.map((game) => (
                    <div key={game.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden group hover:border-indigo-500 transition">
                      <div className="h-44 relative overflow-hidden">
                        <img src={game.banner} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-white text-base mb-3">{game.name}</h3>
                        <button onClick={() => setSelectedGameUrl(game.url)} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2">
                          <ExternalLink className="w-4 h-4" /> Mainkan Sekarang
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MEMBERS (DIREKTORI MEMBER LENGKAP DENGAN FOTO PROFIL) */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">👥 Direktori Member JST</h2>
                  <p className="text-xs text-slate-400">Daftar lengkap anggota komunitas dari berbagai daerah.</p>
                </div>
                <button onClick={() => setIsRegisterOpen(true)} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">
                  + Daftar / Edit Profil
                </button>
              </div>

              {members.length === 0 ? (
                <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800">
                  <p className="text-xs text-slate-400 mb-3">Belum ada member terdaftar di database web.</p>
                  <button onClick={() => setIsRegisterOpen(true)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">Daftar Jadi Yang Pertama</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {members.map((m) => (
                    <div key={m.docId || m.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center gap-4 hover:border-indigo-500/40 transition">
                      <img src={m.avatar} alt={m.username} className="w-16 h-16 rounded-2xl object-cover border border-indigo-500/40 shrink-0" />
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-white text-sm truncate">{m.username}</h3>
                        <p className="text-xs text-indigo-400 font-medium">📍 {m.city}</p>
                        <p className="text-[11px] text-slate-400 mt-1">🎮 Game: {m.favoriteGame}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 text-[10px] font-bold">{m.badge}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: CHAT */}
          {activeTab === 'chat' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px]">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-5">
                <h3 className="font-black text-white text-base">JST Global Community Chat</h3>
                <p className="text-xs text-indigo-200">Kirim pesan realtime antar member</p>
              </div>
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/60">
                {messages.map((msg, index) => {
                  const isMe = currentUser && msg.username === currentUser.username;
                  return (
                    <div key={msg.docId || index} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <img src={msg.avatar || 'https://ui-avatars.com/api/?name=User'} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0" />
                      <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                        <div className="text-xs font-extrabold text-indigo-300 mb-1">{msg.username}</div>
                        <div className={`p-3.5 rounded-2xl text-xs sm:text-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'}`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
                <input
                  type="text"
                  placeholder={currentUser ? "Tulis pesan..." : "Daftar member dulu untuk chat..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={!currentUser}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
                <button type="submit" disabled={!currentUser || !chatInput.trim()} className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs flex items-center gap-2 disabled:opacity-50">
                  <span>Kirim</span><Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB: EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white">📅 Event & Turnamen</h2>
                <button onClick={() => { if (!currentUser) setIsRegisterOpen(true); else setIsCreateEventOpen(true); }} className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs">+ Buat Event</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((ev) => (
                  <div key={ev.docId || ev.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
                    <h3 className="font-bold text-white text-base mb-2">{ev.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">{ev.description}</p>
                    <div className="text-xs text-indigo-300 font-bold">{ev.date} — {ev.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white">🖼️ Galeri Momen</h2>
                <button onClick={() => { if (!currentUser) setIsRegisterOpen(true); else setIsUploadGalleryOpen(true); }} className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs">+ Upload Foto</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {galleryItems.map((item) => (
                  <div key={item.docId || item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-56 relative group">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 p-4 flex flex-col justify-end">
                      <div className="text-[10px] text-indigo-300 font-bold">{item.tag}</div>
                      <div className="text-xs font-bold text-white">{item.title}</div>
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

      {/* ================= REGISTRATION MODAL (DENGAN UPLOAD FOTO & PILIHAN KOTA) ================= */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsRegisterOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black text-white mb-1">Daftar Member JST</h3>
            <p className="text-xs text-slate-400 mb-5">Atur profilmu dan tampilkan asal kotamu!</p>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Upload Foto Profil</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                    {regAvatarPreview ? <img src={regAvatarPreview} alt="Preview" className="w-full h-full object-cover" /> : <Users className="w-6 h-6 text-slate-600" />}
                  </div>
                  <label className="cursor-pointer flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-indigo-400" /><span>Pilih Foto</span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Asal Kota / Kabupaten</label>
                <select
                  value={regForm.city}
                  onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Roblox">Roblox</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Mobile Legends">Mobile Legends</option>
                  <option value="Minecraft">Minecraft</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-lg mt-2">
                Selesaikan Pendaftaran
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {isCreateEventOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsCreateEventOpen(false)} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black text-white mb-4">Buat Event Komunitas</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <input type="text" required placeholder="Judul Event" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white" />
              <input type="text" placeholder="Tanggal & Jam (Sabtu, 19:00 WIB)" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white" />
              <textarea placeholder="Deskripsi Event" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"></textarea>
              <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs">Publikasikan Event</button>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD GALLERY MODAL */}
      {isUploadGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsUploadGalleryOpen(false)} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black text-white mb-4">Upload Foto Momen</h3>
            <form onSubmit={handleUploadGallery} className="space-y-4">
              <input type="text" required placeholder="Judul Momen" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white" />
              <input type="text" required placeholder="URL Gambar / Foto" value={galleryForm.imgUrl} onChange={e => setGalleryForm({...galleryForm, imgUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white" />
              <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-xs">Posting ke Galeri</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
