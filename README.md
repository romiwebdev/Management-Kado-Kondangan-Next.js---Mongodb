# Website Manajemen Kado Kondangan - Next.js + MongoDB Atlas

*Aplikasi untuk mencatat dan mengelola kado kondangan*

## Daftar Isi
- [Deskripsi](#deskripsi)
- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Struktur Database](#struktur-database)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Routes](#routes)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## Deskripsi
Aplikasi berbasis Next.js untuk mencatat kado yang diberikan atau diterima oleh pengguna dalam acara kondangan. Pengguna dapat:
- Mengelola daftar kontak
- Mencatat kado yang diberikan/diterima
- Melihat statistik kado

## Fitur
### 1. Manajemen Pengguna
- Registrasi & Login manual
- Kolom pengguna: id, name, email, password_hash

### 2. Manajemen Kontak
- Tambah, edit, hapus kontak
- Cari kontak berdasarkan nama
- Filter kontak berdasarkan alamat dan hubungan
- Kolom kontak: id, user_id, name, address, relationship

### 3. Manajemen Kado
- Tambah kado untuk kontak
- Jika kontak belum ada, bisa tambah kontak sekaligus
- Edit dan hapus kado
- Tandai status selesai
- Kolom kado: id, user_id, contact_id, type, description, date

### 4. Statistik Dashboard
- Total kontak
- Total kado
- Kontak yang sudah selesai

### 5. Export Data
- Export data ke Excel/PDF

### 6. Responsif
- Tampilan optimal untuk mobile dan desktop

## Teknologi
- Next.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- TailwindCSS

## Struktur Database
```javascript
// Collection: users
{
  id: String,
  name: String,
  email: String,
  password_hash: String,
  created_at: Date
}

// Collection: contacts
{
  id: String,
  user_id: String,
  name: String,
  address: String,
  relationship: String,
  created_at: Date
}

// Collection: kado
{
  id: String,
  user_id: String,
  contact_id: String,
  type: String, // 'memberi_kado' atau 'menerima_kado'
  description: String,
  date: Date,
  created_at: Date
}

// Collection: selesai_status
{
  contact_id: String,
  user_id: String,
  is_selesai: Boolean
}
```

## Instalasi
1. Clone repository:
   ```bash
   git clone https://github.com/username/reponame.git
   cd reponame
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Buat file `.env` di root project dan isi dengan konfigurasi MongoDB Atlas:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

5. Buka di browser:
   ```
   http://localhost:3000
   ```

## Konfigurasi
- Workspace: New
- Template: NextJS
- Language: JavaScript
- Konfigurasi:
  - src/ directory: No
  - ESLint: No
  - App Router: No
  - TailwindCSS: Yes

## Routes
Berikut adalah daftar route yang tersedia dalam aplikasi:

| Route | Deskripsi | Akses |
|-------|-----------|-------|
| `/` | Landing page | Publik |
| `/register` | Form registrasi pengguna baru | Publik |
| `/login` | Form login pengguna | Publik |
| `/admin/login` | Form login admin | Publik |
| `/dashboard` | Dashboard utama untuk mengelola kado dan kontak | Pengguna terautentikasi |
| `/admin/dashboard` | Dashboard admin untuk mengelola user | Hanya admin |

## Kontribusi
1. Fork project
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Tambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Lisensi
MIT License

