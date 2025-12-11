// controllers/reportController.js

const { Presensi, User } = require('../models'); // Tambahkan User jika perlu include
const { Op } = require('sequelize');
const { format } = require('date-fns-tz');
const timeZone = "Asia/Jakarta";

exports.getDailyReport = async (req, res) => {
    try {
        const { nama, tanggalMulai, tanggalSelesai } = req.query;
        
        let options = {
            include: [{ model: User, as: 'user', attributes: ['nama'] }], // Include User agar data user lengkap
            where: {},
            order: [['checkIn', 'DESC']]
        };

        // 1. Filter Nama
        if (nama) {
            options.where.nama = { [Op.like]: `%${nama}%` };
        }

        // 2. Filter Tanggal
        if (tanggalMulai && tanggalSelesai) {
            const endDate = new Date(tanggalSelesai);
            endDate.setDate(endDate.getDate() + 1); 
            options.where.checkIn = {
                [Op.between]: [new Date(tanggalMulai), endDate]
            };
        }

        const records = await Presensi.findAll(options);

        // --- BAGIAN INI YANG DIPERBAIKI ---
        const formattedReport = records.map(record => ({
            id: record.id,
            userId: record.userId,
            nama: record.nama,
            // TAMBAHAN WAJIB AGAR FOTO MUNCUL:
            buktiFoto: record.buktiFoto, 
            latitude: record.latitude,
            longitude: record.longitude,
            // Format Tanggal
            checkIn: record.checkIn, // Kirim raw date agar bisa diolah frontend, atau format string
            checkOut: record.checkOut
        }));
        // ----------------------------------

        res.status(200).json({
            message: "Laporan presensi berhasil diambil.",
            count: formattedReport.length,
            data: formattedReport
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil laporan", error: error.message });
    }
};