document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. DEKLARASI ELEMEN DOM
    // ==========================================
    const gateWrapper = document.getElementById('gate-wrapper'); // Pembungkus layout 3 panel
    const gate1Content = document.getElementById('gate-1');
    const gate2Content = document.getElementById('gate-2');
    const gate3 = document.getElementById('gate-3'); // Isi undangan lengkap
    
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
    // SETUP BOT TELEGRAM (Biar HP kamu bunyi)
    // ==========================================
    // Nanti isi dengan Token & Chat ID milikmu
    const TELEGRAM_BOT_TOKEN = 'TOKEN_BOT_KAMU_DISINI'; 
    const TELEGRAM_CHAT_ID = 'CHAT_ID_KAMU_DISINI';

    // ==========================================
    // 2. LOGIKA GERBANG 1 -> GERBANG 2
    // ==========================================
    btnSubmitName.addEventListener('click', () => {
        const guestName = guestNameInput.value.trim();
        
        if (guestName === "") {
            alert("Tolong ketik nama Anda terlebih dahulu ya!");
            return;
        }

        // 1. Tampilkan nama di amplop (Gate 2)
        guestNameDisplay.innerHTML = guestName;
        // 2. Isi otomatis form nama di RSVP paling bawah web
        wishNameInput.value = guestName;

        // 3. Animasi pergantian form tengah (Gate 1 hilang, Gate 2 muncul)
        gate1Content.classList.remove('active');
        gate1Content.classList.add('hidden');
        
        gate2Content.classList.remove('hidden');
        gate2Content.classList.add('active');

        // 4. Kirim notifikasi diam-diam ke Bot Telegram
        kirimNotifikasiTelegram(guestName);
    });

    // Fitur ngetik nama pencet 'Enter' langsung lanjut
    guestNameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            btnSubmitName.click();
        }
    });

    function kirimNotifikasiTelegram(nama) {
        // Abaikan kalau token belum diganti
        if(TELEGRAM_BOT_TOKEN === 'TOKEN_BOT_KAMU_DISINI') return;

        const pesan = `🔔 *Notifikasi Undangan Guru*\n\nTamu atas nama: *${nama}* baru saja login ke Gerbang 2 (Halaman Amplop).`;
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: pesan,
                parse_mode: 'Markdown'
            })
        }).catch(err => console.log("Telegram notif error/pending setup."));
    }

    // ==========================================
    // 3. LOGIKA GERBANG 2 -> GERBANG 3 (BUKA UNDANGAN)
    // ==========================================
    btnOpenInvitation.addEventListener('click', () => {
        // 1. Geser seluruh Layout 3 Panel ke atas sampai hilang
        gateWrapper.classList.add('slide-up-hidden');
        
        // 2. Tampilkan isi undangan (Gerbang 3)
        gate3.classList.remove('hidden');
        gate3.classList.add('active');

        // 3. Mainkan musik otomatis (biasanya browser ngijinin karena user udah klik tombol)
        bgMusic.play().catch(() => console.log("Autoplay musik ditahan browser"));
        
        // 4. Jalankan deteksi animasi scroll
        initScrollAnimation();
        
        // 5. Pastikan web mulai dari posisi paling atas
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
        const htmlElement = document.documentElement; // Ambil tag <html>
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
        e.preventDefault(); // Biar web nggak refresh/reload

        const name = wishNameInput.value;
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('wish-message').value;

        // Buat elemen visual untuk ucapan baru
        const wishCard = document.createElement('div');
        wishCard.classList.add('wish-card');
        
        // Warna label: Hijau kalau hadir, Abu-abu kalau tidak
        const badgeColor = attendance === 'Hadir' ? '#28a745' : '#6c757d';

        wishCard.innerHTML = `
            <div class="wish-header">
                <strong>${name}</strong>
                <span style="background-color: ${badgeColor}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px;">${attendance}</span>
            </div>
            <p style="font-size: 0.95rem;">${message}</p>
        `;

        // Masukkan ucapan baru ke tumpukan paling atas
        wishesList.prepend(wishCard);

        // Kosongkan text area setelah dikirim
        document.getElementById('wish-message').value = '';
        
        // Notif sukses
        alert("Terima kasih! Ucapan Anda berhasil dikirim.");
    });

    // ==========================================
    // 6. ANIMASI SAAT DI-SCROLL KE BAWAH
    // ==========================================
    function initScrollAnimation() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Kalau mau animasinya cuma jalan sekali, nyalakan kode di bawah ini:
                    // observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1 }); // Elemen muncul saat 10% bagiannya masuk layar

        elements.forEach(el => observer.observe(el));
    }

});
