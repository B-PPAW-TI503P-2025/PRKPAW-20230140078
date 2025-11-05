// controllers/reportController.js

const { Presensi } = require('../models');
const { Op } = require('sequelize'); // Pastikan ini diimpor
const { format } = require('date-fns-tz');
const timeZone = "Asia/Jakarta";

exports.getDailyReport = async (req, res) => {
    try {
        const { nama, tanggalMulai, tanggalSelesai } = req.query; // Ambil parameter baru
        
        let options = {
            where: {},
            order: [['checkIn', 'DESC']]
        };

        // 1. Logika Filter Berdasarkan Nama (Sudah ada dari praktikum)
        if (nama) {
            options.where.nama = {
                [Op.like]: `%${nama}%`,
            };
        }

        // 2. Logika Filter Berdasarkan Rentang Tanggal (TUGAS BARU)
        if (tanggalMulai && tanggalSelesai) {
            // Kita akan memfilter kolom checkIn yang berada di antara tanggal mulai dan selesai
            // Tambahkan 1 hari ke tanggalSelesai untuk mencakup seluruh hari terakhir
            const endDate = new Date(tanggalSelesai);
            endDate.setDate(endDate.getDate() + 1); 

            options.where.checkIn = {
                [Op.between]: [
                    new Date(tanggalMulai),
                    endDate 
                ]
            };
        }
        
        // Jika tidak ada filter yang diberikan, default-nya akan mengambil semua (atau Anda bisa set default ke hari ini)

        const records = await Presensi.findAll(options);

        // ... (Logika format data) ...
        const formattedReport = records.map(record => ({
            // ... (format data seperti yang sudah Anda buat) ...
            userId: record.userId,
            nama: record.nama,
            checkIn: format(record.checkIn, "yyyy-MM-dd HH:mm:ss", { timeZone }),
            checkOut: record.checkOut ? format(record.checkOut, "yyyy-MM-dd HH:mm:ss", { timeZone }) : 'N/A'
        }));

        res.status(200).json({
            message: "Laporan presensi berhasil diambil.",
            count: formattedReport.length,
            data: formattedReport
        });

    } catch (error) {
        // ... (Error handling) ...
        res.status(500).json({ message: "Gagal mengambil laporan", error: error.message });
    }
};