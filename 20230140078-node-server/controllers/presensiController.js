const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const { validationResult } = require('express-validator'); 
const timeZone = "Asia/Jakarta";
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Format nama file: userId-timestamp.jpg
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

// 1. CheckIn (Saya ubah jadi Huruf Besar 'C' agar terbaca di Route)
const CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body;
    const buktiFoto = req.file ? req.file.path : null;

    // Mencari catatan presensi aktif (checkOut: null)
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // Membuat data baru
    const newRecord = await Presensi.create({
      userId: userId,
      nama: userName,
      checkIn: waktuSekarang,
      latitude: latitude || null,
      longitude: longitude || null,
      buktiFoto: buktiFoto
    });

    
    
    const formattedData = {
        userId: newRecord.userId,
        nama: newRecord.nama,
        checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: null
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 2. CheckOut
const CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
        userId: recordToUpdate.userId,
        nama: recordToUpdate.nama,
        checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 3. Delete Presensi
const deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }
    
    if (recordToDelete.userId !== userId) {
        return res
         .status(403)
           .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }
    
    await recordToDelete.destroy();
    
    res.status(204).send(); 
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 4. Update Presensi
const updatePresensi = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Validasi Gagal.",
                errors: errors.array() 
            });
        }
        
        const presensiId = req.params.id;
        const { checkIn, checkOut, nama } = req.body;
        
        if (checkIn === undefined && checkOut === undefined && nama === undefined) {
             return res.status(400).json({
                 message: "Request body tidak berisi data yang valid untuk diupdate.",
             });
        }
        
        const recordToUpdate = await Presensi.findByPk(presensiId);
        
        // Cek jika record tidak ditemukan (Penting!)
        if (!recordToUpdate) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
        recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
        recordToUpdate.nama = nama || recordToUpdate.nama;
        await recordToUpdate.save();

        res.json({
            message: "Data presensi berhasil diperbarui.",
            data: recordToUpdate,
        });

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

module.exports = {
    upload: exports.upload,
    CheckIn,
    CheckOut,
    deletePresensi,
    updatePresensi
};