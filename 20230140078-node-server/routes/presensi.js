const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/permissionMiddleware');

const { body, validationResult } = require('express-validator');
router.use(authenticateToken);
const updateValidationChain = [
    body('checkIn').optional().isISO8601().withMessage('Format checkIn harus berupa tanggal/waktu ISO 8601 yang valid.'),
    body('checkOut').optional().isISO8601().withMessage('Format checkOut harus berupa tanggal/waktu ISO 8601 yang valid.'),
];

console.log('STATUS AUTH:', typeof authenticateToken);
console.log('STATUS CONTROLLER:', typeof presensiController.CheckIn);

router.post('/check-in', [authenticateToken, presensiController.upload.single('image')], presensiController.CheckIn);

router.post('/check-out', presensiController.CheckOut);
router.put('/:id', 
    updateValidationChain, 
    presensiController.updatePresensi
);

module.exports = router;