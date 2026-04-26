(function() {
  'use strict';

  /* ==============================================================
     0. LOADING SCREEN (VIDEO INTRO) — TIDAK DIUBAH
  ============================================================== */
  const loadingScreen   = document.getElementById('loading-screen');
  const vidPortrait     = document.getElementById('loading-video-portrait');
  const vidLandscape    = document.getElementById('loading-video-landscape');
  const loadingSpinner  = document.getElementById('loading-spinner');

  let chosenVideo = null;

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

  function hideSpinner() {
    if (loadingSpinner) {
      loadingSpinner.style.opacity = '0';
      loadingSpinner.style.transition = 'opacity 0.5s ease';
    }
  }

  function finishLoading() {
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.transition = 'opacity 0.8s ease';
      setTimeout(function() {
        loadingScreen.style.display = 'none';
        document.body.style.overflow = '';
      }, 800);
    }
  }

  function onVideoReady() {
    hideSpinner();

    if (!chosenVideo) return;

    chosenVideo.style.opacity = '1';
    chosenVideo.style.transition = 'opacity 0.7s ease';

    chosenVideo.currentTime = 0;
    chosenVideo.play().then(function() {
      /* Selalu tampilkan loading minimal 5 detik */
      setTimeout(function() {
        finishLoading();
      }, 5000);
    }).catch(function() {
      /* Jika video gagal play, tetap tunggu 5 detik */
      setTimeout(function() {
        finishLoading();
      }, 5000);
    });
  }

  function initLoadingScreen() {
    if (!loadingScreen || !vidPortrait || !vidLandscape) return;

    document.body.style.overflow = 'hidden';
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
    if (loadingSpinner) loadingSpinner.style.opacity = '1';

    selectVideo();

    function handleReady() {
      onVideoReady();
      chosenVideo.removeEventListener('canplaythrough', handleReady);
      chosenVideo.removeEventListener('loadeddata', handleReady);
    }

    if (chosenVideo) {
      chosenVideo.addEventListener('canplaythrough', handleReady);
      chosenVideo.addEventListener('loadeddata', handleReady);
      chosenVideo.load();
    }

    setTimeout(function() {
      if (loadingScreen && loadingScreen.style.display !== 'none') {
        hideSpinner();
        finishLoading();
      }
    }, 5000);
  }

  window.addEventListener('resize', function() {
    if (!loadingScreen || loadingScreen.style.display === 'none') return;
    selectVideo();
  });

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
     2. GATE 1 → GATE 2
  ============================================================== */
  function goToGate2() {
    const val = nameInput.value.trim();
    if (!val) {
      nameInput.style.animation = 'none';
      nameInput.offsetHeight;
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

  nameInput.addEventListener('focus', () => {
    nameInput.closest('.input-row').style.transform = 'scale(1.02)';
  });
  nameInput.addEventListener('blur', () => {
    nameInput.closest('.input-row').style.transform = 'scale(1)';
  });

  /* ==============================================================
     3. GATE 2 → GATE 3
  ============================================================== */
  btnOpen.addEventListener('click', function () {
    coverWrapper.classList.add('exit');

    setTimeout(function () {
      gate3.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' });

      if (heroGuestEl && guestName) {
        heroGuestEl.textContent = guestName;
      }

      startPetalRain();

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
     8. SCROLL REVEAL ANIMATION (LAMA — untuk class .reveal)
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
     10. PETAL RAIN
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
     11. SECTION NAVIGATION DOTS (LAMA — untuk .sec-dot lama)
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
     12. WEDDING GIFT — TOGGLE REKENING
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
     13. COPY NOMOR REKENING
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
     14. RSVP — COUNTER + TELEGRAM + CONFETTI + AVATAR
  ============================================================== */
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name     = wishName.value || guestName;
      const attend   = document.getElementById('attendance').value;
      const message  = document.getElementById('wish-message').value.trim();

      if (!attend || !message) return;

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

      const card = document.createElement('div');
      card.className = 'wish-card-glass';
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

      document.getElementById('wish-message').value = '';
      document.getElementById('attendance').value   = '';

      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (attend === 'Hadir') spawnConfetti();

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
     15. CONFETTI BURST
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


  /* ================================================================
     ████████████████████████████████████████████████████████████████
     SISTEM BARU — DITAMBAHKAN DI BAWAH KODE LAMA
     Tidak ada kode lama yang dihapus atau dimodifikasi.
     ████████████████████████████████████████████████████████████████
  ================================================================ */


  /* ==============================================================
     A. INJECT MISSING CSS (confetti, wish-avatar, wish-time)
        supaya komponen yang dibuat JS tetap terlihat bagus
  ============================================================== */
  (function injectMissingStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Wish card avatar (inisial nama) */
      .wish-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #c4937e, #b8926a);
        color: #fff;
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.1rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        flex-shrink: 0;
        box-shadow: 0 3px 10px rgba(196,147,126,0.3);
      }

      /* Timestamp ucapan */
      .wish-time {
        font-family: 'Montserrat', sans-serif;
        font-size: 0.6rem;
        letter-spacing: 1px;
        color: var(--text-light);
        opacity: 0.7;
        margin-bottom: 6px;
      }

      /* Wish card dark mode fallback */
      [data-theme="dark"] .wish-card-glass {
        background: rgba(15, 10, 6, 0.55);
        border-color: rgba(196, 147, 126, 0.15);
      }

      /* Ripple effect wave */
      .ripple-wave {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.35);
        width: 10px;
        height: 10px;
        margin-left: -5px;
        margin-top: -5px;
        animation: rippleExpand 0.6s linear forwards;
        pointer-events: none;
      }
      @keyframes rippleExpand {
        to { transform: scale(30); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  })();


  /* ==============================================================
     B. HAPTIC FEEDBACK SYSTEM
        Android: navigator.vibrate()
        iOS    : checkbox switch hack (Taptic Engine)
  ============================================================== */
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  function triggerHaptic(pattern) {
    pattern = pattern || [30];

    if (isIOS()) {
      /* iOS Taptic Engine hack — Safari memblokir vibrate() */
      const cb = document.createElement('input');
      cb.setAttribute('type', 'checkbox');
      cb.setAttribute('switch', '');
      cb.style.cssText = 'position:absolute;opacity:0;pointer-events:none;left:-9999px;top:-9999px;';
      document.body.appendChild(cb);
      cb.click();
      setTimeout(function() {
        if (cb.parentNode) cb.parentNode.removeChild(cb);
      }, 100);
    } else if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  /* Expose globally agar onclick inline di HTML bisa memanggil */
  window.triggerHaptic = triggerHaptic;


  /* ==============================================================
     C. HAPTIC LISTENERS — pasang ke semua elemen interaktif
  ============================================================== */
  function initHapticListeners() {
    const selectors = [
      '.bento-btn-map',
      '.bento-card a',
      '.creator-link',
      '.btn-primary-glass',
      '.btn-primary',
      '#music-toggle',
      '#theme-toggle',
      '.gal-img',
      '.slide-nav-dot',
      '.btn-copy-bank',
      '.btn-open',
      '.btn-arrow'
    ];

    selectors.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        /* touchstart = pre-feedback sedikit sebelum klik */
        el.addEventListener('touchstart', function() {
          triggerHaptic([15]);
        }, { passive: true });

        /* click = feedback utama */
        el.addEventListener('click', function() {
          triggerHaptic([25]);
        });
      });
    });
  }


  /* ==============================================================
     D. RIPPLE EFFECT — gelombang klik pada .ripple-btn
  ============================================================== */
  function initRippleEffect() {
    document.querySelectorAll('.ripple-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        const rect = btn.getBoundingClientRect();
        const wave = document.createElement('span');
        wave.className = 'ripple-wave';
        wave.style.left = (e.clientX - rect.left) + 'px';
        wave.style.top  = (e.clientY - rect.top)  + 'px';
        btn.appendChild(wave);
        setTimeout(function() { wave.remove(); }, 700);
      });
    });
  }


  /* ==============================================================
     E. REVEAL OBSERVER BARU
        Menangani class: .text-reveal, .panel-reveal, .card-reveal
        (Pengganti glitch — animasi sinematik dari CSS baru)
  ============================================================== */
  function initRevealObserver() {
    const revealSelectors = [
      '.text-reveal',
      '.text-reveal-left',
      '.text-reveal-right',
      '.panel-reveal',
      '.card-reveal'
    ];
    const allRevealEls = gate3.querySelectorAll(revealSelectors.join(','));

    if (allRevealEls.length === 0) return;

    const revealObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          /* Setelah revealed, berhenti observe supaya animasi tidak ulang */
          revealObs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    allRevealEls.forEach(function(el) {
      revealObs.observe(el);
    });
  }


  /* ==============================================================
     F. SLIDE NAV DOTS BARU
        Untuk .slide-nav-dot di HTML baru (bukan .sec-dot lama)
  ============================================================== */
  function initSlideNav() {
    const newDots   = document.querySelectorAll('.slide-nav-dot');
    const slides    = gate3 ? gate3.querySelectorAll('.slide') : [];

    if (!newDots.length || !slides.length || !gate3) return;

    /* Update dot aktif saat gate3 di-scroll */
    gate3.addEventListener('scroll', function() {
      const scrollTop  = gate3.scrollTop;
      const vh         = window.innerHeight;
      const slideIndex = Math.round(scrollTop / vh);

      newDots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === slideIndex);
      });
    }, { passive: true });

    /* Klik dot → scroll ke slide */
    newDots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        const target = parseInt(this.dataset.target, 10);
        if (gate3) {
          gate3.scrollTo({
            top: target * window.innerHeight,
            behavior: 'smooth'
          });
        }
        triggerHaptic([20]);
      });
    });

    /* Tambahkan juga observer berbasis IntersectionObserver
       sebagai fallback agar sync lebih akurat */
    const slideObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const idx = Array.from(slides).indexOf(entry.target);
          if (idx >= 0) {
            newDots.forEach(function(d, i) {
              d.classList.toggle('active', i === idx);
            });
          }
        }
      });
    }, {
      root: gate3,
      threshold: 0.5
    });

    slides.forEach(function(slide) { slideObs.observe(slide); });
  }


  /* ==============================================================
     G. PARALLAX — Background foto Slide 1 & 2
        Hanya aktif di desktop (>768px), di mobile dimatikan
        supaya panel tidak jitter saat scroll
  ============================================================== */
  function initParallax() {
    /* Matikan parallax di HP */
    if (window.innerWidth <= 768) return;

    const heroSlide   = gate3 ? gate3.querySelector('.slide-hero')   : null;
    const coupleSlide = gate3 ? gate3.querySelector('.slide-couple') : null;

    const heroBg   = heroSlide   ? heroSlide.querySelector('.parallax-bg')   : null;
    const coupleBg = coupleSlide ? coupleSlide.querySelector('.parallax-bg') : null;

    if (!gate3 || (!heroBg && !coupleBg)) return;

    gate3.addEventListener('scroll', function() {
      const scrollTop = gate3.scrollTop;
      const vh        = window.innerHeight;

      if (heroBg) {
        const offset = scrollTop * 0.28;
        heroBg.style.backgroundPositionY = 'calc(50% + ' + offset + 'px)';
      }

      if (coupleBg) {
        const rel = scrollTop - vh;
        if (rel > -vh && rel < vh) {
          const offset = rel * 0.28;
          coupleBg.style.backgroundPositionY = 'calc(50% + ' + offset + 'px)';
        }
      }
    }, { passive: true });
  }


  /* ==============================================================
     H. GALLERY PARALLAX — hanya desktop, bg-layer yang bergerak
        bukan img supaya kartu tidak goyang di HP
  ============================================================== */
  function initGalleryParallax() {
    /* Di mobile, parallax dimatikan supaya kartu tidak goyang */
    if (window.innerWidth <= 768) return;

    const galSlide = gate3 ? gate3.querySelector('.slide-gallery-new') : null;
    if (!galSlide || !gate3) return;

    const galBg = galSlide.querySelector('.slide-bg-layer');
    if (!galBg) return;

    const galObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          galSlide.dataset.inView = '1';
        } else {
          delete galSlide.dataset.inView;
        }
      });
    }, { root: gate3, threshold: 0.1 });

    galObs.observe(galSlide);

    gate3.addEventListener('scroll', function() {
      if (!galSlide.dataset.inView) return;
      const scrollTop = gate3.scrollTop;
      const vh        = window.innerHeight;
      const rel       = scrollTop - (3 * vh); /* slide 4 adalah index ke-3 */
      const offset    = rel * 0.22;
      galBg.style.backgroundPositionY = 'calc(50% + ' + offset + 'px)';
    }, { passive: true });
  }


  /* ==============================================================
     I. KEYBOARD SHORTCUT — ESC untuk tutup lightbox
        (tambahan kenyamanan, tidak mengganti kode lightbox lama)
  ============================================================== */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('open')) {
        lightbox.classList.remove('open');
      }
    }
  });


  /* ==============================================================
     J. SCROLL INDICATOR KLIK — klik scroll hint di slide 1
        langsung scroll ke slide 2
  ============================================================== */
  (function initScrollIndicatorClick() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator || !gate3) return;

    indicator.addEventListener('click', function() {
      gate3.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      triggerHaptic([20]);
    });
  })();


  /* ==============================================================
     K. MASTER INIT — dipanggil setelah gate3 aktif
        Menggunakan MutationObserver agar tidak perlu ubah
        btnOpen listener yang sudah ada
  ============================================================== */

  /* Inject slide-bg-layer ke slide yang belum punya
     (gallery & rsvp di HTML tidak punya slide-bg-layer) */
  function injectMissingBgLayers() {
    const needsBg = ['.slide-gallery-new', '.slide-rsvp-new'];
    needsBg.forEach(function(sel) {
      const slide = gate3 ? gate3.querySelector(sel) : null;
      if (!slide) return;
      if (!slide.querySelector('.slide-bg-layer')) {
        const bgLayer = document.createElement('div');
        bgLayer.className = 'slide-bg-layer parallax-bg';
        slide.insertBefore(bgLayer, slide.firstChild);
      }
      if (!slide.querySelector('.slide-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'slide-overlay';
        const bgLayer = slide.querySelector('.slide-bg-layer');
        bgLayer.insertAdjacentElement('afterend', overlay);
      }
    });
  }

  (function watchGate3Active() {
    if (!gate3) return;

    let newSystemInit = false;

    const mo = new MutationObserver(function(mutations) {
      mutations.forEach(function(mut) {
        if (mut.attributeName === 'class' &&
            gate3.classList.contains('active') &&
            !newSystemInit) {

          newSystemInit = true;

          /* Beri sedikit jeda agar DOM slide sudah ter-render */
          setTimeout(function() {
            injectMissingBgLayers();  /* inject bg-layer ke gallery & rsvp */
            initRevealObserver();   /* E: animasi teks/panel/card baru */
            initSlideNav();         /* F: nav dots baru */
            initParallax();         /* G: parallax bg foto (desktop only) */
            initGalleryParallax();  /* H: parallax bg galeri (desktop only) */
            initRippleEffect();     /* D: efek ripple tombol */
            initHapticListeners();  /* C: haptic semua tombol */
          }, 200);

          mo.disconnect(); /* Selesai, tidak perlu observe lagi */
        }
      });
    });

    mo.observe(gate3, { attributes: true });
  })();


})();