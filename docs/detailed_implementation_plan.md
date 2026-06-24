# Rencana Implementasi Detail: PostgreSQL Auth & Chat History

Dokumen ini memberikan panduan teknis langkah demi langkah untuk mengimplementasikan autentikasi pengguna dan penyimpanan riwayat sesi chat di **MentorJS** menggunakan **PostgreSQL** dan **Prisma ORM** (Opsi A - Tabel Relasional Terpisah).

---

## 📂 Peta Direktori & File Proyek

Berikut adalah daftar file dan folder yang akan dibuat atau dimodifikasi selama proses pengembangan:

```text
aura/
├── docker-compose.yml             # [BUAT] Konfigurasi container PostgreSQL Docker
├── backend/
│   ├── prisma/                    # [BUAT] Konfigurasi Prisma ORM
│   │   └── schema.prisma          # [BUAT] Model Skema Database
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # [BUAT] Inisialisasi Prisma Client
│   │   ├── controllers/
│   │   │   ├── authController.js  # [BUAT] Handler Register, Login, & Logout
│   │   │   ├── historyController.js # [BUAT] Handler CRUD untuk Sesi & Riwayat
│   │   │   └── mentorController.js # [EDIT] Menyimpan otomatis percakapan ke DB
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js  # [BUAT] Middleware validasi cookie JWT
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # [BUAT] Definisi routing Autentikasi
│   │   │   ├── historyRoutes.js   # [BUAT] Definisi routing Sesi/Riwayat
│   │   │   └── mentorRoutes.js    # [EDIT] Tambahkan middleware auth
│   │   └── server.js              # [EDIT] Registrasi routes baru & konfigurasi CORS
│   └── .env                       # [EDIT] Tambahkan DATABASE_URL & JWT_SECRET
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx    # [BUAT] State Autentikasi global React
    │   ├── pages/
    │   │   ├── Auth/
    │   │   │   └── AuthPage.jsx   # [BUAT] Tampilan UI Login & Register
    │   │   └── Sandbox/
    │   │       ├── SandboxPage.jsx # [EDIT] Integrasikan Sidebar Riwayat
    │   │       └── components/
    │   │           ├── HistorySidebar.jsx # [BUAT] Sidebar untuk ganti/hapus sesi
    │   │           └── EditorPanel.jsx # [EDIT] Tombol untuk menyimpan kode
    │   ├── hooks/
    │   │   └── useChat.js         # [EDIT] Hubungkan aksi kirim pesan ke DB
    │   ├── services/
    │   │   └── api.js             # [EDIT] Setel Axios agar mendukung Cookie aman
    │   └── App.jsx                # [EDIT] Tambahkan pelindung rute (Auth Guard)
```

---

## 🛠️ Spesifikasi Langkah Pengembangan: Backend

### 1. Pengaturan Database & Container Docker
* **File**: `docker-compose.yml` (Di Root Project)
  * **Peran**: Menjalankan PostgreSQL secara lokal menggunakan Docker.
  * **Spesifikasi**: Menetapkan nama container `postgres_db`, port `5432:5432`, set user/password default, serta mengaitkan penyimpanan data ke Docker volume lokal agar data tidak hilang saat container mati.
* **File**: `backend/.env`
  * **Peran**: Menyimpan kredensial sensitif.
  * **Variabel Baru**:
    * `DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/mentorjs?schema=public"`
    * `JWT_SECRET="isi-dengan-string-acak-yang-panjang-dan-aman"`

### 2. Model Database menggunakan Prisma
* **File**: `backend/prisma/schema.prisma`
  * **Peran**: Mendefinisikan tabel database dan relasi antar tabel.
  * **Model**:
    * `User`: Field `id` (Auto-increment), `username`, `email`, `password`, `createdAt`, dan relasi `Session[]`.
    * `Session`: Field `id` (UUID), `userId` (Foreign Key), `title` (Judul sesi), `lastSavedCode` (Snapshot kode terakhir), `createdAt`, `updatedAt`, relasi ke `User` dan `Message[]`.
    * `Message`: Field `id` (Auto-increment), `sessionId` (Foreign Key), `sender` ("user" atau "mentor"), `text` (Isi pesan), `createdAt`.
* **File**: `backend/src/config/db.js`
  * **Peran**: Menginisialisasi dan mengekspor instance `PrismaClient` untuk digunakan di semua Controller.

### 3. Middleware Keamanan
* **File**: `backend/src/middlewares/authMiddleware.js`
  * **Peran**: Melindungi endpoint sensitif dengan memverifikasi JSON Web Token (JWT).
  * **Fungsi**:
    * `authenticateToken(req, res, next)`: Mengambil token JWT dari Cookie HTTP-Only. Mendekode dan memverifikasi tanda tangan JWT. Jika token valid, set data user di `req.user` dan lanjutkan ke request berikutnya (`next()`). Jika gagal/tidak ada, kirim respon error HTTP 401 (Unauthorized).

### 4. Controller & Logika API
* **File**: `backend/src/controllers/authController.js`
  * **Peran**: Menangani pendaftaran akun, login, dan hapus session.
  * **Fungsi**:
    * `registerUser(req, res)`: Men-hash password dengan `bcryptjs`, menyimpan data user baru ke Postgres, menandatangani token JWT, menetapkannya sebagai cookie, lalu mengembalikan profil user.
    * `loginUser(req, res)`: Mencari user berdasarkan email, mencocokkan password, menandatangani JWT, menyimpannya sebagai Cookie HTTP-Only bernama `token`, dan mengembalikan data user.
    * `logoutUser(req, res)`: Menghapus cookie `token` dari browser.
    * `getUserProfile(req, res)`: Mengembalikan data user yang sedang aktif berdasarkan ID dari token JWT.
* **File**: `backend/src/controllers/historyController.js`
  * **Peran**: Menangani operasi CRUD sesi belajar.
  * **Fungsi**:
    * `getSessions(req, res)`: Mengambil semua daftar sesi milik user yang aktif (diurutkan berdasarkan waktu terakhir diupdate).
    * `createSession(req, res)`: Membuat baris sesi kosong baru di bawah `userId`.
    * `getSessionById(req, res)`: Mengambil riwayat chat lengkap dan kode terakhir untuk sesi tertentu.
    * `updateSessionCode(req, res)`: Memperbarui kolom `lastSavedCode` pada sesi tertentu.
    * `deleteSession(req, res)`: Menghapus sesi belajar (otomatis menghapus semua pesan terkait).
* **File**: `backend/src/controllers/mentorController.js` (Edit)
  * **Peran**: Menghubungkan respon AI dengan penyimpanan database.
  * **Fungsi**:
    * Memodifikasi API mentor agar setelah Gemini membalas prompt user, server langsung menyimpan kedua pesan tersebut (pesan user & balasan mentor) ke tabel `Message` yang berelasi dengan `sessionId`.

---

## 🎨 Spesifikasi Langkah Pengembangan: Frontend

### 1. Konfigurasi Client API
* **File**: `frontend/src/services/api.js` (Edit)
  * **Peran**: Mengaktifkan pengiriman cookie secara otomatis.
  * **Perubahan**: Menambahkan konfigurasi `axios.defaults.withCredentials = true` agar browser menyertakan cookie JWT pada setiap request API. Menambahkan fungsi-fungsi pemanggilan backend untuk auth dan history.

### 2. State Global & Pelindung Rute (Routing Guard)
* **File**: `frontend/src/context/AuthContext.jsx`
  * **Peran**: Menyimpan status login user secara global di aplikasi React.
  * **State**: `user`, `isAuthenticated`, `authLoading`.
  * **Fungsi**: `loginUser()`, `registerUser()`, `logoutUser()`, dan mengecek otomatis status login saat aplikasi pertama kali dibuka.
* **File**: `frontend/src/App.jsx` (Edit)
  * **Peran**: Mengatur rute halaman berdasarkan status login.
  * **Logika**:
    * Jika proses cek login sedang berjalan (`authLoading`), tampilkan loading spinner.
    * Jika belum login (`!isAuthenticated`), arahkan pengguna ke `<AuthPage />`.
    * Jika sudah login, izinkan akses ke `<Homepage />` atau `<SandboxPage />`.

### 3. Tampilan Halaman Autentikasi
* **File**: `frontend/src/pages/Auth/AuthPage.jsx`
  * **Peran**: Halaman form login dan registrasi bernuansa gelap (dark-mode).
  * **Spesifikasi**: Form input divalidasi dan memanggil fungsi `loginUser` / `registerUser` dari context.

### 4. Panel Riwayat Sesi (Sidebar Workspace)
* **File**: `frontend/src/pages/Sandbox/components/HistorySidebar.jsx`
  * **Peran**: Sidebar navigasi kiri untuk memilih dan mengelola sesi chat.
  * **Fitur**:
    * Menampilkan daftar judul sesi belajar sebelumnya.
    * Tombol "+" untuk membuat sesi chat kosong baru.
    * Tombol hapus (icon sampah) untuk menghapus riwayat sesi tertentu.
* **File**: `frontend/src/pages/Sandbox/SandboxPage.jsx` (Edit)
  * **Peran**: Mengatur transisi perpindahan sesi belajar.
  * **Logika**: Memasang komponen `<HistorySidebar />` dan mengatur agar ketika sesi diklik, state chat di halaman sandbox langsung diperbarui sesuai riwayat database.
* **File**: `frontend/src/hooks/useChat.js` (Edit)
  * **Peran**: Sinkronisasi obrolan lokal dengan database.
  * **Logika**: Mengambil riwayat pesan lama dari API saat sesi diubah, dan memicu penyimpanan data otomatis ke Postgres setiap kali user mengirim pesan baru.
