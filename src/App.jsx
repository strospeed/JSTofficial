import React, { useState, useEffect, useRef } from 'react';
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
  VolumeX,
  Mic,
  MicOff,
  MessageSquare,
  Send,
  Home,
  Flame,
  Gamepad,
  ExternalLink,
  Settings
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

const LOGO_URL = "https://cdn.phototourl.com/free/2026-08-08-cc31cf77-f33d-4f92-acfd-9931efb5991a.png";
const BG_URL = "https://cdn.phototourl.com/free/2026-08-08-1526704e-be05-41e9-800a-fe7acac48963.png";

const DISCORD_INVITE_URL = `https://discord.gg/4GzW6KTAyZ`;

const INDONESIA_CITIES = [
  'Blitar', 'Kediri', 'Malang', 'Surabaya', 'Jogja', 'Solo', 'Semarang', 
  'Jakarta', 'Bandung', 'Medan', 'Makassar', 'Bali', 'Banten', 'Bogor', 
  'Depok', 'Tangerang', 'Bekasi', 'Sidoarjo', 'Jember', 'Banyuwangi', 
  'Madiun', 'Probolinggo', 'Pasuruan', 'Cirebon', 'Purwokerto', 'Magelang', 
  'Salatiga', 'Pontianak', 'Banjarmasin', 'Samarinda', 'Balikpapan', 
  'Manado', 'Palembang', 'Lampung', 'Padang', 'Pekanbaru', 'Lainnya'
];

// Koleksi Game Online Super Banyak (Langsung Main)
const ARCADE_GAMES = [
  { id: 'krunker', name: 'Krunker.io', category: 'Action / FPS', url: 'https://krunker.io/', banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80' },
  { id: 'shellshock', name: 'Shell Shockers', category: 'Action / Multiplayer', url: 'https://shellshock.io/', banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80' },
  { id: 'paperio', name: 'Paper.io 2', category: 'Strategy / IO', url: 'https://paper.io/', banner: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80' },
  { id: 'smashkarts', name: 'Smash Karts', category: 'Racing / Multiplayer', url: 'https://smashkarts.io/', banner: 'https://images.unsplash.com/photo-1511871893393-82e4c166a988?auto=format&fit=crop&w=600&q=80' },
  { id: 'chess', name: 'Chess Online', category: 'Board / Strategy', url: 'https://www.chess.com/play/computer', banner: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80' },
  { id: 'slope', name: 'Slope Game', category: 'Arcade / Skill', url: 'https://www.crazygames.com/game/slope', banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80' },
  { id: 'moto', name: 'Moto X3M', category: 'Racing / Sports', url: 'https://www.crazygames.com/game/moto-x3m', banner: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80' },
  { id: 'voxiom', name: 'Voxiom.io', category: 'Action / Survival', url: 'https://voxiom.io/', banner: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80' },
  { id: 'holeio', name: 'Hole.io', category: 'Arcade / IO', url: 'https://hole-io.com/', banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80' },
  { id: 'stabfish', name: 'Stabfish.io', category: 'Action / Survival', url: 'https://stabfish.io/', banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80' },
  { id: 'buildroyale', name: 'Build Royale', category: 'Battle Royale', url: 'https://buildroyale.io/', banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80' },
  { id: 'zombs', name: 'Zombs Royale', category: 'Battle Royale', url: 'https://zombsroyale.io/', banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' },
  { id: 'wormate', name: 'Wormate.io', category: 'Arcade / IO', url: 'https://wormate.io/', banner: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80' },
  { id: 'slither', name: 'Slither.io', category: 'Arcade / IO', url: 'https://slither.io/', banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80' },
  { id: 'agar', name: 'Agar.io', category: 'Strategy / IO', url: 'https://agar.io/', banner: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80' },
  { id: 'tanki', name: 'Tanki Online', category: 'Action / Tank', url: 'https://tankionline.com/en/', banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80' },
  { id: 'bloxd', name: 'Bloxd.io', category: 'Sandbox / Craft', url: 'https://bloxd.io/', banner: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80' },
  { id: 'diep', name: 'Diep.io', category: 'Action / IO', url: 'https://diep.io/', banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80' },
  { id: 'narrow', name: 'Narrow One', category: 'Action / Archery', url: 'https://www.crazygames.com/game/narrow-one', banner: 'https://images.unsplash.com/photo-1511871893393-82e4c166a988?auto=format&fit=crop&w=600&q=80' },
  { id: 'bullet', name: 'Bullet Force', category: 'FPS / Multiplayer', url: 'https://www.crazygames.com/game/bullet-force', banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' }
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

  const [selectedGameUrl, setSelectedGameUrl] = useState(null);

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isUploadGalleryOpen, setIsUploadGalleryOpen] = useState(false);

  // Form & Profile States
  const [regForm, setRegForm] = useState({ username: '', city: 'Blitar', favoriteGame: 'Roblox', discordTag: '' });
  const [regAvatarPreview, setRegAvatarPreview] = useState(null);
  const [editProfileForm, setEditProfileForm] = useState({ username: '', city: '', favoriteGame: '', avatar: '' });
  
  // Web Voice Chat States (Realtime Firebase Sync)
  const [isInVoice, setIsInVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [voiceUsers, setVoiceUsers] = useState([]);

  useEffect(() => {
    // Set Favicon Logo di Tab Browser
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = LOGO_URL;
    document.getElementsByTagName('head')[0].appendChild(link);
    document.title = "JST Official - Jawa Semua Teman";

    signInAnonymously(auth).then(() => {
      const savedUserJson = localStorage.getItem('jst_current_user');
      if (savedUserJson) {
        try {
          setCurrentUser(JSON.parse(savedUserJson));
        } catch (e) {
          console.log(e);
        }
      }
    }).catch((err) => console.error("Auth error:", err));

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

    const unsubVoice = onSnapshot(collection(db, "voice_room"), (snapshot) => {
      setVoiceUsers(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    return () => {
      unsubMembers();
      unsubEvents();
      unsubGallery();
      unsubChat();
      unsubVoice();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setRegAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditProfileForm({ ...editProfileForm, avatar: reader.result });
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
      const docRef = await addDoc(collection(db, "members"), newMember);
      const userWithId = { docId: docRef.id, ...newMember };
      setCurrentUser(userWithId);
      localStorage.setItem('jst_current_user', JSON.stringify(userWithId));
      setIsRegisterOpen(false);
      setRegForm({ username: '', city: 'Blitar', favoriteGame: 'Roblox', discordTag: '' });
      setRegAvatarPreview(null);
    } catch (err) {
      console.error("Gagal mendaftar:", err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const userRef = doc(db, "members", currentUser.docId);
      const updatedData = {
        username: editProfileForm.username || currentUser.username,
        city: editProfileForm.city || currentUser.city,
        favoriteGame: editProfileForm.favoriteGame || currentUser.favoriteGame,
        avatar: editProfileForm.avatar || currentUser.avatar
      };

      await updateDoc(userRef, updatedData);
      const newUserObj = { ...currentUser, ...updatedData };
      setCurrentUser(newUserObj);
      localStorage.setItem('jst_current_user', JSON.stringify(newUserObj));
      setIsProfileOpen(false);
    } catch (err) {
      console.error("Gagal update profil:", err);
    }
  };

  const openProfileModal = () => {
    if (!currentUser) {
      setIsRegisterOpen(true);
    } else {
      setEditProfileForm({
        username: currentUser.username,
        city: currentUser.city,
        favoriteGame: currentUser.favoriteGame,
        avatar: currentUser.avatar
      });
      setIsProfileOpen(true);
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
  };

  const toggleVoiceRoom = async () => {
    if (!currentUser) {
      setIsRegisterOpen(true);
      return;
    }

    if (!isInVoice) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        setLocalStream(stream);
        setIsInVoice(true);
        setIsMuted(false);

        await addDoc(collection(db, "voice_room"), {
          userId: currentUser.id || currentUser.docId,
          username: currentUser.username,
          avatar: currentUser.avatar,
          city: currentUser.city,
          isMuted: false,
          joinedAt: Date.now()
        });
      } catch (err) {
        alert("Gagal mengakses Mikrofon. Pastikan Anda mengizinkan akses mic pada browser.");
      }
    } else {
      leaveVoiceRoom();
    }
  };

  const leaveVoiceRoom = async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setIsInVoice(false);

    const myVoiceData = voiceUsers.find(v => v.username === currentUser?.username);
    if (myVoiceData) {
      try {
        await updateDoc(doc(db, "voice_room", myVoiceData.docId), { left: true });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const sortedMembers = [...members].sort((a, b) => b.xp - a.xp);

  return (
    <div className="min-h-screen text-slate-100 font-sans flex relative overflow-x-hidden bg-slate-950">
      
      {/* Background Gambar Website dengan Efek Balance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.35] blur-[2px] scale-105"
          style={{ backgroundImage: `url(${BG_URL})` }}
        />
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px]" />
      </div>

      {/* ================= SIDEBAR NAVIGATION ================= */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-300 flex flex-col justify-between shadow-2xl`}>
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Logo JST" className="w-10 h-10 object-contain drop-shadow-md" />
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
            <button onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}>
              <Home className="w-4 h-4" /><span>Beranda Utama</span>
            </button>
            <button onClick={() => { setActiveTab('chat'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}>
              <MessageSquare className="w-4 h-4" /><span>💬 Live Chat Global</span>
            </button>
            <button onClick={() => { setActiveTab('webvoice'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'webvoice' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}>
              <Volume2 className="w-4 h-4 text-emerald-400" /><span>🎙️ JST Web Voice Room</span>
            </button>
            <button onClick={() => { setActiveTab('gamelounge'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'gamelounge' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}>
              <Gamepad className="w-4 h-4" /><span>🕹️ JST Game Lounge</span>
            </button>
            <button onClick={() => { setActiveTab('members'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'members' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}>
              <Users className="w-4 h-4" /><span>👥 Daftar Member Lengkap</span>
            </button>
            <button onClick={() => { setActiveTab('events'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'events' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}>
              <Calendar className="w-4 h-4" /><span>📅 Event & Turnamen</span>
            </button>
            <button onClick={() => { setActiveTab('gallery'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'gallery' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}>
              <ImageIcon className="w-4 h-4" /><span>🖼️ Galeri Momen</span>
            </button>
            <button onClick={() => { setActiveTab('leaderboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${activeTab === 'leaderboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}>
              <Trophy className="w-4 h-4" /><span>🏆 Peringkat Keaktifan</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          {currentUser ? (
            <div onClick={openProfileModal} className="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 flex items-center justify-between shadow-inner cursor-pointer hover:border-indigo-500 transition">
              <div className="flex items-center gap-3 overflow-hidden">
                <img src={currentUser.avatar} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-indigo-500/40 shrink-0" />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{currentUser.username}</div>
                  <div className="text-[10px] text-indigo-400 font-medium">{currentUser.city} • Lv.{currentUser.level}</div>
                </div>
              </div>
              <Settings className="w-4 h-4 text-slate-400 hover:text-white shrink-0" />
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
        
        <header className="sticky top-0 z-30 bg-slate-950/75 backdrop-blur-xl border-b border-slate-800/80 h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>{members.length} Member Terdaftar</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <button onClick={openProfileModal} className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 transition">
                <Settings className="w-3.5 h-3.5 text-indigo-400" /> Ganti Profil / Foto
              </button>
            ) : (
              <button onClick={() => setIsRegisterOpen(true)} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition">
                <UserCheck className="w-4 h-4" /><span>Daftar Member</span>
              </button>
            )}
            <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition">
              <Radio className="w-4 h-4" /><span>Discord Komunitas</span>
            </a>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-12">
              <div className="text-center py-12 sm:py-20 bg-slate-900/75 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
                <img src={LOGO_URL} alt="Hero Logo JST" className="w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-6 object-contain drop-shadow-2xl animate-bounce" />
                <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-md">
                  Komunitas <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">JST Official</span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto mb-8 font-medium">
                  Jawa Semua Teman — Ngobrol langsung lewat Web Voice Room, mainkan puluhan game online seru sepuasnya, dan atur profil kerenmu dengan foto pilihanmu sendiri.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button onClick={() => setActiveTab('webvoice')} className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition flex items-center gap-2">
                    <Volume2 className="w-4 h-4" /> Masuk Web Voice Room
                  </button>
                  <button onClick={() => setActiveTab('gamelounge')} className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition">
                    🕹️ Main Game Online Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: WEB VOICE ROOM */}
          {activeTab === 'webvoice' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
                  <Volume2 className={`w-10 h-10 ${isInVoice ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">🎙️ JST Web Voice Room</h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                    {isInVoice ? 'Anda terhubung ke ruang suara web. Silakan mulai berbicara dengan member lain.' : 'Klik tombol di bawah untuk bergabung ke ruang suara interaktif langsung di browser.'}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  {!isInVoice ? (
                    <button onClick={toggleVoiceRoom} className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-3 transition">
                      <Mic className="w-5 h-5" /> Masuk Voice Room
                    </button>
                  ) : (
                    <>
                      <button onClick={toggleMute} className={`px-6 py-3.5 rounded-2xl font-extrabold text-xs shadow-lg flex items-center gap-2 transition ${isMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        {isMuted ? 'Unmute Mic' : 'Mute Mic'}
                      </button>
                      <button onClick={toggleVoiceRoom} className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transition">
                        <VolumeX className="w-4 h-4" /> Keluar Room
                      </button>
                    </>
                  )}
                </div>

                {/* DAFTAR MEMBER DI DALAM VOICE ROOM */}
                <div className="mt-8 pt-6 border-t border-slate-800 text-left">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" /> Member yang sedang di Voice Room ({voiceUsers.length})
                  </h3>
                  {voiceUsers.length === 0 ? (
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                      Belum ada member di dalam room. Jadilah yang pertama masuk!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {voiceUsers.map((vUser) => (
                        <div key={vUser.docId} className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={vUser.avatar} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40" />
                            <div>
                              <div className="text-xs font-bold text-white">{vUser.username}</div>
                              <div className="text-[10px] text-emerald-400 font-medium">📍 {vUser.city} • Berbicara</div>
                            </div>
                          </div>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: GAME LOUNGE (KOLEKSI SANGAT BANYAK) */}
          {activeTab === 'gamelounge' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-white mb-2">🕹️ JST Game Lounge (Game Online Web)</h2>
                <p className="text-xs text-slate-300">Pilih game favoritmu dan mainkan langsung di web tanpa perlu instalasi!</p>
              </div>

              {selectedGameUrl ? (
                <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/50 rounded-3xl p-4 shadow-2xl">
                  <div className="flex justify-between mb-3 px-2">
                    <span className="text-xs font-bold text-indigo-300">Sedang Memainkan Game Online</span>
                    <button onClick={() => setSelectedGameUrl(null)} className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-bold text-white hover:bg-slate-700">Tutup Game</button>
                  </div>
                  <div className="w-full h-[650px] rounded-2xl overflow-hidden bg-black">
                    <iframe src={selectedGameUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen></iframe>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ARCADE_GAMES.map((game) => (
                    <div key={game.id} className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden group hover:border-indigo-500 transition flex flex-col justify-between shadow-xl">
                      <div>
                        <div className="h-40 relative overflow-hidden">
                          <img src={game.banner} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-extrabold text-indigo-300 border border-slate-700">
                            {game.category}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-white text-base mb-1">{game.name}</h3>
                          <p className="text-xs text-slate-300">Main multiplayer langsung di web.</p>
                        </div>
                      </div>
                      <div className="p-5 pt-0">
                        <button onClick={() => setSelectedGameUrl(game.url)} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition">
                          <ExternalLink className="w-4 h-4" /> Mainkan Game
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">👥 Direktori Member JST</h2>
                  <p className="text-xs text-slate-300">Daftar lengkap anggota komunitas dari berbagai daerah.</p>
                </div>
                <button onClick={() => setIsRegisterOpen(true)} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition">
                  + Daftar Profil Baru
                </button>
              </div>

              {members.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-xl">
                  <p className="text-xs text-slate-300 mb-3">Belum ada member terdaftar di database web.</p>
                  <button onClick={() => setIsRegisterOpen(true)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">Daftar Jadi Yang Pertama</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {members.map((m) => (
                    <div key={m.docId || m.id} className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 flex items-center gap-4 hover:border-indigo-500/40 transition shadow-xl">
                      <img src={m.avatar} alt={m.username} className="w-16 h-16 rounded-2xl object-cover border border-indigo-500/40 shrink-0" />
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-white text-sm truncate">{m.username}</h3>
                        <p className="text-xs text-indigo-400 font-medium">📍 {m.city}</p>
                        <p className="text-[11px] text-slate-300 mt-1">🎮 Game: {m.favoriteGame}</p>
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
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px]">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-5 shadow-md">
                <h3 className="font-black text-white text-base">JST Global Community Chat</h3>
                <p className="text-xs text-indigo-100">Kirim pesan realtime antar member</p>
              </div>
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/75">
                {messages.map((msg, index) => {
                  const isMe = currentUser && msg.username === currentUser.username;
                  return (
                    <div key={msg.docId || index} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <img src={msg.avatar || 'https://ui-avatars.com/api/?name=User'} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0" />
                      <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                        <div className="text-xs font-extrabold text-indigo-300 mb-1">{msg.username}</div>
                        <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium ${isMe ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'}`}>
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
                <button type="submit" disabled={!currentUser || !chatInput.trim()} className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/30 transition">
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
                <button onClick={() => { if (!currentUser) setIsRegisterOpen(true); else setIsCreateEventOpen(true); }} className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition">+ Buat Event</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((ev) => (
                  <div key={ev.docId || ev.id} className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl">
                    <h3 className="font-bold text-white text-base mb-2">{ev.title}</h3>
                    <p className="text-xs text-slate-300 mb-4">{ev.description}</p>
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
                <button onClick={() => { if (!currentUser) setIsRegisterOpen(true); else setIsUploadGalleryOpen(true); }} className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition">+ Upload Foto</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {galleryItems.map((item) => (
                  <div key={item.docId || item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-56 relative group shadow-xl">
                    <img src={item.imgUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
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
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 text-slate-400 text-xs font-bold border-b border-slate-800">
                      <th className="p-4 pl-6">Rank</th>
                      <th className="p-4">Member</th>
                      <th className="p-4">Asal Kota</th>
                      <th className="p-4">XP & Level</th>
                      <th className="p-4 pr-6">Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs font-semibold">
                    {sortedMembers.map((m, idx) => (
                      <tr key={m.docId || m.id} className="hover:bg-slate-800/40 transition">
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
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

      {/* ================= EDIT PROFILE / GANTI FOTO MODAL ================= */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black text-white mb-1">Pengaturan Profil & Foto</h3>
            <p className="text-xs text-slate-400 mb-5">Ganti foto profil web atau informasi akun Anda.</p>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Ganti Foto Profil Web</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                    <img src={editProfileForm.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                  </div>
                  <label className="cursor-pointer flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-indigo-400" /><span>Upload Foto Baru</span>
                    <input type="file" accept="image/*" onChange={handleEditAvatarUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Username / Gamertag</label>
                <input
                  type="text"
                  required
                  value={editProfileForm.username}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, username: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Asal Kota / Kabupaten</label>
                <select
                  value={editProfileForm.city}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, city: e.target.value })}
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
                  value={editProfileForm.favoriteGame}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, favoriteGame: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Roblox">Roblox</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Mobile Legends">Mobile Legends</option>
                  <option value="Minecraft">Minecraft</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-lg mt-2">
                Simpan Perubahan Profil
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {isCreateEventOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
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
