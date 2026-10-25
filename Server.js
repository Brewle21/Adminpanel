const express = require('express'); //
const app = express(); //
const PORT = process.env.PORT || 3000; //

// Middleware agar server bisa membaca input JSON dan form HTML
app.use(express.json()); //
app.use(express.urlencoded({ extended: true })); //

// DATABASE SIMPEL (Disimpan di RAM. Jika server restart, data kembali ke default)
let adminConfig = {
    isMaintenance: false,
    Nama: "Delta Admin Premium",
    Perintah: [
        {
            Id: "speed",
            Label: "Set WalkSpeed",
            Description: "Mengubah kecepatan lari karakter (16 - 200)",
            Nama: "speed",
            Group: "Utility",
            Danger: false,
            ArgOrder: ["Speed"],
            Fields: [
                { Key: "Speed", Label: "Speed", Type: "number", Placeholder: "Default: 16", Optional: false }
            ]
        },
        {
            Id: "fly",
            Label: "Fly Hack (Sapu)",
            Description: "Mengaktifkan sapu terbang lokal untuk berpindah tempat",
            Nama: "fly",
            Group: "Utility",
            Danger: false,
            ArgOrder: [],
            Fields: []
        },
        {
            Id: "kick",
            Label: "Kick Player",
            Description: "Mendepak pemain keluar dari server game",
            Nama: "kick",
            Group: "Moderation",
            Danger: true,
            ArgOrder: ["Player", "Reason"],
            Fields: [
                { Key: "Player", Label: "Pilih Player Target", Type: "player", Optional: false },
                { Key: "Reason", Label: "Alasan Kick", Type: "textarea", Placeholder: "Tulis alasan...", Optional: false }
            ]
        }
    ]
};

// =========================================================================
// 1. UI BROWSING (Akses lewat Google Chrome / Browser HP Anda)
// =========================================================================
app.get('/admin', (req, res) => { //
    res.send(`
        <html>
        <head>
            <title>Web Admin Panel</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1e1e24; color: #fff; padding: 30px; }
                .container { max-width: 500px; background: #2a2a35; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); margin: auto; }
                h2 { margin-top: 0; color: #00bcd4; border-bottom: 2px solid #3e3e50; padding-bottom: 10px; }
                label { font-weight: bold; display: block; margin-top: 15px; margin-bottom: 5px; color: #ccc; }
                input[type="text"] { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #4e4e65; background: #1e1e24; color: #fff; box-sizing: border-box; }
                .switch-container { display: flex; align-items: center; margin-top: 15px; background: #343444; padding: 10px; border-radius: 6px; }
                .switch-container input { margin-right: 10px; transform: scale(1.3); }
                button { width: 100%; background: #00bcd4; color: #fff; border: none; padding: 12px; font-size: 16px; font-weight: bold; border-radius: 6px; cursor: pointer; margin-top: 25px; transition: 0.2s; }
                button:hover { background: #0097a7; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Control Panel</h2>
                <form action="/admin/update" method="POST">
                    <label>Nama Admin Panel (UI Roblox):</label>
                    <input type="text" name="namaPanel" value="${adminConfig.Nama}" placeholder="Masukkan nama...">
                    
                    <div class="switch-container">
                        <input type="checkbox" name="maintenance" id="maint" ${adminConfig.isMaintenance ? 'checked' : ''}>
                        <label for="maint" style="margin:0; cursor:pointer;">Aktifkan Mode Maintenance</label>
                    </div>
                    
                    <button type="submit">Simpan Perubahan</button>
                </form>
            </div>
            <div class="footer">Connected to Delta Executor Integration API</div>
        </body>
        </html>
    `);
});

// Memproses data yang dikirim dari form browser di atas
app.post('/admin/update', (req, res) => { //
    adminConfig.Nama = req.body.namaPanel || adminConfig.Nama;
    adminConfig.isMaintenance = req.body.maintenance === 'on';
    res.send("<script>alert('Konfigurasi berhasil diperbarui!'); window.location='/admin';</script>"); //
});

// =========================================================================
// 2. ENDPOINT API (Diakses oleh Script Lua di Delta Executor)
// =========================================================================

// Kirim config dan data tabel perintah ke Roblox
app.get('/api/config', (req, res) => { //
    res.json(adminConfig); //
});

// Menerima data log eksekusi dari game ketika user menekan tombol "Run"
app.post('/api/execute', (req, res) => { //
    const { perintah, args, executor } = req.body;
    
    console.log(`\n[LOG EKSEKUSI] ------------------------`);
    console.log(`User/Executor : ${executor}`);
    console.log(`Nama Cheat    : ${perintah}`);
    console.log(`Parameter/Args: ${JSON.stringify(args)}`);
    console.log(`Waktu Sistem  : ${new Date().toISOString()}`);
    console.log(`---------------------------------------`);
    
    res.json({ success: true, message: "Log berhasil dicatat di server backend." }); //
});

// Menjalankan server
app.listen(PORT, () => console.log(`[API Ready] Server berjalan di http://localhost:${PORT}`)); //
