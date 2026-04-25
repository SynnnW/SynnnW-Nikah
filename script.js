(function() {
  'use strict';

  /* ---- DOM refs ---- */
  const coverWrapper = document.getElementById('cover-wrapper');
  const gate1        = document.getElementById('gate1');
  const gate2        = document.getElementById('gate2');
  const gate3        = document.getElementById('gate3');

  const nameInput      = document.getElementById('name-input');
  const btnSubmit      = document.getElementById('btn-submit');
  const guestDisplay   = document.getElementById('guest-name-display');
  const btnOpen        = document.getElementById('btn-open');
  const wishName       = document.getElementById('wish-name');
  const wishesList     = document.getElementById('wishes-list');
  const rsvpForm       = document.getElementById('rsvp-form');

  // DOM RSVP Stats
  const countHadir     = document.getElementById('count-hadir');
  const countTidak     = document.getElementById('count-tidak');

  // DOM Wedding Gift
  const btnToggleGift  = document.getElementById('btn-toggle-gift');
  const giftContainer  = document.getElementById('gift-container');

  const bgMusic        = document.getElementById('bg-music');
  const musicToggle    = document.getElementById('music-toggle');
  const themeToggle    = document.getElementById('theme-toggle');

  const emoteContainer = document.getElementById('emote-container');
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightbox-img');
  const lightboxClose  = document.getElementById('lightbox-close');

  /* ---- Telegram Config ---- */
  const BOT_TOKEN = '7230058914:AAH5Z_7fK17zR4I5b0N-rR9U-pW7gM_0_Gg';
  const CHAT_ID   = '7017267151';

  /* ---- State ---- */
  let guestName    = '';
  let musicPlaying = false;

  /* ==============================================================
     1. FLOATING EMOTES
     ============================================================== */
  const EMOTES = ['🤍', '✨', '🌸', '💍'];

  function spawnEmote() {
    if (gate3.classList.contains('active')) return;
    const el = document.createElement('span');
    el.className = 'emote';
    el.textContent = EMOTES[Math.floor(Math.random() * EMOTES.length)];
    el.style.left = (Math.random() * 80 + 10) + 'vw';
    el.style.fontSize = (Math.random() * 0.5 + 1.1) + 'rem';
    emoteContainer.appendChild(el);
    setTimeout(() => el.remove(), 11500);
  }

  spawnEmote();
  setInterval(spawnEmote, Math.random() * 4000 + 5000);

  /* ==============================================================
     2. GATE 1 → GATE 2 (Nama → Amplop)
     ============================================================== */
  function goToGate2() {
    const val = nameInput.value.trim();
    if (!val) {
      nameInput.style.animation = 'none';
      nameInput.offsetHeight; /* reflow */
      nameInput.style.animation = 'shake 0.4s ease';
      return;
    }

    guestName = val;
    guestDisplay.textContent = val;
    wishName.value = val;
    
    // Update nama di bagian Hero Section
    const guestNameHero = document.getElementById('guest-name-hero');
    if (guestNameHero) guestNameHero.textContent = val;

    gate1.classList.remove('active');
    gate1.classList.add('hidden');

    gate2.classList.remove('hidden');
    setTimeout(() => gate2.classList.add('active'), 20);
  }

  btnSubmit.addEventListener('click', goToGate2);
  nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); goToGate2(); }
  });

  /* Touch ripple on input */
  nameInput.addEventListener('focus', () => {
    nameInput.closest('.input-row').style.transform = 'scale(1.02)';
  });
  nameInput.addEventListener('blur', () => {
    nameInput.closest('.input-row').style.transform = 'scale(1)';
  });

  /* ==============================================================
     3. GATE 2 → GATE 3 (Amplop → Isi Undangan)
     ============================================================== */
  btnOpen.addEventListener('click', function () {
    coverWrapper.classList.add('exit');

    setTimeout(function () {
      gate3.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' });
      initScrollObserver();
      initCountdown();
      tryPlayMusic();
    }, 800);
  });

  /* ==============================================================
     4. TELEGRAM NOTIFICATION (KHUSUS RSVP & WISHES)
     ============================================================== */
  function sendTelegramRSVP(nama, attend, message) {
    const icon = attend === 'Hadir' ? '✅' : '❌';
    const msg = `💌 *RSVP Baru: Adib & Nabila*\n\n👤 *Nama:* ${nama}\n${icon} *Kehadiran:* ${attend}\n💬 *Pesan:*\n_${message}_`;
    
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'Markdown' })
    }).catch(() => {
      console.log('Gagal mengirim ke Telegram');
    });
  }

  /* ==============================================================
     5. MUSIK
     ============================================================== */
  function tryPlayMusic() {
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicToggle.textContent = '🎵';
    }).catch(() => {
      musicPlaying = false;
      musicToggle.textContent = '🔇';
    });
  }

  musicToggle.addEventListener('click', function () {
    if (musicPlaying) {
      bgMusic.pause();
      musicToggle.textContent = '🔇';
    } else {
      bgMusic.play();
      musicToggle.textContent = '🎵';
    }
    musicPlaying = !musicPlaying;
  });

  /* ==============================================================
     6. DARK / LIGHT MODE
     ============================================================== */
  themeToggle.addEventListener('click', function () {
    const html = document.documentElement;
    if (html.getAttribute('data-theme') === 'light') {
      html.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
    } else {
      html.setAttribute('data-theme', 'light');
      themeToggle.textContent = '🌙';
    }
  });

  /* ==============================================================
     7. COUNTDOWN (Target: 31 Mei 2026 - Akad Nikah)
     ============================================================== */
  function initCountdown() {
    const target = new Date('2026-05-31T08:00:00+07:00').getTime();

    function tick() {
      const now  = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        document.getElementById('cd-hari').textContent   = '0';
        document.getElementById('cd-jam').textContent    = '0';
        document.getElementById('cd-menit').textContent  = '0';
        document.getElementById('cd-detik').textContent  = '0';
        return;
      }

      const days    = Math.floor(diff / 86400000);
      const hours   = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000)  / 60000);
      const seconds = Math.floor((diff % 60000)    / 1000);

      document.getElementById('cd-hari').textContent   = String(days).padStart(2,'0');
      document.getElementById('cd-jam').textContent    = String(hours).padStart(2,'0');
      document.getElementById('cd-menit').textContent  = String(minutes).padStart(2,'0');
      document.getElementById('cd-detik').textContent  = String(seconds).padStart(2,'0');
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ==============================================================
     8. SCROLL REVEAL ANIMATION
     ============================================================== */
  function initScrollObserver() {
    const els = gate3.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
  }

  /* ==============================================================
     9. GALLERY LIGHTBOX
     ============================================================== */
  document.querySelectorAll('.gal-img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
    });
  });

  lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });

  /* ==============================================================
     10. WEDDING GIFT (BUKA REKENING & COPY CLIPBOARD)
     ============================================================== */
  if(btnToggleGift && giftContainer) {
    btnToggleGift.addEventListener('click', () => {
      if (giftContainer.classList.contains('hidden')) {
        giftContainer.classList.remove('hidden');
        btnToggleGift.textContent = 'Tutup Rekening 🎁';
        // Animasi slide down / fade in dibantu CSS
        giftContainer.style.animation = 'fadeIn 0.5s ease forwards';
      } else {
        giftContainer.classList.add('hidden');
        btnToggleGift.textContent = 'Buka Rekening 🎁';
      }
    });
  }

  // Fungsi Copy ke Clipboard (Dibuat global agar bisa dipanggil dari HTML onclick)
  window.copyRekening = function(elementId) {
    const textToCopy = document.getElementById(elementId).innerText;
    
    // Fallback menggunakan execCommand untuk kompabilitas Canvas
    const tempInput = document.createElement('input');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    showToast('Nomor Rekening Berhasil Disalin!');
  };

  // Custom Notifikasi / Toast (Pengganti Alert)
  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '80px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '50px';
    toast.style.zIndex = '10000';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '500';
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  /* ==============================================================
     11. RSVP / BUKU TAMU & STATISTIK
     ============================================================== */
  rsvpForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name     = wishName.value || guestName || 'Tamu';
    const attend   = document.getElementById('attendance').value;
    const message  = document.getElementById('wish-message').value.trim();

    if (!attend || !message) return;

    // Update Statistik Angka
    if (attend === 'Hadir' && countHadir) {
      countHadir.textContent = parseInt(countHadir.textContent) + 1;
    } else if (attend === 'Tidak Hadir' && countTidak) {
      countTidak.textContent = parseInt(countTidak.textContent) + 1;
    }

    // Buat inisial untuk Avatar
    const initial = name.charAt(0).toUpperCase();

    // Tambah Komentar Baru ke Daftar
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <div class="wish-avatar">${initial}</div>
      <div class="wish-content-box">
        <div class="wish-head">
          <strong>${escapeHtml(name)}</strong>
          <span class="badge ${attend === 'Hadir' ? 'badge-hadir' : 'badge-tidak'}">
            ${attend === 'Hadir' ? '✅' : '❌'}
          </span>
        </div>
        <div class="wish-msg">${escapeHtml(message)}</div>
        <div class="wish-time">Baru saja</div>
      </div>
    `;
    wishesList.prepend(card);

    // Kirim Data ke Bot Telegram
    sendTelegramRSVP(name, attend, message);

    // Tampilkan notifikasi dan Reset Form
    showToast('Terima kasih atas ucapan & doanya! ✨');
    document.getElementById('wish-message').value = '';
    document.getElementById('attendance').value   = '';

    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  function escapeHtml(text) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(text));
    return d.innerHTML;
  }

})();
