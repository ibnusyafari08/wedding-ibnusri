/* =========================================
   BAGIAN 1: RESET POSISI & PRE-LOADER
   (Dijalankan sebelum halaman selesai loading)
   ========================================= */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // Matikan fitur ingat posisi scroll browser
}
window.scrollTo(0, 0); // Paksa scroll ke paling atas

/* =========================================
   BAGIAN 2: LOGIKA UTAMA (SETELAH DOM READY)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

    // --- A. KUNCI SCROLL & RESET MUSIK ---
    const body = document.body;
    body.classList.add('noscroll'); 
    
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    // Sembunyikan tombol musik di awal
    if (musicBtn) musicBtn.style.display = "none";
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }

    document.addEventListener("DOMContentLoaded", function () {


const params = new URLSearchParams(window.location.search);
const rawName = params.get('to') || params.get('u');
const rawPartner = params.get('p');


const capitalizeWords = str =>
str.replace(/\b\w/g, c => c.toUpperCase());


const cleanText = str =>
capitalizeWords(
decodeURIComponent(str.replace(/\+/g, ' '))
.replace(/[<>]/g, '')
.replace(/\s+/g, ' ')
.trim()
);


const heroEl = document.getElementById('nama-tamu'); // ⬅️ HERO


if (rawName && heroEl) {
const guestName = cleanText(rawName);
const partnerName = rawPartner ? cleanText(rawPartner) : null;


// HERO (boleh pakai partner)
heroEl.innerText = partnerName
? `${guestName} & ${partnerName}`
: guestName;


// RSVP (nama utama saja)
const inputNama = document.getElementById('nama');
if (inputNama) inputNama.value = guestName;


} else if (heroEl) {
heroEl.innerText = "Tamu Kehormatan";
}


});

    // --- C. TOMBOL BUKA UNDANGAN (FIX ANIMASI DISINI) ---
    const btnOpen = document.getElementById('btn-open');
    const openingSection = document.getElementById('opening'); 

    if (btnOpen) {
        btnOpen.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Buka Kunci Scroll
            body.classList.remove('noscroll');
            
            // 2. Ubah Tampilan Tombol (Feedback)
            btnOpen.innerHTML = '<i class="bi bi-arrow-down-circle"></i> Membuka...';
            // Opsional: disable tombol biar gak diklik berkali-kali
            // btnOpen.classList.add('disabled'); 

            // 3. Mainkan Musik
            if (bgMusic) {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    if (musicBtn) {
                        musicBtn.style.display = "flex"; 
                        musicBtn.classList.add('spinning'); 
                    }
                }).catch(err => console.log("Autoplay dicegah browser, user harus interaksi lagi:", err));
            }

            // 4. Scroll ke Section Berikutnya
            if (openingSection) {
                openingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // [PENTING] TRIGGER ANIMASI MANUAL
                // Tambahkan class .start-anim setelah jeda dikit (300ms)
                setTimeout(() => {
                    openingSection.classList.add('start-anim');
                }, 300);
            }
        });
    }

    // --- D. KONTROL MUSIK (PAUSE/PLAY) ---
    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicIcon.classList.remove('bi-disc');
                musicIcon.classList.add('bi-pause-circle');
                musicBtn.classList.remove('spinning');
                isPlaying = false;
            } else {
                bgMusic.play();
                musicIcon.classList.remove('bi-pause-circle');
                musicIcon.classList.add('bi-disc');
                musicBtn.classList.add('spinning');
                isPlaying = true;
            }
        });
    }

    // --- E. ANIMASI SCROLL (FADE UP UMUM) ---
    // Observer ini untuk elemen lain (selain opening) yang pakai class .fade-up
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('start-anim'); 
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // --- F. COUNTDOWN TIMER ---
    function createCountdown(elementId, targetDateString) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const targetDate = new Date(targetDateString).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                element.innerHTML = "<div class='text-white fw-bold'>Acara Telah Selesai</div>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            element.innerHTML = `
                <div class="time-box"><span class="time-val">${days}</span><span class="time-label">Hari</span></div>
                <div class="time-box"><span class="time-val">${hours}</span><span class="time-label">Jam</span></div>
                <div class="time-box"><span class="time-val">${minutes}</span><span class="time-label">Menit</span></div>
                <div class="time-box"><span class="time-val">${seconds}</span><span class="time-label">Detik</span></div>
            `;
        }, 1000);
    }

    // SETTING TANGGAL ACARA
    createCountdown('countdown-akad', '2026-03-10T09:00:00');
    createCountdown('countdown-resepsi', '2026-04-26T13:00:00');

    /* =========================================
       BAGIAN 3: GALLERY LIGHTBOX
       ========================================= */
    window.showLightbox = function(element) {
        const fullSizeSrc = element.getAttribute('data-full'); 
        const modalImg = document.getElementById('lightboxImg');
        
        if (modalImg && fullSizeSrc) {
            modalImg.src = fullSizeSrc;
            const galleryModal = new bootstrap.Modal(document.getElementById('galleryModal'));
            galleryModal.show();
        }
    };

    /* =========================================
       BAGIAN 4: RSVP & BUKU TAMU (GOOGLE SHEETS)
       ========================================= */
    const API_URL = "https://script.google.com/macros/s/AKfycbx1HWFysBobL7PgUX0dyBFDwsmRfRUA5YijrGX_-pGrEVQDahiSsm_SwWellbb8ocX6/exec";
    const LIMIT = 5; 
    let currentPage = 1;
    let allData = [];

    // --- 1. Load Data ---
    const loadBukuTamu = async () => {
        const container = document.getElementById("bukuTamu");
        if (!container) return;

        container.innerHTML = `<div class="col-12 text-center text-white"><div class="spinner-border text-warning" role="status"></div><p class="mt-2 small">Memuat doa...</p></div>`;

        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            
            allData = data.filter(item => item.nama && item.komentar).reverse();
            renderBukuTamu();
        } catch (error) {
            console.error("Gagal memuat:", error);
            container.innerHTML = `<p class="text-center text-white small">Gagal memuat data.</p>`;
        }
    };

    // --- 2. Render Tampilan ---
    const renderBukuTamu = () => {
        const container = document.getElementById("bukuTamu");
        const pagination = document.getElementById("pagination");
        if (!container) return;

        container.innerHTML = "";
        
        const start = (currentPage - 1) * LIMIT;
        const end = start + LIMIT;
        const pageData = allData.slice(start, end);

        if (pageData.length === 0) {
            container.innerHTML = `<div class="text-center text-white opacity-75">Belum ada ucapan. Jadilah yang pertama!</div>`;
            if (pagination) pagination.innerHTML = "";
            return;
        }

        pageData.forEach(item => {
            let badgeClass = item.status === 'Hadir' ? 'bg-success' : (item.status === 'Tidak Hadir' ? 'bg-danger' : 'bg-secondary');
            let iconClass = item.status === 'Hadir' ? 'bi-check-circle-fill' : (item.status === 'Tidak Hadir' ? 'bi-x-circle-fill' : 'bi-question-circle-fill');

            const dateVal = item.tanggal ? new Date(item.tanggal) : new Date();
            const dateStr = dateVal.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            const timeStr = dateVal.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const jumlahTamu = item.jumlah ? `(${item.jumlah} org)` : '';

            const html = `
                <div class="col-11 col-md-10 mb-3 fade-up start-anim">
                  <div class="card border-0 shadow-sm" style="border-radius: 12px; background: rgba(255, 255, 255, 0.95);">
                    <div class="card-body p-3">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="fw-bold mb-0 text-dark" style="font-size: 0.95rem;">${escapeHtml(item.nama)}</h6>
                        <span class="badge ${badgeClass} rounded-pill" style="font-size: 0.7rem;">
                          <i class="bi ${iconClass}"></i> ${item.status} ${jumlahTamu}
                        </span>
                      </div>
                      <p class="mb-2 text-secondary" style="font-size: 0.85rem; border-bottom: 1px dashed #ddd; padding-bottom: 8px;">
                        "${escapeHtml(item.komentar)}"
                      </p>
                      <div class="d-flex align-items-center">
                          <small class="text-muted" style="font-size: 0.65rem;">
                            <i class="bi bi-clock"></i> ${dateStr} • ${timeStr}
                          </small>
                      </div>
                    </div>
                  </div>
                </div>`;
            container.innerHTML += html;
        });

        renderPagination();
    };

    // --- 3. Pagination ---
    const renderPagination = () => {
        const pagination = document.getElementById("pagination");
        if (!pagination) return;
        pagination.innerHTML = "";
        
        const totalPage = Math.ceil(allData.length / LIMIT);
        if (totalPage <= 1) return;

        pagination.innerHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">&laquo;</a></li>`;
        
        for (let i = 1; i <= totalPage; i++) {
            if (i === 1 || i === totalPage || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pagination.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a></li>`;
            }
        }

        pagination.innerHTML += `<li class="page-item ${currentPage === totalPage ? 'disabled' : ''}"><a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">&raquo;</a></li>`;
    };

    window.changePage = (page) => {
        if (page < 1 || page > Math.ceil(allData.length / LIMIT)) return;
        currentPage = page;
        renderBukuTamu();
        document.getElementById("bukuTamu").scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // --- 4. Submit Form ---
    const form = document.getElementById("my-form");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const oldText = btn.innerHTML;
            
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Mengirim...`;

            const data = new FormData(this);
            fetch(API_URL, { method: "POST", body: data })
                .then(() => {
                    alert("Konfirmasi kehadiran berhasil dikirim!");
                    this.reset();
                    currentPage = 1;
                    loadBukuTamu();
                })
                .catch(err => {
                    console.error(err);
                    alert("Gagal mengirim data. Coba lagi.");
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.innerHTML = oldText;
                });
        });
    }

    const escapeHtml = (text) => {
        if (!text) return "";
        return text.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
    };

    loadBukuTamu();

    /* ========================
       FUNGSI COPY REKENING
       ======================== */
    // Ditempel ke window agar bisa dipanggil HTML (Global Scope)
    window.copyText = function(elementId, textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(function() {
            const btn = document.querySelector(`button[onclick*="${elementId}"]`);
            if (btn) {
                const originalContent = btn.innerHTML;
                
                btn.innerHTML = `<i class="bi bi-check-lg"></i> Berhasil`;
                btn.classList.remove('btn-outline-secondary'); // Opsional: sesuaikan class asli
                btn.classList.add('btn-success');
                
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-outline-secondary'); // Opsional: kembalikan class asli
                }, 2000);
            }
        }, function(err) {
            console.error('Gagal menyalin: ', err);
        });
    };

}); // --- END DOM CONTENT LOADED ---