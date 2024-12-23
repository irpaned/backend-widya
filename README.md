# Node.js + Express + PostgreSQL 

### **Setup Backend:**

1. **Clone Proyek**  
   Klon repository proyek ke komputer Anda.

2. **Install Dependensi**  
   Di dalam folder **backend**, jalankan perintah `npm install` untuk menginstall semua dependensi.

3. **Konfigurasi .env**  
   Salin file `.env.sample` menjadi `.env` dan sesuaikan isinya sesuai dengan konfigurasi yang dibutuhkan, termasuk pengaturan koneksi ke database PostgreSQL.

4. **Jalankan Migrasi Prisma**  
   Untuk menghubungkan Prisma dengan database PostgreSQL dan memastikan struktur database sesuai dengan skema, jalankan:  
   ```bash
   npx prisma migrate dev
   ```

5. **Jalankan Backend**  
   Setelah migrasi selesai, jalankan aplikasi backend menggunakan `npm start` atau `npm run dev` di direktori **backend**.
