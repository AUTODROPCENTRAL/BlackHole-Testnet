# BlackHole Testnet Automation Bot

> Bot otomatis untuk berinteraksi dengan protokol **BlackHole** di jaringan **Fuji Testnet (Avalanche)**.  
> Dibuat oleh **AUTODROPCENTRAL**.

---

## 🚀 Deskripsi

Bot ini dirancang untuk mengotomatiskan berbagai aktivitas di protokol BlackHole selama fase testnet, termasuk:

- Swap Token
- Menambah Likuiditas
- Klaim Biaya
- Operasi veBLACK (Lock, Merge, Incentive)

Bot ini ideal untuk para peserta testnet yang ingin memaksimalkan partisipasi mereka tanpa interaksi manual.

---

## ✨ Fitur

- 🤖 **Otomatisasi Penuh**  
  Menjalankan tugas secara terus-menerus dengan jeda waktu acak untuk mensimulasikan aktivitas manusia.

- 🔄 **Multi-Operasi**  
  Swap, Add Liquidity, Klaim Fee, Lock veBLACK, Merge veBLACK, dan jalankan Incentive.

- ⚖️ **Operasi Berbobot**  
  Setiap fitur memiliki bobot sehingga dapat diatur seberapa sering dieksekusi.

- ⚙️ **Konfigurasi Mudah**  
  Anda hanya perlu file `privatekey.txt` untuk menjalankan bot.

- 📊 **Logging Informatif**  
  Output berwarna dan terstruktur dengan baik di terminal.

- 🏗️ **Struktur Modular**  
  Kode bersih dan terstruktur agar mudah dikembangkan lebih lanjut.

---

## 📋 Prasyarat

Pastikan sistem Anda telah menginstal:

- Node.js (v16 ke atas direkomendasikan)
- npm (biasanya terinstal bersama Node.js)

---

## 🚀 Memulai

### 1. Kloning Repositori

```bash
git clone https://github.com/AUTODROPCENTRAL/BlackHole-Testnet.git
cd BlackHole-Testnet
````

### 2. Instal Dependensi

```bash
npm install
```

### 3. Tambahkan Wallet Anda

Buat file `privatekey.txt` di root folder proyek dan isi dengan private key wallet Anda.

**Contoh isi:**

```
0x12345...
```

⚠️ *Gunakan hanya wallet testnet! Anda bisa mendapatkan AVAX testnet dari [Fuji Faucet](https://faucet.avax.network).*

---

## 🛠️ Menjalankan Bot

Setelah konfigurasi selesai, jalankan dengan:

```bash
npm start
```

Untuk menghentikan bot: `CTRL + C`

---

## 📁 Struktur Proyek

```
autodrop-bot/
├── config/
│   ├── abi.js                # ABI kontrak pintar
│   └── constants.js          # Alamat kontrak & konstanta
├── utils/
│   └── helpers.js            # Fungsi utilitas
├── services/
│   ├── web3Service.js        # Setup Web3 & akun
│   ├── transactionService.js # Transaksi & approval
│   ├── swapService.js        # Logika swap token
│   ├── liquidityService.js   # Tambah likuiditas & klaim
│   └── veBlackService.js     # Lock, Merge, Incentive veBLACK
├── index.js                  # Titik masuk utama
├── package.json              # Informasi dan dependensi proyek
└── privatekey.txt            # Private key wallet (jangan diupload!)
```

---

## ⚠️ Penafian

> **JANGAN** gunakan private key wallet utama (mainnet).
> Gunakan wallet testnet terpisah.
>
> AUTODROPCENTRAL tidak bertanggung jawab atas kehilangan dana atau kesalahan penggunaan. Gunakan sepenuhnya atas risiko Anda sendiri.

---

## ❤️ Dibuat oleh [AUTODROPCENTRAL](https://github.com/AUTODROPCENTRAL/BlackHole-Testnet)


