/**
 * ============================================================================
 * SCRIPT UNDANGAN PERNIKAHAN ADIB & NABILA
 * Dibuat khusus dengan transisi halus dan fitur interaktif
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================================================
    // 1. DEKLARASI VARIABEL DOM (Mengambil elemen dari HTML)
    // =========================================================================
    
    // Gerbang & Konten
    const gate1 = document.getElementById('gate-1');
    const gate2 = document.getElementById('gate-2');
    const mainContent = document.getElementById('main-content');
    
    // Input Nama
    const inputGuestName = document.getElementById('input-guest-name');
    const btnToGate2 = document.getElementById('btn-to-gate2');
    const displayGuestName = document.getElementById('display-guest-name');
    
    // Buka Undangan
    const btnOpenInvitation = document.getElementById('btn-open-invitation');
    
    // Audio
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    let isPlaying = false;

    // RSVP
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpName = document.getElementById('rsvp-name');
    const wishesListContainer = document.getElementById('wishes-list-container');


    // =========================================================================
    // 2. LOGIKA TRANSISI GERBANG (GATES)
    // =========================================================================

    // Fungsi: Pindah dari Gate 1 ke Gate 2
    btnToGate2.addEventListener('click', () => {
        const guestName = inputGuestName.value.trim();
        
        // Validasi: Jangan biarkan kosong
        if (guestName === "") {
            alert("Halo! Mohon ketikkan nama Anda terlebih dahulu ya 🙏");
            inputGuestName.focus();
            return;
        }

        // Tampilkan nama di Gate 2 dan isi otomatis ke Form RSVP
        displayGuestName.textContent = guestName;
        rsvpName.value = guestName;

        // Efek transisi (Fade Out Gate 1, Fade In Gate 2)
        gate1.style.opacity = '0';
        setTimeout(() => {
            gate1.classList.add('hidden');
            gate2.classList.remove('hidden');
            
            // Sedikit delay agar transisi CSS berjalan mulus
            setTimeout(() => {
                gate2.style.opacity = '1';
            }, 50);
        }, 600); // Waktu 600ms mengikuti CSS transition
    });

    // Fungsi: Pindah dari Gate 2 ke Isi Undangan Utama
    btnOpenInvitation.addEventListener('click', () => {
        // Efek transisi Fade Out Gate 2
        gate2.style.opacity = '0';
        
        setTimeout(() => {
            gate2.classList.add('hidden');
            mainContent.classList.remove('hidden');
            
            // Tampilkan tombol musik
            musicBtn.classList.remove('hidden');

            // Scroll perlahan ke atas (reset posisi)
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Putar musik secara otomatis
            playAudio();

            // Inisialisasi animasi scroll saat elemen mulai terlihat
            initScrollAnimations();

            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 50);
        }, 800);
    });


    // =========================================================================
    // 3. LOGIKA PEMUTAR MUSIK (AUDIO CONTROLLER)
    // =========================================================================

    function playAudio() {
        bgMusic.play()
            .then(() => {
                isPlaying = true;
                musicIcon.classList.add('fa-spin'); // Bikin ikon piringan berputar
            })
            .catch((error) => {
                // Browser biasanya memblokir autoplay jika belum ada interaksi kuat
                console.log("Autoplay ditahan oleh browser. Menunggu klik user.");
                isPlaying = false;
                musicIcon.classList.remove('fa-spin');
            });
    }

    function toggleAudio() {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.classList.remove('fa-spin');
            isPlaying = false;
        } else {
            bgMusic.play();
            musicIcon.classList.add('fa-spin');
            isPlaying = true;
        }
    }

    // Pasang event klik pada tombol musik mengambang
    musicBtn.addEventListener('click', toggleAudio);


    // =========================================================================
    // 4. LOGIKA COUNTDOWN (MENGHITUNG MUNDUR KE HARI H)
    // =========================================================================
    
    // Tentukan tanggal pernikahan (Format: Bulan Tanggal, Tahun Jam:Menit:Detik)
    const targetDate = new Date("April 1, 2026 08:00:00").getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Kalkulasi waktu
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Render ke HTML dengan format 2 digit (contoh: 09, 10)
        document.getElementById("cd-hari").textContent = days < 10 ? "0" + days : days;
        document.getElementById("cd-jam").textContent = hours < 10 ? "0" + hours : hours;
        document.getElementById("cd-menit").textContent = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("cd-detik").textContent = seconds < 10 ? "0" + seconds : seconds;

        // Jika waktu sudah habis
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("cd-hari").textContent = "00";
            document.getElementById("cd-jam").textContent = "00";
            document.getElementById("cd-menit").textContent = "00";
            document.getElementById("cd-detik").textContent = "00";
        }
    }, 1000);


    // =========================================================================
    // 5. ANIMASI SAAT SCROLL (Intersection Observer)
    // =========================================================================
    
    function initScrollAnimations() {
        // Ambil semua elemen yang punya attribute data-aos="fade-up"
        const animatedElements = document.querySelectorAll('[data-aos="fade-up"]');
        
        const observerOptions = {
            root: null, // Pakai viewport browser
            rootMargin: '0px',
            threshold: 0.15 // Animasi trigger saat 15% elemen terlihat di layar
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Tambahkan class 'aos-animate' untuk men-trigger CSS transisi
                    entry.target.classList.add('aos-animate');
                    
                    // Opsional: Jika ingin animasi hanya jalan sekali, un-comment kode di bawah ini:
                    // observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }


    // =========================================================================
    // 6. LOGIKA BUKU TAMU / RSVP (Realtime Append)
    // =========================================================================
    
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Cegah halaman refresh saat submit form

        const name = document.getElementById('rsvp-name').value;
        const attendance = document.getElementById('rsvp-attendance').value;
        const message = document.getElementById('rsvp-message').value;

        // Tentukan styling badge berdasarkan kehadiran
        let badgeClass = attendance === "Hadir" ? "badge-hadir" : "badge-absen";
        let badgeIcon = attendance === "Hadir" ? "fa-check-circle" : "fa-times-circle";

        // Buat elemen HTML baru untuk ucapan
        const newWishHTML = `
            <div class="wish-card new-wish">
                <div class="wish-header">
                    <span class="wish-sender">${name}</span>
                    <span class="wish-badge ${badgeClass}"><i class="fas ${badgeIcon}"></i> ${attendance}</span>
                </div>
                <p class="wish-text">${message}</p>
                <span class="wish-time">Baru saja</span>
            </div>
        `;

        // Sisipkan elemen baru ke paling atas daftar ucapan
        wishesListContainer.insertAdjacentHTML('afterbegin', newWishHTML);

        // Kosongkan form teks (kecuali nama dan attendance)
        document.getElementById('rsvp-message').value = '';
        document.getElementById('rsvp-attendance').value = '';

        // Tampilkan pesan sukses
        alert("Terima kasih! Doa dan konfirmasi kehadiran Anda telah terkirim.");
    });


    // =========================================================================
    // 7. EFEK PARTIKEL / DAUN JATUH ELEGAN (Opsional)
    // =========================================================================
    
    function createParticles() {
        const container = document.getElementById('particles-container');
        const particleCount = 15; // Jumlah partikel yang beterbangan

        for (let i = 0; i < particleCount; i++) {
            let particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Posisi random secara horizontal
            particle.style.left = Math.random() * 100 + 'vw';
            
            // Ukuran random
            let size = Math.random() * 8 + 4; // Ukuran 4px - 12px
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Durasi dan delay animasi random
            let duration = Math.random() * 10 + 10; // 10s - 20s
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            container.appendChild(particle);
        }
    }

    // Jalankan pembuat partikel
    createParticles();

});
