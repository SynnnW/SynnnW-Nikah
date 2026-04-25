document.addEventListener("DOMContentLoaded", function() {

    // =========================================================================
    // 1. DEKLARASI VARIABEL DOM (Mencari elemen di dalam HTML)
    // =========================================================================
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

    const emotesContainer = document.getElementById('floating-emotes-container');

    // =========================================================================
    // SETUP TELEGRAM BOT (Untuk Notifikasi Rahasia)
    // =========================================================================
    const TELEGRAM_BOT_TOKEN = '7230058914:AAH5Z_7fK17zR4I5b0N-rR9U-pW7gM_0_Gg';
    const TELEGRAM_CHAT_ID = '7017267151';

    // =========================================================================
    // 2. FITUR FLYING EMOTES (Efek Terbang Sesekali)
    // =========================================================================
    const emoteTypes = ['🤍', '✨']; // Emote elegan, tidak norak
    let emoteInterval;

    function createEmote() {
        // Berhenti memunculkan emote kalau sudah masuk ke isi undangan (Gerbang 3)
        if (gate3.classList.contains('active')) {
            clearInterval(emoteInterval);
            return;
        }

        const emote = document.createElement('span');
        emote.classList.add('flying-emote');

        // Pilih emote secara acak (Hati putih atau kilauan)
        const randomEmote = emoteTypes[Math.floor(Math.random() * emoteTypes.length)];
        emote.textContent = randomEmote;

        // Posisi muncul acak dari kiri ke kanan (10% sampai 90% layar)
        emote.style.left = Math.floor(Math.random() * 80 + 10) + 'vw';

        // Ukuran acak sedikit biar bervariasi (antara 1.2rem sampai 1.7rem)
        const randomSize = Math.random() * 0.5 + 1.2; 
        emote.style.fontSize = randomSize + 'rem';

        emotesContainer.appendChild(emote);

        // Hapus emote dari layar setelah 12 detik (sesuai durasi animasi CSS nanti)
        setTimeout(function() {
            emote.remove();
        }, 12000);
    }

    function startFlyingEmotes() {
        // Munculkan 1 emote di awal
        createEmote();
        // Lalu munculkan lagi setiap 5 sampai 8 detik (Sangat jarang biar ga rame)
        emoteInterval = setInterval(createEmote, Math.random() * 3000 + 5000);
    }

    // =========================================================================
    // 3. LOGIKA GERBANG 1 KE GERBANG 2 (INPUT NAMA)
    // =========================================================================
    btnSubmitName.addEventListener('click', function() {
        const guestName = guestNameInput.value.trim();

        if (guestName === "") {
            alert("Tolong masukkan nama Anda terlebih dahulu ya!");
            return;
        }

        // Memasukkan nama ke Gerbang 2 dan form RSVP di bawah
        guestNameDisplay.innerHTML = guestName;
        wishNameInput.value = guestName;

        // Efek transisi: Gerbang 1 hilang, Gerbang 2 muncul
        gate1Content.classList.remove('active');
        gate1Content.classList.add('hidden');

        gate2Content.classList.remove('hidden');
        gate2Content.classList.add('active');

        // Panggil fungsi kirim notif ke Telegram kamu
        kirimNotifikasiTelegram(guestName);
    });

    // Fitur tekan 'Enter' di keyboard untuk lanjut
    guestNameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            btnSubmitName.click();
        }
    });

    // Fungsi kirim notifikasi ke Telegram via Fetch API
    function kirimNotifikasiTelegram(nama) {
        const pesan = `🔔 *Undangan Adib & Nabila*\n\nTamu atas nama: *${nama}* baru saja login ke Halaman Amplop.`;
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: pesan,
                parse_mode: 'Markdown'
            })
        }).catch(function(error) {
            console.log("Telegram notifikasi gagal dikirim.");
        });
    }

    // =========================================================================
    // 4. LOGIKA GERBANG 2 KE GERBANG 3 (BUKA UNDANGAN)
    // =========================================================================
    btnOpenInvitation.addEventListener('click', function() {
        // Layout 3 Panel utama ditarik ke atas sampai hilang
        gateWrapper.classList.add('slide-up-hidden');

        // Gerbang 3 (Isi Web) dimunculkan
        gate3.classList.remove('hidden');
        gate3.classList.add('active');

        // Musik dimainkan otomatis
        bgMusic.play().catch(function() {
            console.log("Browser menahan autoplay musik.");
        });

        // Mulai memantau animasi elemen saat di-scroll
        initScrollAnimation();

        // Paksa halaman mulai dari posisi paling atas
        window.scrollTo(0, 0);
    });

    // =========================================================================
    // 5. FITUR MUSIK DAN TEMA (DARK/LIGHT MODE)
    // =========================================================================
    let isMusicPlaying = true;

    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.textContent = '🔇';
        } else {
            bgMusic.play();
            musicToggle.textContent = '🎵';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    themeToggle.addEventListener('click', function() {
        const htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-theme');

        // Toggle antara Light dan Dark
        if (currentTheme === 'light') {
            htmlElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️'; // Berubah jadi matahari
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            themeToggle.textContent = '🌙'; // Berubah jadi bulan
        }
    });

    // =========================================================================
    // 6. FITUR BUKU TAMU / RSVP
    // =========================================================================
    rsvpForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Cegah web reload/refresh

        const name = wishNameInput.value;
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('wish-message').value;

        // Bikin elemen HTML untuk ucapan baru
        const wishCard = document.createElement('div');
        wishCard.classList.add('wish-card');

        // Atur warna label/badge (Hijau = Hadir, Abu = Tidak)
        let badgeColor;
        if (attendance === 'Hadir') {
            badgeColor = '#28a745'; 
        } else {
            badgeColor = '#6c757d'; 
        }

        wishCard.innerHTML = `
            <div class="wish-header">
                <strong>${name}</strong>
                <span style="background-color: ${badgeColor}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px;">
                    ${attendance}
                </span>
            </div>
            <p style="font-size: 0.95rem; margin-top: 8px;">${message}</p>
        `;

        // Tambahkan ucapan baru ke daftar paling atas
        wishesList.prepend(wishCard);

        // Bersihkan kolom teks ucapan setelah sukses terkirim
        document.getElementById('wish-message').value = '';

        alert("Terima kasih! Ucapan Anda berhasil dikirim.");
    });

    // =========================================================================
    // 7. ANIMASI SCROLL (MUNCUL PERLAHAN DARI BAWAH)
    // =========================================================================
    function initScrollAnimation() {
        const elements = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                // Jika elemen masuk ke dalam layar
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1 // Muncul saat 10% bagian elemen sudah terlihat di layar
        });

        elements.forEach(function(element) {
            observer.observe(element);
        });
    }

    // =========================================================================
    // 8. JALANKAN FITUR AWAL (Saat web pertama kali dibuka)
    // =========================================================================
    startFlyingEmotes(); // Jalankan emote terbang

});
