const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');

const { body, validationResult } = require('express-validator');

const updateValidationChain = [
    body('checkIn').optional().isISO8601().withMessage('Format checkIn harus berupa tanggal/waktu ISO 8601 yang valid.'),

    body('checkOut').optional().isISO8601().withMessage('Format checkOut harus berupa tanggal/waktu ISO 8601 yang valid.'),
];


router.put('/:id', 
    updateValidationChain, 
    presensiController.updatePresensi
);

module.exports = router;