document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. DEKLARASI ELEMEN DOM UTAMA
    // ==========================================
    const gateWrapper = document.getElementById('gate-wrapper');
    const gate1Content = document.getElementById('gate-1');
    const gate2Content = document.getElementById('gate-2');
    const gate3 = document.getElementById('gate-3');
    
    const guestNameInput = document.getElementById('guest-name-input');
    const btnSubmitName = document.getElementById('btn-submit-name');
    
    const guestNameDisplay = document.getElementById('guest-name-display');
    const btnOpenInvitation = document.getElementById('btn-open-invitation');
    
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    
    const rsvpForm = document.getElementById('rsvp-form');
    const wishNameInput = document.getElementById('wish-name');
    const wishesList = document.getElementById('wishes-list');

    // Container flying emotes
    const emotesContainer = document.getElementById('floating-emotes-container');

    // ==========================================
    // SETUP TELEGRAM BOT (Biar HP bunyi)
    // ==========================================
    // GANTI PAKAI TOKEN & ID KAMU!
    const TELEGRAM_BOT_TOKEN = '7230058914:AAH5Z_7fK17zR4I5b0N-rR9U-pW7gM_0_Gg'; 
    const TELEGRAM_CHAT_ID = '7017267151';

    // ==========================================
    // 2. NEW: FLYING EMOTES LOGIC (Dikit Banget)
    // ==========================================
    const emoteTypes = ['❤️', '💍'];
    let emoteInterval;

    function startFlyingEmotes() {
        // Cuma munculin dikit banget (setiap 4 sampai 6 detik sekali)
        emoteInterval = setInterval(createEmote, (Math.random() * 2000 + 4000));
    }

    function createEmote() {
        // Jika gerbang 3 sudah terbuka, emotes dimatikan biar nggak ganggu baca
        if (gate3.classList.contains('active')) {
            clearInterval(emoteInterval);
            return;
        }

        const emote = document.createElement('span');
        emote.classList.add('flying-emote');
        emote.textContent = emoteTypes[Math.floor(Math.random() * emoteTypes.length)];
        
        // Posisi random horizontal (kiri-kanan layar)
        emote.style.left = (Math.random() * 100) + 'vw';
        
        // Ukuran random dikit (biar ga kaku)
        emote.style.fontSize = (Math.random() * 0.5 + 1.2) + 'rem';

        emotesContainer.appendChild(emote);

        // Hapus elemen dari DOM setelah animasi selesai biar ga berat
        setTimeout(() => {
            emote.remove();
        }, 10000); // Samain sama durasi animasi CSS (10s forwards)
    }


    // ==========================================
    // 3. LOGIKA GERBANG 1 -> GERBANG 2
    // ==========================================
    btnSubmitName.addEventListener('click', () => {
        const guestName = guestNameInput.value.trim();
        
        if (guestName === "") {
            alert("Tolong ketik nama Anda terlebih dahulu ya!");
            return;
        }

        guestNameDisplay.innerHTML = guestName;
        wishNameInput.value = guestName;

        gate1Content.classList.remove('active');
        gate1Content.classList.add('hidden');
        
        gate2Content.classList.remove('hidden');
        gate2Content.classList.add('active');

        kirimNotifikasiTelegram(guestName);
    });

    guestNameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            btnSubmitName.click();
        }
    });

    function kirimNotifikasiTelegram(nama) {
        if(TELEGRAM_BOT_TOKEN === 'TOKEN_BOT_KAMU_DISINI') return;

        const pesan = `🔔 *Undangan Adib & Nabila*\n\nTamu atas nama: *${nama}* baru saja login ke Gerbang 2 (Halaman Amplop).`;
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: pesan,
                parse_mode: 'Markdown'
            })
        }).catch(err => console.log("Telegram notif pending setup."));
    }

    // ==========================================
    // 4. LOGIKA GERBANG 2 -> GERBANG 3 (BUKA)
    // ==========================================
    btnOpenInvitation.addEventListener('click', () => {
        gateWrapper.classList.add('slide-up-hidden');
        
        gate3.classList.remove('hidden');
        gate3.classList.add('active');

        // Mainkan musik otomatis
        bgMusic.play().catch(() => console.log("Autoplay musik ditahan browser"));
        
        // Jalankan deteksi animasi scroll
        initScrollAnimation();
        
        // Pastikan web mulai dari posisi paling atas
        window.scrollTo(0, 0);
    });

    // ==========================================
    // 5. FITUR MUSIK & TEMA (DARK/LIGHT)
    // ==========================================
    let isMusicPlaying = true;
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.textContent = '🔇';
        } else {
            bgMusic.play();
            musicToggle.textContent = '🎵';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    themeToggle.addEventListener('click', () => {
        const htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-theme');
        
        if (currentTheme === 'light') {
            htmlElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            themeToggle.textContent = '🌙';
        }
    });

    // ==========================================
    // 6. FITUR RSVP & BUKU TAMU
    // ==========================================
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = wishNameInput.value;
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('wish-message').value;

        const wishCard = document.createElement('div');
        wishCard.classList.add('wish-card');
        
        const badgeColor = attendance === 'Hadir' ? '#28a745' : '#6c757d';

        wishCard.innerHTML = `
            <div class="wish-header">
                <strong>${name}</strong>
                <span style="background-color: ${badgeColor}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px;">${attendance}</span>
            </div>
            <p style="font-size: 0.95rem;">${message}</p>
        `;

        wishesList.prepend(wishCard);
        document.getElementById('wish-message').value = '';
        alert("Terima kasih! Ucapan Anda berhasil dikirim.");
    });

    // ==========================================
    // 7. ANIMASI SCROLL KETIKA BUKA UNDANGAN
    // ==========================================
    function initScrollAnimation() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    }

    // ==========================================
    // 8. INITIALIZE ALL (Nyalakan emotes saat web dimuat)
    // ==========================================
    startFlyingEmotes(); // Nyalakan emotes di gerbang depan

});
