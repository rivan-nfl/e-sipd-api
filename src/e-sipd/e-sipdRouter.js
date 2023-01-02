const express = require('express')
const { createPerjalanan, getAllTransportasi, getAllPerjalanan, getAnggaran, approvePerjalanan, updatePerjalanan } = require('./e-sipdController')

const jwt = require('jsonwebtoken')
const error = require("../helper/error");
const { client } = require("../services/database");

require('dotenv').config()

const esipdRouter = express.Router()

// Create Perjalanan
esipdRouter.post('/', createPerjalanan)

// Get All Perjalanan
esipdRouter.get('/', getAllPerjalanan)

// Approve Perjalanan
esipdRouter.put('/:perjalanan_id', approvePerjalanan)

// Update Perjalanan
esipdRouter.put('/update/:perjalanan_id', updatePerjalanan)

// Transportasi
esipdRouter.get('/transportasi', getAllTransportasi)

// Anggaran
esipdRouter.get('/anggaran', getAnggaran)

module.exports = esipdRouter