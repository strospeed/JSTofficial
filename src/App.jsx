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
  Volume2
} from 'lucide-react';

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
  const [voiceSeconds, setVoiceSeconds] = useState(0);

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

  useEffect(() => {
    fetchDiscordData();
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

  useEffect(() => {
    let timer;
    if (activeVoiceSession) {
      timer = setInterval(() => {
        setVoiceSeconds(prev => prev + 1);
        if (currentUser && voiceSeconds > 0 && voiceSeconds % 10 === 0) {
          setMembers(prev => prev.map(m => {
            if (m.id === currentUser.id) {
              const updatedXp = m.xp + 5;
              const updatedVoiceMinutes = m.voiceMinutes + 1;
              const updatedLevel = Math.floor(updatedXp / 100) + 1;
              const updatedUser = { ...m, xp: updatedXp, level: updatedLevel, voiceMinutes: updatedVoiceMinutes };
              setCurrentUser(updatedUser);
              return updatedUser;
            }
            return m;
          }));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeVoiceSession, voiceSeconds, currentUser]);

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setRegAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = (e) => {
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
      eventsJoined: 0,
      badge: '🔥 Active Member',
      role: 'Member JST',
      joinDate: 'Agustus 2026'
    };

    setMembers(prev => [newMember, ...prev]);
    setCurrentUser(newMember);
    setIsRegisterOpen(false);
    setRegForm({ username: '', fullName: '', city: 'Jogja', discordTag: '', favoriteGame: 'Roblox' });
    setRegAvatarPreview(null);
  };

  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    const defaultBanners = {
      Roblox: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80',
      Valorant: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      'Mobile Legends': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
      Film: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
    };

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
      banner: eventForm.bannerUrl || defaultBanners[eventForm.gameType] || defaultBanners.Roblox
    };

    setEvents(prev => [newEvent, ...prev]);
    setIsCreateEventOpen(false);
    setEventForm({
      title: '', category: 'Gaming', gameType: 'Roblox', date: '', time: '', prize: '', maxSlots: 10, description: '', bannerUrl: ''
    });
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

  const handleGallerySubmit = (e) => {
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

    setGalleryItems(prev => [newItem, ...prev]);
    setIsUploadGalleryOpen(false);
    setGalleryForm({ title: '', tag: 'Gaming', imgUrl: '' });
    setGalleryPreview(null);
  };

  const toggleJoinEvent = (eventId) => {
    if (!currentUser) {
      setIsRegisterOpen(true);
      return;
    }

    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const isAlreadyJoined = ev.participants.includes(currentUser.id);
        const updatedParticipants = isAlreadyJoined
          ? ev.participants.filter(id => id !== currentUser.id)
          : [...ev.participants, currentUser.id];
        return { ...ev, participants: updatedParticipants };
      }
      return ev;
    }));
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
      
      {/* Background Animated Aurora Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px]" />
      </div>

      {}
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

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a href="#hero" className="hover:text-indigo-400 transition">Beranda</a>
            <a href="#about" className="hover:text-indigo-400 transition">Tentang JST</a>
            <a href="#events" className="hover:text-indigo-400 transition">Event</a>
            <a href="#voice" className="hover:text-indigo-400 transition">Discord Voice</a>
            <a href="#games" className="hover:text-indigo-400 transition">Game Hub</a>
            <a href="#leaderboard" className="hover:text-indigo-400 transition">Peringkat</a>
            <a href="#gallery" className="hover:text-indigo-400 transition">Galeri</a>
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
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition duration-300 flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Daftar Member</span>
              </button>
            )}

            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#5865F2]/25 transition"
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
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-slate-200">Tentang JST</a>
            <a href="#events" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-slate-200">Event Komunitas</a>
            <a href="#voice" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-slate-200">Discord Voice Active</a>
            <a href="#games" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-slate-200">Game Hub</a>
            <a href="#leaderboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-slate-200">Peringkat Keaktifan</a>
            <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-900 text-sm font-semibold text-slate-200">Galeri</a>
          </div>
        )}
      </nav>

      {}
      <section id="hero" className="relative pt-12 sm:pt-20 pb-16 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>Komunitas Gaming & Nongkrong Indonesia</span>
        </div>

        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-5xl mx-auto mb-6">
          Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300">JST</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-xl max-w-3xl mx-auto mb-8 sm:mb-10 font-normal leading-relaxed">
          <strong className="text-slate-200 font-semibold">Jawa Semua Teman</strong> — Tempat berkumpulnya para gamer, kawan cangkrukan online, nobar film, dan komunitas paling hangat tanpa sekat.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#5865F2]/30 flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5"
          >
            <Radio className="w-5 h-5" />
            <span>Gabung Server Discord</span>
          </a>

          {!currentUser ? (
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition"
            >
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <span>Daftar Member JST</span>
            </button>
          ) : (
            <a
              href="#events"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition"
            >
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>Lihat Event Komunitas</span>
            </a>
          )}
        </div>

        {/* Discord Counter Banner */}
        <div className="mt-12 max-w-2xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 sm:p-5 backdrop-blur-md flex flex-wrap items-center justify-around gap-4 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">{discordApiData.onlineCount}</div>
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1 justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Member Online
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800 hidden sm:block" />
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400">{discordApiData.totalCount}</div>
            <div className="text-xs font-semibold text-slate-400">Total Komunitas</div>
          </div>
          <div className="h-8 w-px bg-slate-800 hidden sm:block" />
          <div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">{members.length}</div>
            <div className="text-xs font-semibold text-slate-400">Member Terdaftar Web</div>
          </div>
        </div>
      </section>

      {}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
            Aktivitas Seru Serba Ada di <span className="text-indigo-400">JST</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-base leading-relaxed">
            Tak hanya sekadar gaming, JST adalah rumah hangat tempat mencari teman sefrekuensi, berbincang santai, hingga mengadakan berbagai kegiatan seru.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mabar Multi-Game</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Sering mabar Roblox, Valorant, Mobile Legends, PUBG, Minecraft, hingga GTA V Roleplay setiap sore & malam.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Nobar Cinema & Film</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Jadwal nonton bareng film aksi, serial terbaru, dan sinema favorit di Discord Voice Stage setiap minggunya.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Cangkrukan & Chill Voice</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Ngobrol santai seputar hobi, obrolan keseharian, karaoke online, hingga sharing session bareng teman-teman.
            </p>
          </div>
        </div>
      </section>

      {}
      <section id="events" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold mb-2">
              <Calendar className="w-3.5 h-3.5" /> Agenda Komunitas
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Event & Turnamen Buatan Member</h2>
            <p className="text-slate-400 text-xs sm:text-base mt-1">
              Event dan turnamen yang dibuat langsung oleh sesama anggota JST. Siapa saja boleh bikin event!
            </p>
          </div>

          <button
            onClick={() => {
              if (!currentUser) setIsRegisterOpen(true);
              else setIsCreateEventOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/25 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Event Baru</span>
          </button>
        </div>

        {events.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white text-lg mb-1">Belum Ada Event Aktif</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-md mx-auto">
              Saat ini belum ada jadwal event atau turnamen yang dibuat. Jadilah member pertama yang membuat event komunitas!
            </p>
            <button
              onClick={() => {
                if (!currentUser) setIsRegisterOpen(true);
                else setIsCreateEventOpen(true);
              }}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm"
            >
              + Buat Event Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => {
              const isJoined = currentUser && ev.participants.includes(currentUser.id);
              return (
                <div key={ev.id} className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col hover:border-purple-500/40 transition">
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
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          <span>Hadiah: {ev.prize}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-purple-400" />
                          <span>Peserta: {ev.participants.length} / {ev.maxSlots} Slots</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleJoinEvent(ev.id)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                        isJoined
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
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

      {}
      <section id="voice" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Realtime Voice Sync
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Live Voice Channel Discord</h2>
              <p className="text-slate-400 text-xs sm:text-base mt-1">
                Channel voice terhubung langsung dengan server Discord resmi JST (`https://discord.gg/4GzW6KTAyZ`).
              </p>
            </div>

            <button
              onClick={fetchDiscordData}
              disabled={isSyncingDiscord}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 self-start lg:self-auto"
            >
              <Zap className={`w-4 h-4 text-amber-400 ${isSyncingDiscord ? 'animate-spin' : ''}`} />
              <span>{isSyncingDiscord ? 'Syncing...' : 'Sync Data Realtime'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {discordApiData.voiceRooms.map((room) => {
              const isCurrentSession = activeVoiceSession === room.id;
              return (
                <div key={room.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200 truncate">{room.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        {room.count} Member
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-4">Channel Aktif Discord JST</p>
                  </div>

                  <div className="space-y-2">
                    <a
                      href={DISCORD_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Masuk Voice</span>
                    </a>

                    <button
                      onClick={() => {
                        if (!currentUser) {
                          setIsRegisterOpen(true);
                          return;
                        }
                        if (isCurrentSession) {
                          setActiveVoiceSession(null);
                        } else {
                          setActiveVoiceSession(room.id);
                          setVoiceSeconds(0);
                        }
                      }}
                      className={`w-full py-1.5 rounded-xl text-[11px] font-bold border transition ${
                        isCurrentSession
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isCurrentSession ? `⏳ Tracking (${voiceSeconds}s) +5XP` : 'Simulasi Timer Voice (+XP)'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-400 shrink-0" />
              <p className="text-xs text-slate-300">
                Fitur ini mendeteksi aktivitas voice channel secara langsung. Makin sering join voice di Discord, makin tinggi XP membermu di website!
              </p>
            </div>
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-extrabold text-white shrink-0"
            >
              Buka Discord App
            </a>
          </div>
        </div>
      </section>

      {}
      <section id="games" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-2">
            <Gamepad2 className="w-3.5 h-3.5" /> Game Hub JST
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">Game Favorit Anggota Komunitas</h2>
          <p className="text-slate-400 text-xs sm:text-base">
            Pilih game favoritmu dan cari teman squad mabar setiap harinya.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GAMES_LIST.map((game) => (
            <div key={game.id} className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition duration-300">
              <div className="h-40 relative overflow-hidden">
                <img src={game.banner} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-3 left-3 text-2xl">{game.icon}</span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-extrabold text-cyan-300 border border-slate-700">
                  ★ {game.rating}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-extrabold text-white text-base mb-1">{game.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{game.category}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold text-indigo-400">{game.activeCount}</span>
                  <a
                    href={DISCORD_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-bold text-xs transition"
                  >
                    Join Squad
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {}
      <section id="leaderboard" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" /> Peringkat Anggota
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">Peringkat Keaktifan Member JST</h2>
          <p className="text-slate-400 text-xs sm:text-base">
            Daftar member terdaftar berdasarkan keaktifan mabar, durasi voice Discord, dan partisipasi event.
          </p>
        </div>

        {members.length === 0 ? (
          <div className="py-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-6">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white text-base mb-1">Papan Peringkat Masih Kosong</h3>
            <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
              Belum ada member yang mendaftar. Jadilah member pertama untuk menduduki peringkat #1!
            </p>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
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
                    <th className="p-4">Durasi Voice</th>
                    <th className="p-4 pr-6">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-semibold">
                  {sortedMembers.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition">
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
                      <td className="p-4 text-slate-300">{m.voiceMinutes} Menit</td>
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

      {}
      <section id="gallery" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold mb-2">
              <ImageIcon className="w-3.5 h-3.5" /> Galeri Komunitas
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Dokumentasi Mabar & Gathering</h2>
            <p className="text-slate-400 text-xs sm:text-base mt-1">
              Foto dan momen seru yang diunggah langsung oleh para member terdaftar JST.
            </p>
          </div>

          <button
            onClick={() => {
              if (!currentUser) setIsRegisterOpen(true);
              else setIsUploadGalleryOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 shrink-0 self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>+ Unggah Foto Momen</span>
          </button>
        </div>

        {galleryItems.length === 0 ? (
          <div className="py-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-6">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white text-base mb-1">Belum Ada Foto Galeri</h3>
            <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
              Galeri mabar dan gathering masih kosong. Jadilah member pertama yang mengunggah foto momen komunitas!
            </p>
            <button
              onClick={() => {
                if (!currentUser) setIsRegisterOpen(true);
                else setIsUploadGalleryOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              + Unggah Foto Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden h-56 bg-slate-900 border border-slate-800">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-90 p-4 flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">{item.tag}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Oleh: {item.uploader}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {}
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

      {}
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

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Discord Tag (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: surya#1234"
                  value={regForm.discordTag}
                  onChange={(e) => setRegForm({ ...regForm, discordTag: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 mt-2"
              >
                Selesaikan Pendaftaran
              </button>
            </form>
          </div>
        </div>
      )}

      {}
      {isCreateEventOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsCreateEventOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-1">Buat Event / Turnamen</h3>
            <p className="text-xs text-slate-400 mb-5">Inisiasi agenda mabar atau turnamen seru untuk sesama anggota JST.</p>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Judul Event *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Turnamen Roblox Survival JST"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Kategori</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Gaming">Gaming / Mabar</option>
                    <option value="Tournament">Turnamen</option>
                    <option value="Nobar">Nobar Cinema</option>
                    <option value="Gathering">Gathering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Game / Acara</label>
                  <select
                    value={eventForm.gameType}
                    onChange={(e) => setEventForm({ ...eventForm, gameType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Roblox">Roblox</option>
                    <option value="Valorant">Valorant</option>
                    <option value="Mobile Legends">Mobile Legends</option>
                    <option value="Film">Nobar Film</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tanggal</label>
                  <input
                    type="text"
                    placeholder="Sabtu, 15 Ags 2026"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Jam</label>
                  <input
                    type="text"
                    placeholder="19:30 WIB"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Hadiah / Prize (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Discord Nitro / Role Khusus"
                  value={eventForm.prize}
                  onChange={(e) => setEventForm({ ...eventForm, prize: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 mt-2"
              >
                Publikasikan Event Komunitas
              </button>
            </form>
          </div>
        </div>
      )}

      {}
      {isUploadGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsUploadGalleryOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-1">Unggah Foto Galeri</h3>
            <p className="text-xs text-slate-400 mb-5">Bagikan foto mabar atau momen gathering bareng komunitas JST.</p>

            <form onSubmit={handleGallerySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Pilih Gambar</label>
                <div className="space-y-2">
                  <div className="w-full h-36 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden relative">
                    {galleryPreview ? (
                      <img src={galleryPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                    )}
                  </div>
                  <label className="cursor-pointer w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>Pilih Foto dari Galeri HP/PC</span>
                    <input type="file" accept="image/*" onChange={handleGalleryImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Judul Momen</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mabar Roblox Survival Squad JST"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!galleryPreview}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 mt-2"
              >
                Publikasikan ke Galeri
              </button>
            </form>
          </div>
        </div>
      )}

      {}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-xs">
              JST
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">JST — Jawa Semua Teman</p>
              <p className="text-[10px] text-slate-400">Komunitas Gaming, Nobar, & Nongkrong Indonesia</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Discord</a>
            <a href="#about" className="hover:text-white transition">Tentang</a>
            <a href="#events" className="hover:text-white transition">Event</a>
            <a href="#games" className="hover:text-white transition">Game Hub</a>
          </div>

          <p className="text-[10px] text-slate-400">
            © 2026 JST Community Platform. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
