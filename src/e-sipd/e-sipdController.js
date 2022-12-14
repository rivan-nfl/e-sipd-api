const jwt = require('jsonwebtoken')
const error = require("../helper/error");
const { client } = require("../services/database");

const createPerjalanan = async (req, res) => {
    try {
        const token = jwt.verify(String(req.headers.authorization).slice(7), process.env.TOKEN_PRIVATE_KEY)

        const { keterangan, nomor_sprint, nomor_sppd, jenis_perjalanan, daerah_tujuan, tgl_berangkat, tgl_kembali, penerima } = req.body

        // Validation
        if(
            !keterangan ||
            !nomor_sprint ||
            !nomor_sppd ||
            !jenis_perjalanan ||
            !daerah_tujuan || 
            !tgl_berangkat ||
            !tgl_kembali ||
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
                tgl_berangkat,
                tgl_kembali,
                pengirim,
                penerima,
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
                '${tglBerangkat}',
                '${tglKembali}',
                ${token.id},
                '${penerimaInDB.rows[0].nama}',
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
                tgl_berangkat,
                tgl_kembali,
                pengirim,
                penerima,
                status
        `)
        console.log(newPerjalanan.rows[0].id);
        await client.query(`
            INSERT INTO notifikasi (
                user_id,
                user_role,
                id_perjalanan,
                title,
                deskripsi,
                detail,
                status,
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

const updatePerjalanan = async (req, res) => {
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
        const approverAdminInDB = await client.query(`SELECT id, nama FROM users WHERE id='${token.id}' AND role='admin'`)
        const approverDipaInDB = await client.query(`SELECT id, nama FROM users WHERE id='${token.id}' AND role='dipa'`)
        if(!approverAdminInDB.rows.length && !approverDipaInDB.rows.length) throw error('Approver is not Permitted to Approve', 400)

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
                created_at,
                updated_at
            ) 
            VALUES (
                ${penerimaInDB.rows[0].id},
                '${penerimaInDB.rows[0].role}',
                ${checkPerjalananInDB.rows[0].id},
                'Pengajuan ${checkPerjalananInDB.rows[0].nomor_sprint}',
                'Pengajuanmu telah di ${newPerjalanan.rows[0].status == 'approved' ? 'Setujui' : 'Tolak'}',
                '${keterangan}',
                'close',
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

const getAllPerjalanan = async (_, res) => {
    try {

        const allPerjalanan = await client.query(`SELECT * FROM esipd ORDER BY id DESC`)

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
        const allAnggaran = await client.query(`SELECT * FROM anggaran_harian`)

        res.status(201).json({
            success: true,
            data: allAnggaran.rows
        })
        
    } catch (error) {
        console.log('Error Get Transportasi = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createPerjalanan,
    updatePerjalanan,
    getAllPerjalanan,
    getAllTransportasi,
    getAnggaran
}