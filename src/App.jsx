import React, { useState, useEffect, useRef } from 'react';
// ... (import tetap sama seperti sebelumnya)

// ... (tambahkan fungsi helper untuk pengecekan user)
const checkUserSession = () => {
  const savedUser = localStorage.getItem('jst_current_user');
  return savedUser ? JSON.parse(savedUser) : null;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Perbaikan: Gunakan useEffect untuk memuat sesi user saat pertama kali aplikasi dibuka
  useEffect(() => {
    const session = checkUserSession();
    if (session) {
      setCurrentUser(session);
    }
    
    // ... (sisa code useEffect lainnya)
  }, []);

  // Perbaikan: Fungsi akses menu
  const canAccess = (menuName) => {
    // Jika menu adalah Home atau Daftar Member, semua orang bisa akses
    if (menuName === 'home' || menuName === 'members') return true;
    
    // Untuk menu lain, pastikan user sudah terdaftar
    if (!currentUser) {
      setIsRegisterOpen(true);
      return false;
    }
    return true;
  };

  // Contoh implementasi pada tombol sidebar:
  /*
    <button onClick={() => { 
      if (canAccess('webvoice')) setActiveTab('webvoice'); 
      setIsSidebarOpen(false); 
    }} ... >
  */

  // ... (sisa kode lengkap Anda)
