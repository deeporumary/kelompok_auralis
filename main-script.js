// main-script.js YANG SUDAH DISESUAIKAN UNTUK PERAN SPESIFIK

document.addEventListener("DOMContentLoaded", () => {
    // --- Elemen Universal ---
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navbar = document.getElementById("navbar");

    // --- Elemen Menu Profil ---
    const loginBtn = document.getElementById('loginBtn');
    const profileMenu = document.getElementById('profileMenu');
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileInitials = document.getElementById('profileInitials');
    const profileUsername = document.getElementById('profileUsername');
    const logoutBtn = document.getElementById('logoutBtn');

    // --- Link Menu Spesifik Berdasarkan Peran ---
    const adminMenuKelola = document.getElementById('adminMenuKelola');
    const userMenuDaftar = document.getElementById('userMenuDaftar');
    // Hapus variabel untuk menu yang tidak dipakai agar lebih bersih
    const adminMenuProfil = document.getElementById('adminMenuProfil');
    const adminMenuPengaturan = document.getElementById('adminMenuPengaturan');

    // --- Navbar Toggle untuk Mobile ---
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            navToggle.classList.toggle("active");
            document.body.classList.toggle("no-scroll");
        });
    }

    // --- Efek Scroll Navbar ---
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    // --- Fungsi untuk Mengatur Tampilan Menu Profil ---
// Di dalam file main-script.js

// CARI FUNGSI INI DAN GANTI SELURUH ISINYA
function checkLoginStatus() {
    const loginBtn = document.getElementById('loginBtn');
    const profileMenu = document.getElementById('profileMenu');
    const profileInitials = document.getElementById('profileInitials');
    const profileUsername = document.getElementById('profileUsername');
    const adminMenuKelola = document.getElementById('adminMenuKelola');
    const userMenuDaftar = document.getElementById('userMenuDaftar');

    const currentUserJSON = localStorage.getItem('currentUser');

    if (currentUserJSON) {
        try {
            const userData = JSON.parse(currentUserJSON);
            if (loginBtn) loginBtn.style.display = 'none';
            if (profileMenu) profileMenu.style.display = 'block';
            if (profileInitials) profileInitials.textContent = userData.username.substring(0, 1).toUpperCase();
            if (profileUsername) profileUsername.textContent = userData.username;

            if (userData.role === 'admin') {
                if (adminMenuKelola) adminMenuKelola.style.display = 'flex';
                if (userMenuDaftar) userMenuDaftar.style.display = 'none';
            } else {
                if (adminMenuKelola) adminMenuKelola.style.display = 'none';
                if (userMenuDaftar) userMenuDaftar.style.display = 'flex';
            }
        } catch (error) {
            console.error("Gagal membaca data login dari localStorage:", error);
            if (loginBtn) loginBtn.style.display = 'block';
            if (profileMenu) profileMenu.style.display = 'none';
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (profileMenu) profileMenu.style.display = 'none';
    }
}
    // --- Menjalankan Pengecekan Login Saat Halaman Dimuat ---
    checkLoginStatus();
});

// === FUNGSI UNTUK FILTER PROGRAM DI HALAMAN PROGRAM.HTML ===
if (window.location.pathname.endsWith('program.html')) {
    
    document.addEventListener('DOMContentLoaded', () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const programCards = document.querySelectorAll('.program-card');

        // Jika tidak ada elemen filter, hentikan eksekusi
        if (filterButtons.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Hapus kelas 'active' dari semua tombol
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Tambahkan kelas 'active' ke tombol yang diklik
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                programCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    // Tampilkan kartu jika filter adalah 'all' atau kategorinya cocok
                    if (filter === 'all' || cardCategory === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none'; // Sembunyikan kartu
                    }
                });
            });
        });
    });
}

// Cek di halaman mana kita berada dan inisialisasi filter yang sesuai
if (window.location.pathname.endsWith('blog.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const filterButtons = document.querySelectorAll('.blog-filters .filter-btn');
        const blogCards = document.querySelectorAll('.blog-grid .blog-card');

        if (filterButtons.length > 0 && blogCards.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Mengambil kategori filter dari teks tombol dan mengubahnya menjadi huruf kecil
                    const filterValue = button.textContent.trim().toLowerCase();

                    // Mengatur kelas 'active' pada tombol yang diklik
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    // Melakukan filter pada setiap kartu blog
                    blogCards.forEach(card => {
                        // Mengambil kategori dari elemen span di dalam kartu
                        const categoryElement = card.querySelector('.blog-category');
                        if (categoryElement) {
                            const cardCategory = categoryElement.textContent.trim().toLowerCase();

                            // Menampilkan kartu jika filter 'semua' atau kategorinya cocok
                            if (filterValue === 'semua' || cardCategory === filterValue) {
                                card.style.display = 'flex'; // Menggunakan 'flex' sesuai dengan styling kartu
                            } else {
                                card.style.display = 'none'; // Menyembunyikan kartu lain
                            }
                        }
                    });
                });
            });
        }
    });
}
