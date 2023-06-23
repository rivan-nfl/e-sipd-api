const express = require('express')
const { createPerjalanan, getAllTransportasi, getAllPerjalanan, getAnggaran, approvePerjalanan, updatePerjalanan, getPangkat, selesaiPerjalanan, getAllLaporan } = require('./e-sipdController')

require('dotenv').config()

const esipdRouter = express.Router()

// Create Perjalanan
esipdRouter.post('/', createPerjalanan)

// Get All Perjalanan
esipdRouter.get('/', getAllPerjalanan)

// Get All Laporan
esipdRouter.get('/laporan', getAllLaporan)

// Approve Perjalanan
esipdRouter.put('/:perjalanan_id', approvePerjalanan)

// Update Perjalanan
esipdRouter.put('/update/:perjalanan_id', updatePerjalanan)

// Selesai Perjalanan
esipdRouter.post('/:perjalanan_id', selesaiPerjalanan)

// Transportasi
esipdRouter.get('/transportasi', getAllTransportasi)

// Anggaran
esipdRouter.get('/anggaran', getAnggaran)

// Get Pangkat
esipdRouter.get('/pangkat', getPangkat)

module.exports = esipdRouter