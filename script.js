document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. DEKLARASI VARIABEL
    // ==========================================
    const gate1 = document.getElementById('gate-1');
    const gate2 = document.getElementById('gate-2');
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

    // ==========================================
    // SETUP TELEGRAM BOT (Ganti pakai data kamu)
    // ==========================================
    const TELEGRAM_BOT_TOKEN = 'TOKEN_BOT_KAMU_DISINI'; 
    const TELEGRAM_CHAT_ID = 'CHAT_ID_KAMU_DISINI';

    // ==========================================
    // 2. LOGIKA GERBANG 1 -> GERBANG 2
    // ==========================================
    btnSubmitName.addEventListener('click', () => {
        const guestName = guestNameInput.value.trim();
        
        if (guestName === "") {
            alert("Tolong masukkan nama Anda terlebih dahulu ya!");
            return;
        }

        // Tampilkan nama di amplop (Gate 2) dan isi otomatis form RSVP
        guestNameDisplay.innerHTML = guestName;
        wishNameInput.value = guestName;

        // Animasi pindah gerbang
        gate1.classList.remove('active');
        gate1.classList.add('hidden');
        gate2.classList.remove('hidden');
        gate2.classList.add('active');

        // Kirim notifikasi Telegram di belakang layar
        kirimNotifikasiTelegram(guestName);
    });

    function kirimNotifikasiTelegram(nama) {
        // Jika token belum diisi, fungsi ini ga akan bikin web error
        if(TELEGRAM_BOT_TOKEN === 'TOKEN_BOT_KAMU_DISINI') return;

        const pesan = `🔔 *Notifikasi Undangan Guru*\n\nTamu atas nama: *${nama}* baru saja masuk ke halaman Welcome.`;
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
    // 3. LOGIKA GERBANG 2 -> GERBANG 3 (BUKA UNDANGAN)
    // ==========================================
    btnOpenInvitation.addEventListener('click', () => {
        // Pindah ke isi undangan
        gate2.classList.remove('active');
        gate2.classList.add('hidden');
        gate3.classList.remove('hidden');
        gate3.classList.add('active');

        // Mulai mainkan musik
        bgMusic.play().catch(error => console.log("Autoplay musik dicegah browser"));
        
        // Mulai pantau animasi scroll
        initScrollAnimation();
        
        // Scroll ke paling atas
        window.scrollTo(0, 0);
    });

    // ==========================================
    // 4. FITUR MUSIK & TEMA (DARK/LIGHT MODE)
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
    // 5. FITUR RSVP & BUKU TAMU
    // ==========================================
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah halaman reload

        const name = wishNameInput.value;
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('wish-message').value;

        // Membuat elemen HTML untuk ucapan baru
        const wishCard = document.createElement('div');
        wishCard.classList.add('wish-card');
        
        // Badge warna hijau untuk hadir, abu-abu untuk tidak
        const badgeColor = attendance === 'Hadir' ? '#28a745' : '#6c757d';

        wishCard.innerHTML = `
            <div class="wish-header">
                <strong>${name}</strong>
                <span style="background-color: ${badgeColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${attendance}</span>
            </div>
            <p class="wish-text">${message}</p>
        `;

        // Masukkan ucapan ke paling atas daftar
        wishesList.prepend(wishCard);

        // Reset text area
        document.getElementById('wish-message').value = '';
        alert("Terima kasih! Ucapan Anda berhasil dikirim.");
    });

    // ==========================================
    // 6. ANIMASI SAAT DI-SCROLL (INTERSECTION OBSERVER)
    // ==========================================
    function initScrollAnimation() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 }); // Muncul saat 10% elemen masuk layar

        elements.forEach(el => observer.observe(el));
    }

});
