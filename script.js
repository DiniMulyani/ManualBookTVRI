function cariAlat() {
    // 1. Dapatkan input dari pengguna
    let input = document.getElementById('searchInput');
    let filter = input.value.toUpperCase();

    // 2. Dapatkan kontainer daftar alat (TARGETNYA DIGANTI)
    let container = document.getElementById('kartuAlatContainer');
    let kartu = container.getElementsByClassName('kartu-alat');

    // 3. Loop melalui semua kartu alat
    for (let i = 0; i < kartu.length; i++) {
        let a = kartu[i];
        let teks = a.textContent || a.innerText;

        // 4. Cek apakah teks di kartu cocok dengan input pencarian
        if (teks.toUpperCase().indexOf(filter) > -1) {
            kartu[i].style.display = ""; // Tampilkan jika cocok
        } else {
            kartu[i].style.display = "none"; // Sembunyikan jika tidak cocok
        }
    }
}


/* --- FUNGSI UNTUK MODAL GAMBAR (LIGHTBOX) --- */
/* (Kode ini tidak perlu diubah, tetap sama) */

// Dapatkan elemen-elemen modal
var modal = document.getElementById("modalGambar");
var modalImg = document.getElementById("imgModal");

// Fungsi untuk membuka modal
function bukaModal(src) {
    if (modal && modalImg) { // Pastikan elemen ada
        modal.style.display = "block";
        modalImg.src = src;
    }
}

// Fungsi untuk menutup modal
function tutupModal() {
    if (modal) { // Pastikan elemen ada
        modal.style.display = "none";
    }
}

// Cek jika modal ada sebelum menambahkan event listener
if (modal) {
    // Opsional: Tutup modal jika pengguna mengklik di luar gambar
    modal.onclick = function(event) {
        if (event.target == modal) {
            tutupModal();
        }
    }
}

function getFavorites() {
    // Membuat key unik 'manualBookFavorites' di LocalStorage
    const favorites = localStorage.getItem('manualBookFavorites');
    return favorites ? JSON.parse(favorites) : []; // Kembalikan array kosong jika belum ada
}

// Fungsi untuk memuat daftar favorit di halaman index.html
function loadFavorites() {
    const favorites = getFavorites();
    const favoritSection = document.getElementById('favoritSection');
    const favoritList = document.getElementById('favoritList');

    // Pastikan elemen HTML-nya ada di halaman ini
    if (!favoritList || !favoritSection) return; 

    favoritList.innerHTML = ''; // Kosongkan daftar setiap kali dimuat

    if (favorites.length > 0) {
        favoritSection.style.display = 'block'; // Tampilkan section jika ada favorit

        // Loop data favorit dan buat kartu HTML-nya
        favorites.forEach(item => {
            const kartu = document.createElement('a');
            kartu.href = item.url; // URL yang kita simpan
            kartu.className = 'kartu-alat';
            kartu.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            `;
            favoritList.appendChild(kartu);
        });

    } else {
        favoritSection.style.display = 'none'; // Sembunyikan jika tidak ada favorit
    }
}

// Fungsi untuk menambah/menghapus favorit (dipanggil dari tombol di halaman detail)
function toggleFavorite(pageId, pageTitle, pageDescription) {
    let favorites = getFavorites();
    const tombol = document.getElementById('tombolFavorit');
    const url = window.location.pathname; // Dapatkan URL halaman saat ini

    // Cek apakah item sudah ada di favorit
    const existingIndex = favorites.findIndex(item => item.id === pageId);

    if (existingIndex > -1) {
        // --- Hapus dari favorit ---
        favorites.splice(existingIndex, 1); // Hapus 1 item dari array
        if (tombol) {
            tombol.classList.remove('aktif');
            tombol.innerHTML = 'Tambahkan ke Favorit ⭐';
        }
    } else {
        // --- Tambahkan ke favorit ---
        const newItem = {
            id: pageId,
            title: pageTitle,
            description: pageDescription,
            url: url // Simpan URL untuk link di homepage
        };
        favorites.push(newItem);
        if (tombol) {
            tombol.classList.add('aktif');
            tombol.innerHTML = 'Hapus dari Favorit ⭐';
        }
    }

    // Simpan kembali data array yang baru ke LocalStorage
    localStorage.setItem('manualBookFavorites', JSON.stringify(favorites));
}

// Fungsi untuk mengecek status favorit saat halaman detail dimuat
function checkFavoriteStatus(pageId) {
    const favorites = getFavorites();
    const tombol = document.getElementById('tombolFavorit');
    
    if (!tombol) return; // Pastikan tombol ada

    // Cek apakah pageId ini ada di dalam array favorit
    const isFavorited = favorites.some(item => item.id === pageId);

    // Atur tampilan tombol berdasarkan status
    if (isFavorited) {
        tombol.classList.add('aktif');
        tombol.innerHTML = 'Hapus dari Favorit ⭐';
    } else {
        tombol.classList.remove('aktif');
        tombol.innerHTML = 'Tambahkan ke Favorit ⭐';
    }
}

function getChecklistKey(pageId) {
    return `manualBookChecklist_${pageId}`;
}

// Fungsi untuk menyimpan status semua checkbox
function saveChecklistStatus(pageId) {
    const key = getChecklistKey(pageId);
    let checklistData = {};

    // Temukan semua checkbox di dalam kontainer checklist
    const checkboxes = document.querySelectorAll(`#interactiveChecklist input[type="checkbox"]`);
    
    checkboxes.forEach(box => {
        // Simpan status (true/false) berdasarkan 'name' checkbox
        checklistData[box.name] = box.checked;
    });

    // Simpan objek status ke LocalStorage
    localStorage.setItem(key, JSON.stringify(checklistData));
}

// Fungsi untuk memuat status checklist saat halaman dibuka
function loadChecklistStatus(pageId, containerId) {
    const key = getChecklistKey(pageId);
    const container = document.getElementById(containerId);
    
    // Pastikan kontainer ada di halaman ini
    if (!container) return; 

    const savedData = localStorage.getItem(key);
    
    if (savedData) {
        const checklistData = JSON.parse(savedData);
        
        // Loop semua checkbox dan atur status 'checked'
        for (const boxName in checklistData) {
            const checkbox = container.querySelector(`input[name="${boxName}"]`);
            if (checkbox) {
                checkbox.checked = checklistData[boxName];
            }
        }
    }
}

// Fungsi untuk tombol "Reset Checklist"
function resetChecklist(pageId, containerId) {
    // Konfirmasi dulu
    if (!confirm('Anda yakin ingin mereset checklist ini? Progres Anda akan hilang.')) {
        return;
    }

    const key = getChecklistKey(pageId);
    const container = document.getElementById(containerId);

    // 1. Hapus data dari LocalStorage
    localStorage.removeItem(key);

    // 2. Hilangkan centang di halaman (secara visual)
    if (container) {
        const checkboxes = container.querySelectorAll(`input[type="checkbox"]`);
        checkboxes.forEach(box => {
            box.checked = false;
        });
    }
    
    console.log(`Checklist untuk ${pageId} telah direset.`);
}

function getNotesKey(pageId) {
    return `manualBookNotes_${pageId}`;
}

// Fungsi untuk menyimpan catatan (dipanggil saat mengetik)
function saveNotes(pageId) {
    const key = getNotesKey(pageId);
    const textarea = document.getElementById('personalNotes');
    
    if (textarea) {
        localStorage.setItem(key, textarea.value);
    }
}

// Fungsi untuk memuat catatan saat halaman dibuka
function loadNotes(pageId) {
    const key = getNotesKey(pageId);
    const textarea = document.getElementById('personalNotes');
    const savedNotes = localStorage.getItem(key);
    
    if (textarea && savedNotes) {
        textarea.value = savedNotes;
    }
}

function goToStep(stepId) {
    // 1. Dapatkan kontainer wizard utama
    const wizard = document.getElementById('troubleshootingWizard');
    if (!wizard) {
        console.error('Kontainer wizard (troubleshootingWizard) tidak ditemukan!');
        return;
    }

    // 2. Sembunyikan SEMUA langkah (step) di dalam wizard
    const steps = wizard.getElementsByClassName('wizard-step');
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = 'none';
    }

    // 3. Tampilkan HANYA langkah yang dituju
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.style.display = 'block';
    } else {
        // Jika ID langkah tidak ditemukan, tampilkan langkah awal
        console.error('Step ID tidak ditemukan:', stepId);
        document.getElementById('step-start').style.display = 'block';
    }
}

const FONT_SIZE_KEY = 'manualBookFontSize';
// Definisikan level ukuran font kita
const FONT_SIZES = ['small', 'medium', 'large', 'xlarge'];
const DEFAULT_FONT_SIZE = 'medium';

/**
 * Menerapkan ukuran font ke elemen <html> dan menyimpannya
 * @param {string} size - 'small', 'medium', 'large', 'xlarge'
 */
function applyFontSize(size) {
    const htmlEl = document.documentElement; // Target <html>

    // Hapus semua kelas ukuran font yang mungkin ada
    FONT_SIZES.forEach(s => {
        htmlEl.classList.remove(`font-size-${s}`);
    });

    // Tambahkan kelas yang baru (kecuali untuk medium/default)
    if (size !== DEFAULT_FONT_SIZE) {
        htmlEl.classList.add(`font-size-${size}`);
    }
    
    // Simpan preferensi ke LocalStorage
    localStorage.setItem(FONT_SIZE_KEY, size);
}

/**
 * Mengubah ukuran font berdasarkan input tombol (increase, decrease, reset)
 * @param {string} direction - 'increase', 'decrease', 'reset'
 */
function changeFontSize(direction) {
    // Baca ukuran saat ini dari LocalStorage
    let currentSize = localStorage.getItem(FONT_SIZE_KEY) || DEFAULT_FONT_SIZE;
    let currentIndex = FONT_SIZES.indexOf(currentSize);

    if (direction === 'increase' && currentIndex < FONT_SIZES.length - 1) {
        // Naikkan ukuran, tapi jangan sampai melebihi 'xlarge'
        currentIndex++;
    } else if (direction === 'decrease' && currentIndex > 0) {
        // Turunkan ukuran, tapi jangan sampai kurang dari 'small'
        currentIndex--;
    } else if (direction === 'reset') {
        // Kembalikan ke 'medium'
        currentIndex = FONT_SIZES.indexOf(DEFAULT_FONT_SIZE);
    }

    // Terapkan ukuran font yang baru
    applyFontSize(FONT_SIZES[currentIndex]);
}

/* =================================================== */
/* === FUNGSI PENCARIAN DI HALAMAN (HIGHLIGHT) === */
/* =================================================== */

/**
 * Fungsi untuk menghapus semua highlight <mark> sebelumnya
 * @param {HTMLElement} container - Elemen kontainer (misal: #content-sop)
 */
function removeHighlights(container) {
    const marks = container.querySelectorAll('mark');
    marks.forEach(mark => {
        // Ganti <mark>Tag</mark> dengan TextNode "Tag"
        // Ini adalah cara aman untuk unwrap tanpa merusak event
        mark.replaceWith(mark.textContent);
    });
    // Menggabungkan TextNode yang mungkin terpecah (misal: "teks" "sorot")
    container.normalize(); 
}

/**
 * Fungsi utama untuk mencari dan menyorot teks
 */
function highlightSearch() {
    const searchInput = document.getElementById('inPageSearchInput');
    const content = document.getElementById('content-sop'); // Target konten SOP
    
    if (!searchInput || !content) return; // Keluar jika elemen tidak ada
    
    const searchTerm = searchInput.value;
    
    // 1. Selalu hapus highlight lama sebelum mencari yang baru
    removeHighlights(content);

    // 2. Keluar jika search term kosong (kurang dari 2 karakter)
    if (searchTerm.trim().length < 2) {
        return;
    }

    // 3. Buat Regex untuk pencarian (case-insensitive, global)
    const regex = new RegExp(searchTerm, 'gi');

    // 4. Loop melalui semua node di dalam konten
    // Kita gunakan TreeWalker agar hanya menargetkan text node
    // Ini mencegah kita merusak HTML (misal: mencari di dalam atribut 'href')
    const treeWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    let currentNode;
    let nodesToReplace = []; // Tampung node yang perlu diganti

    while (currentNode = treeWalker.nextNode()) {
        const text = currentNode.nodeValue; // Ambil isi text node
        
        // Cek apakah teks cocok dan bukan di dalam script/style/textarea
        const parentTag = currentNode.parentElement.tagName.toUpperCase();
        if (parentTag !== 'SCRIPT' && parentTag !== 'STYLE' && parentTag !== 'TEXTAREA' && regex.test(text)) {
            
            // Buat kontainer sementara
            const replacementNode = document.createElement('span');
            // Ganti teks yang cocok dengan <mark>teks</mark>
            replacementNode.innerHTML = text.replace(regex, (match) => {
                return `<mark>${match}</mark>`;
            });
            
            // Simpan node lama dan baru untuk diganti nanti
            nodesToReplace.push({ oldNode: currentNode, newNode: replacementNode });
        }
    }
    
    // 5. Lakukan penggantian node setelah iterasi selesai
    nodesToReplace.forEach(item => {
        // Ganti text node asli dengan node span baru yang berisi <mark>
        // ...item.newNode.childNodes "membongkar" span agar <mark> langsung
        // menjadi anak dari elemen induk yang asli.
        item.oldNode.replaceWith(...item.newNode.childNodes);
    });
}

/**
 * Fungsi untuk membersihkan pencarian dan highlight (dipanggil tombol reset)
 */
function clearHighlightSearch() {
    const searchInput = document.getElementById('inPageSearchInput');
    const content = document.getElementById('content-sop');

    if (searchInput) {
        searchInput.value = ''; // Kosongkan input
    }
    if (content) {
        removeHighlights(content); // Hapus semua highlight
    }
}