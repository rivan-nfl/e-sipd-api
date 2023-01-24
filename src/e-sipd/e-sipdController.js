const jwt = require('jsonwebtoken')
const error = require("../helper/error");
const { client } = require("../services/database");

const createPerjalanan = async (req, res) => {
    try {
        const token = jwt.verify(String(req.headers.authorization).slice(7), process.env.TOKEN_PRIVATE_KEY)

        const { keterangan, nomor_sprint, nomor_sppd, jenis_perjalanan, daerah_tujuan, kota_asal, kota_tujuan, tgl_berangkat, tgl_kembali, transportasi, penerima } = req.body

        // Validation
        if(
            !keterangan ||
            !nomor_sprint ||
            !nomor_sppd ||
            !jenis_perjalanan ||
            !daerah_tujuan ||
            !kota_asal ||
            !kota_tujuan ||
            !tgl_berangkat ||
            !tgl_kembali ||
            !transportasi ||
            !penerima
        ) throw error(`All Fields is required !`, 400)

        // Check if Perjalanan exist
        const checkPerjalananInDB = await client.query(`SELECT nomor_sprint, nomor_sppd FROM esipd WHERE nomor_sprint='${nomor_sprint}' AND nomor_sppd='${nomor_sppd}'`)
        if(checkPerjalananInDB.rows.length) throw error('Perjalanan is Ongoing', 400)

        // Check if Pengirim is valid user
        const pengirimInDB = await client.query(`SELECT id, nama FROM users WHERE id='${token.id}' AND role='admin'`)
        if(!pengirimInDB.rows.length) throw error('Pengirim is not a Valid User', 400)

        // Check if Penerima Exist
        const penerimaInDB = await client.query(`SELECT id, nama FROM users WHERE id='${penerima}'`)
        if(!penerimaInDB.rows.length) throw error('Penerima Not Found', 404)

        // Dates
        const tglBerangkat = new Date(tgl_berangkat).toISOString()
        const tglKembali = new Date(tgl_kembali).toISOString()
        const createdDate = new Date().toISOString()
        
        // Create Perjalanan
        const newPerjalanan = await client.query(`
            INSERT INTO esipd (
                keterangan,
                nomor_sprint,
                nomor_sppd,
                jenis_perjalanan,
                daerah_tujuan,
                kota_asal,
                kota_tujuan,
                tgl_berangkat,
                tgl_kembali,
                transportasi,
                pengirim,
                penerima,
                penerima_id,
                status,
                created_at,
                updated_at
            ) 
            VALUES (
                '${keterangan}',
                '${nomor_sprint}', 
                '${nomor_sppd}', 
                '${jenis_perjalanan}',
                '${daerah_tujuan}',
                '${kota_asal}',
                '${kota_tujuan}',
                '${tglBerangkat}',
                '${tglKembali}',
                '${transportasi}',
                ${token.id},
                '${penerimaInDB.rows[0].nama}',
                ${penerimaInDB.rows[0].id},
                'pending',
                '${createdDate}',
                '${createdDate}'
            )
            RETURNING
                id,
                keterangan,
                nomor_sprint,
                nomor_sppd,
                jenis_perjalanan,
                daerah_tujuan,
                kota_asal,
                kota_tujuan,
                tgl_berangkat,
                tgl_kembali,
                transportasi,
                pengirim,
                penerima,
                status
        `)

        await client.query(`
            INSERT INTO notifikasi (
                user_id,
                user_role,
                id_perjalanan,
                title,
                deskripsi,
                detail,
                status,
                perjalanan_status,
                created_at,
                updated_at
            ) 
            VALUES (
                0,
                'dipa',
                ${newPerjalanan.rows[0].id},
                'Pengajuan Baru ${newPerjalanan.rows[0].nomor_sprint}',
                'Pengajuan Baru Untuk Disetujui',
                'Pengajuan Baru Bernomor Sprint ${newPerjalanan.rows[0].nomor_sprint} telah melakukan pengajuan baru.',
                'close',
                'pending',
                '${createdDate}',
                '${createdDate}'
            )
        `)

        res.status(201).json({
            success: true,
            data: newPerjalanan.rows[0]
        })
        
    } catch (error) {
        console.log('Error Create E-Sipd = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

const approvePerjalanan = async (req, res) => {
    try {
        const token = jwt.verify(String(req.headers.authorization).slice(7), process.env.TOKEN_PRIVATE_KEY)
        const { status, keterangan } = req.body

        // Validation
        if(
            !status ||
            (status == 'rejected' && !keterangan)
        ) throw error(`All Fields is required !`, 400)

        // Check if Perjalanan exist
        const checkPerjalananInDB = await client.query(`SELECT * FROM esipd WHERE id=${req.params.perjalanan_id}`)
        if(!checkPerjalananInDB.rows.length) throw error('Perjalanan Not Found', 404)
        if(checkPerjalananInDB.rows[0].status == status) throw error(`Perjalanan is ${status}`, 404)

        // Check if Approver is valid user
        // const approverAdminInDB = await client.query(`SELECT id, nama FROM users WHERE id='${token.id}' AND role='admin'`)
        const approverDipaInDB = await client.query(`SELECT id, nama FROM users WHERE id='${token.id}' AND role='dipa'`)
        // if(!approverAdminInDB.rows.length && !approverDipaInDB.rows.length) throw error('Approver is not Permitted to Approve', 400)
        if(!approverDipaInDB.rows.length) throw error('Approver is not Permitted to Approve', 400)

        // Check if Penerima Exist
        const penerimaInDB = await client.query(`SELECT id, nama, role FROM users WHERE nama='${checkPerjalananInDB.rows[0].penerima}'`)
        if(!penerimaInDB.rows.length) throw error('Penerima Not Found', 404)

        const createdDate = new Date().toISOString()

        // Update
        const newPerjalanan = await client.query(`
            UPDATE esipd
            SET status = '${status || checkPerjalananInDB.rows[0].status}',
                updated_at = '${createdDate}'
            WHERE id = ${req.params.perjalanan_id}
            RETURNING *;
        `)

        await client.query(`
            INSERT INTO notifikasi (
                user_id,
                user_role,
                id_perjalanan,
                title,
                deskripsi,
                detail,
                status,
                perjalanan_status,
                created_at,
                updated_at
            ) 
            VALUES (
                ${penerimaInDB.rows[0].id},
                '${penerimaInDB.rows[0].role}',
                ${checkPerjalananInDB.rows[0].id},
                'Pengajuan ${checkPerjalananInDB.rows[0].nomor_sprint}',
                'Pengajuanmu telah di ${newPerjalanan.rows[0].status == 'approved' ? 'Setujui' : 'Tolak'}',
                '${status == 'rejected' ? keterangan : 'Pengajuanmu telah Disetujui'}',
                'close',
                '${newPerjalanan.rows[0].status}',
                '${createdDate}',
                '${createdDate}'
            )
        `)

        res.status(201).json({
            success: true,
            data: newPerjalanan.rows[0]
        })
        
    } catch (error) {
        console.log('Error Approve Perjalanan = ', error);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

const updatePerjalanan = async (req, res) => {
    try {
        const token = jwt.verify(String(req.headers.authorization).slice(7), process.env.TOKEN_PRIVATE_KEY)
        const { transportasi } = req.body

        // Validation
        if( !transportasi ) throw error(`All Fields is required !`, 400)

        // Check if Perjalanan exist
        const checkPerjalananInDB = await client.query(`SELECT * FROM esipd WHERE id=${req.params.perjalanan_id}`)
        if(!checkPerjalananInDB.rows.length) throw error('Perjalanan Not Found', 404)

        // Check if Approver is valid user
        const approverAdminInDB = await client.query(`SELECT id, nama FROM users WHERE id='${token.id}' AND role='admin'`)
        if(!approverAdminInDB.rows.length) throw error('Admin Not Found', 404)

        // Check if Penerima Exist
        const penerimaInDB = await client.query(`SELECT id, nama, role FROM users WHERE nama='${checkPerjalananInDB.rows[0].penerima}'`)
        if(!penerimaInDB.rows.length) throw error('Penerima Not Found', 404)

        const createdDate = new Date().toISOString()

        // Update
        const newPerjalanan = await client.query(`
            UPDATE esipd
            SET status = 'pending',
                updated_at = '${createdDate}',
                transportasi = '${transportasi}'
            WHERE id = ${req.params.perjalanan_id}
            RETURNING *;
        `)

        await client.query(`
            INSERT INTO notifikasi (
                user_id,
                user_role,
                id_perjalanan,
                title,
                deskripsi,
                detail,
                status,
                perjalanan_status,
                created_at,
                updated_at
            ) 
            VALUES (
                0,
                'dipa',
                ${checkPerjalananInDB.rows[0].id},
                'Pengajuan ${checkPerjalananInDB.rows[0].nomor_sprint}',
                'Revisi Pengajuan Perjalanan Untuk Disetujui',
                'Pengajuan Baru Bernomor Sprint ${newPerjalanan.rows[0].nomor_sprint} telah melakukan Revisi Pengajuan Perjalanan.',
                'close',
                '${newPerjalanan.rows[0].status}',
                '${createdDate}',
                '${createdDate}'
            )
        `)

        res.status(201).json({
            success: true,
            data: newPerjalanan.rows[0]
        })
        
    } catch (error) {
        console.log('Error Update Perjalanan = ', error);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

const getAllPerjalanan = async (req, res) => {
    try {

        let allPerjalanan = new Array()

        if(req.query.perjalanan_id) {
            allPerjalanan = await client.query(`SELECT * FROM esipd WHERE id=${req.query.perjalanan_id}`)
        } else {
            allPerjalanan = await client.query(`SELECT * FROM esipd ORDER BY id DESC`)
        }

        res.status(201).json({
            success: true,
            data: allPerjalanan.rows
        })
        
    } catch (error) {
        console.log('Error Get Perjalanan = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

const getAllTransportasi = async(req, res) => {
    try {
        let allTransportasi = []
        
        if(req.query.lokasi_asal && req.query.lokasi_tujuan && req.query.transportasi) {
            allTransportasi = await client.query(`SELECT * FROM transportasi WHERE lokasi_awal='${req.query.lokasi_asal}' AND lokasi_tujuan='${req.query.lokasi_tujuan}' AND nama='${req.query.transportasi}'`)
        } else if(req.query.lokasi_asal && req.query.lokasi_tujuan) {
            allTransportasi = await client.query(`SELECT * FROM transportasi WHERE lokasi_awal='${req.query.lokasi_asal}' AND lokasi_tujuan='${req.query.lokasi_tujuan}'`)
        } else if(req.query.type) {
            allTransportasi = await client.query(`SELECT * FROM transportasi WHERE type='${req.query.type}'`)
        } else {
            allTransportasi = await client.query(`SELECT * FROM transportasi`)
        }

        res.status(201).json({
            success: true,
            data: allTransportasi.rows
        })
        
    } catch (error) {
        console.log('Error Get Transportasi = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

const getAnggaran = async (req, res) => {
    try {
        let allAnggaran = new Array()
        if(req.query.tingkat) {
            allAnggaran = await client.query(`SELECT * FROM anggaran_harian WHERE tingkat='${req.query.tingkat}'`)
        } else {
            allAnggaran = await client.query(`SELECT * FROM anggaran_harian`)
        }

        res.status(201).json({
            success: true,
            data: allAnggaran.rows
        })
        
    } catch (error) {
        console.log('Error Get Anggaran = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

const getPangkat = async (req, res) => {
    try {
        let allPangkat = new Array()
        if(req.query.pangkat) {
            allPangkat = await client.query(`SELECT * FROM pangkat WHERE sub_pangkat='${req.query.pangkat}'`)
        } else {
            allPangkat = await client.query(`SELECT * FROM pangkat`)
        }

        res.status(201).json({
            success: true,
            data: allPangkat.rows
        })
        
    } catch (error) {
        console.log('Error Get Pangkat = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createPerjalanan,
    approvePerjalanan,
    updatePerjalanan,
    getAllPerjalanan,
    getAllTransportasi,
    getAnggaran,
    getPangkat
}