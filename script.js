(function() {
  'use strict';

  /* ==============================================================
     0. LOADING SCREEN (VIDEO INTRO) — BARU
  ============================================================== */
  const loadingScreen   = document.getElementById('loading-screen');
  const vidPortrait     = document.getElementById('loading-video-portrait');
  const vidLandscape    = document.getElementById('loading-video-landscape');
  const loadingSpinner  = document.getElementById('loading-spinner');

  let chosenVideo = null;

  // Pilih video berdasarkan orientasi
  function selectVideo() {
    if (chosenVideo) {
      chosenVideo.pause();
      chosenVideo.removeAttribute('autoplay');
      chosenVideo.style.opacity = '0';
    }

    if (window.innerWidth < 769) {
      chosenVideo = vidPortrait;
      vidPortrait.style.display = 'block';
      vidLandscape.style.display = 'none';
    } else {
      chosenVideo = vidLandscape;
      vidLandscape.style.display = 'block';
      vidPortrait.style.display = 'none';
    }
  }

  // Sembunyikan spinner
  function hideSpinner() {
    if (loadingSpinner) {
      loadingSpinner.style.opacity = '0';
      loadingSpinner.style.transition = 'opacity 0.5s ease';
    }
  }

  // Sembunyikan loading screen → tampilkan konten utama
  function finishLoading() {
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.transition = 'opacity 0.8s ease';
      setTimeout(function() {
        loadingScreen.style.display = 'none';
        // Pastikan gate3 dan cover-wrapper sudah terlihat
        document.body.style.overflow = '';
        // Fallback: jika ada konten yang belum muncul, paksa
      }, 800);
    }
  }

  // Proses utama setelah video siap
  function onVideoReady() {
    hideSpinner();

    if (!chosenVideo) return;

    // Fade-in video
    chosenVideo.style.opacity = '1';
    chosenVideo.style.transition = 'opacity 0.7s ease';

    chosenVideo.currentTime = 0;
    chosenVideo.play().then(function() {
      // Tunggu video selesai (atau minimal 2 detik) lalu fade-out
      var minDuration = Math.min(chosenVideo.duration || 2, 2) * 1000;
      setTimeout(function() {
        finishLoading();
      }, Math.max(minDuration, 1500)); // minimal 1.5 detik setelah main
    }).catch(function() {
      // Jika autoplay gagal, langsung sembunyikan loading screen
      finishLoading();
    });
  }

  // Inisialisasi loading
  function initLoadingScreen() {
    if (!loadingScreen || !vidPortrait || !vidLandscape) return;

    // Pastikan body tidak bisa di-scroll selama loading
    document.body.style.overflow = 'hidden';
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
    if (loadingSpinner) loadingSpinner.style.opacity = '1';

    selectVideo();

    // Event listener saat video siap diputar
    function handleReady() {
      onVideoReady();
      chosenVideo.removeEventListener('canplaythrough', handleReady);
      chosenVideo.removeEventListener('loadeddata', handleReady);
    }

    if (chosenVideo) {
      chosenVideo.addEventListener('canplaythrough', handleReady);
      chosenVideo.addEventListener('loadeddata', handleReady);
      chosenVideo.load(); // mulai preload
    }

    // Fallback: setelah 5 detik, paksa sembunyikan loading screen
    setTimeout(function() {
      if (loadingScreen && loadingScreen.style.display !== 'none') {
        hideSpinner();
        finishLoading();
      }
    }, 5000);
  }

  // Orientasi berubah → ulangi pilih video
  window.addEventListener('resize', function() {
    if (!loadingScreen || loadingScreen.style.display === 'none') return;
    selectVideo();
    // Jika video baru dipilih dan belum siap, kita tidak reset spinner
    // Tapi jika video sudah siap, kita bisa langsung mainkan
  });

  // Jalankan loading screen
  initLoadingScreen();

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

  const bgMusic        = document.getElementById('bg-music');
  const musicToggle    = document.getElementById('music-toggle');
  const themeToggle    = document.getElementById('theme-toggle');

  const emoteContainer = document.getElementById('emote-container');
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightbox-img');
  const lightboxClose  = document.getElementById('lightbox-close');

  /* ---- Element baru dari HTML upgrade ---- */
  const heroGuestEl    = document.getElementById('hero-guest-name');
  const petalLayer     = document.getElementById('petal-layer');
  const sectionDots    = document.getElementById('section-dots');
  const dotEls         = sectionDots ? sectionDots.querySelectorAll('.sec-dot') : [];
  const countHadirEl   = document.getElementById('count-hadir');
  const countTidakEl   = document.getElementById('count-tidak');
  const btnToggleRek   = document.getElementById('btn-toggle-rekening');
  const rekeningCards  = document.getElementById('rekening-cards');
  const rekeningLabel  = document.getElementById('rekening-btn-label');
  const copyToast      = document.getElementById('copy-toast');

  /* ---- Telegram Config ---- */
  const BOT_TOKEN = '7230058914:AAH5Z_7fK17zR4I5b0N-rR9U-pW7gM_0_Gg';
  const CHAT_ID   = '7017267151';

  /* ---- State ---- */
  let guestName     = '';
  let musicPlaying  = false;
  let rekeningOpen  = false;
  let countHadir    = 0;
  let countTidak    = 0;
  let petalInterval = null;

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

    gate1.classList.remove('active');
    gate1.classList.add('hidden');

    gate2.classList.remove('hidden');
    setTimeout(() => gate2.classList.add('active'), 20);

    sendTelegram(val);
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

      // ** FITUR BARU: sinkronisasi nama tamu ke hero intro **
      if (heroGuestEl && guestName) {
        heroGuestEl.textContent = guestName;
      }

      // ** FITUR BARU: mulai petal rain **
      startPetalRain();

      // ** FITUR BARU: tampilkan section dots **
      if (sectionDots) sectionDots.classList.add('visible');

      initScrollObserver();
      initCountdown();
      tryPlayMusic();
    }, 800);
  });

  /* ==============================================================
     4. TELEGRAM NOTIFICATION
  ============================================================== */
  function sendTelegram(nama) {
    const msg = `🔔 *Undangan Adib & Nabila*\n\nTamu: *${nama}* membuka amplop undangan.`;
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'Markdown' })
    }).catch(() => {});
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
     7. COUNTDOWN
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
     10. PETAL RAIN (Fitur Baru)
  ============================================================== */
  const PETALS = ['🌸', '🌺', '✿', '❀', '🌷'];
  function spawnPetal() {
    if (!petalLayer) return;
    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    el.style.left = (Math.random() * 95) + 'vw';
    el.style.fontSize = (Math.random() * 0.6 + 0.75) + 'rem';
    el.style.animationDuration = (Math.random() * 5 + 7) + 's';
    el.style.animationDelay = (Math.random() * 1.5) + 's';
    el.style.opacity = (Math.random() * 0.4 + 0.3).toString();
    petalLayer.appendChild(el);
    setTimeout(() => el.remove(), 14000);
  }

  function startPetalRain() {
    if (petalInterval) return;
    spawnPetal();
    petalInterval = setInterval(spawnPetal, 2200);
  }

  /* ==============================================================
     11. SECTION NAVIGATION DOTS (Fitur Baru)
  ============================================================== */
  if (dotEls.length > 0) {
    const sections = gate3.querySelectorAll('section');
    const dotSpy = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const idx = Array.from(sections).indexOf(entry.target);
          dotEls.forEach(function(d, i) {
            d.classList.toggle('active', i === idx);
          });
        }
      });
    }, { threshold: 0.45 });
    sections.forEach(function(s) { dotSpy.observe(s); });

    dotEls.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        if (sections[i]) sections[i].scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ==============================================================
     12. WEDDING GIFT — TOGGLE REKENING (Fitur Baru)
  ============================================================== */
  if (btnToggleRek && rekeningCards) {
    btnToggleRek.addEventListener('click', function() {
      rekeningOpen = !rekeningOpen;
      rekeningCards.classList.toggle('open', rekeningOpen);
      if (rekeningLabel) {
        rekeningLabel.textContent = rekeningOpen ? 'Tutup Rekening' : 'Buka Rekening';
      }
      if (rekeningOpen) {
        setTimeout(function() {
          rekeningCards.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }
    });
  }

  /* ==============================================================
     13. COPY NOMOR REKENING (Fitur Baru)
  ============================================================== */
  window.copyBankNum = function(elId) {
    const el = document.getElementById(elId);
    if (!el) return;
    const text = el.textContent.trim().replace(/\s+/g, '');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        showToast('✓ Nomor disalin!');
      }).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
    function fallbackCopy() {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showToast('✓ Nomor disalin!'); } catch(e) {}
      document.body.removeChild(ta);
    }
  };

  function showToast(msg) {
    if (!copyToast) return;
    copyToast.textContent = msg;
    copyToast.classList.add('show');
    setTimeout(function() { copyToast.classList.remove('show'); }, 2400);
  }

  /* ==============================================================
     14. RSVP — COUNTER + TELEGRAM + CONFETTI + AVATAR (Fitur Baru)
  ============================================================== */
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name     = wishName.value || guestName;
      const attend   = document.getElementById('attendance').value;
      const message  = document.getElementById('wish-message').value.trim();

      if (!attend || !message) return;

      // Counter update
      if (attend === 'Hadir') {
        countHadir++;
        if (countHadirEl) {
          countHadirEl.textContent = countHadir;
          countHadirEl.style.transform = 'scale(1.3)';
          setTimeout(() => { countHadirEl.style.transform = 'scale(1)'; }, 300);
        }
      } else {
        countTidak++;
        if (countTidakEl) {
          countTidakEl.textContent = countTidak;
          countTidakEl.style.transform = 'scale(1.3)';
          setTimeout(() => { countTidakEl.style.transform = 'scale(1)'; }, 300);
        }
      }

      // Buat card ucapan
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.setAttribute('data-enhanced', '1');

      const av = document.createElement('div');
      av.className = 'wish-avatar';
      av.textContent = name.charAt(0).toUpperCase();

      const head = document.createElement('div');
      head.className = 'wish-head';
      head.innerHTML = `<strong>${escapeHtml(name)}</strong> <span class="badge ${attend === 'Hadir' ? 'badge-hadir' : 'badge-tidak'}">${attend}</span>`;

      const msgDiv = document.createElement('div');
      msgDiv.className = 'wish-msg';
      msgDiv.textContent = message;

      const timeDiv = document.createElement('div');
      timeDiv.className = 'wish-time';
      const now = new Date();
      timeDiv.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
        ' · ' + now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

      card.appendChild(av);
      card.appendChild(head);
      card.appendChild(timeDiv);
      card.appendChild(msgDiv);

      wishesList.prepend(card);

      // Reset form
      document.getElementById('wish-message').value = '';
      document.getElementById('attendance').value   = '';

      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Confetti burst jika hadir
      if (attend === 'Hadir') spawnConfetti();

      // Kirim ke Telegram
      const emoji = attend === 'Hadir' ? '✅' : '🙏';
      const tgMsg = '💌 *Wishes & RSVP — Adib & Nabila*\n\n' +
                    '👤 *' + name + '*\n' +
                    emoji + ' *' + attend + '*\n' +
                    '📝 ' + message;
      fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: tgMsg, parse_mode: 'Markdown' })
      }).catch(() => {});
    });
  }

  function escapeHtml(text) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(text));
    return d.innerHTML;
  }

  /* ==============================================================
     15. CONFETTI BURST (Fitur Baru)
  ============================================================== */
  const CONFETTI_COLORS = ['#c4937e', '#b8926a', '#d4b08e', '#e8d0b8', '#f0e8e0'];
  function spawnConfetti() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.55;
    for (let i = 0; i < 30; i++) {
      (function() {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        const dx = (Math.random() - 0.5) * 260;
        const dy = (Math.random() - 0.8) * 220;
        el.style.setProperty('--dx', dx + 'px');
        el.style.setProperty('--dy', dy + 'px');
        el.style.left = cx + 'px';
        el.style.top  = cy + 'px';
        el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        el.style.width  = (Math.random() * 6 + 5) + 'px';
        el.style.height = (Math.random() * 6 + 5) + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1400);
      })();
    }
  }

})();
