const express = require('express')
const { createPerjalanan, getAllTransportasi, getAllPerjalanan, getAnggaran, updatePerjalanan } = require('./e-sipdController')

const jwt = require('jsonwebtoken')
const error = require("../helper/error");
const { client } = require("../services/database");

require('dotenv').config()

const esipdRouter = express.Router()

// Create Perjalanan
esipdRouter.post('/', createPerjalanan)

// Get All Perjalanan
esipdRouter.get('/', getAllPerjalanan)

// Update Perjalanan
esipdRouter.put('/:perjalanan_id', updatePerjalanan)

// Transportasi
esipdRouter.get('/transportasi', getAllTransportasi)

// Anggaran
esipdRouter.get('/anggaran', getAnggaran)

module.exports = esipdRouter