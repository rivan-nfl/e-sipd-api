const jwt = require('jsonwebtoken')
const error = require("../helper/error");
const { client } = require("../services/database");

const createPerjalanan = async (req, res) => {
    try {
        const token = jwt.verify(String(req.headers.authorization).slice(7), "$!1HoW6Dr1")

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
        // const penerimaInDB = await client.query(`SELECT id, nama FROM users WHERE id='${penerima}'`)
        const penerimaInDB = await client.query(`SELECT * FROM users WHERE id='${penerima}'`)
        if(!penerimaInDB.rows.length) throw error('Penerima Not Found', 404)

        const pangkat = await client.query(`SELECT * FROM pangkat WHERE sub_pangkat='${penerimaInDB.rows[0].pangkat}'`)
        const anggaranInDB = await client.query(`SELECT * FROM anggaran_harian WHERE golongan='${pangkat.rows[0].golongan}'`)
        const transportasiInDB = await client.query(`SELECT * FROM transportasi WHERE lokasi_awal='${kota_asal}' AND lokasi_tujuan='${kota_tujuan}' AND nama='${transportasi}'`)

        // Dates
        const tglBerangkat = new Date(tgl_berangkat)
        const tglKembali = new Date(tgl_kembali)
        const createdDate = new Date()

        // Calculate the difference in milliseconds
        const differenceInMs = tglKembali - tglBerangkat;

        // Convert milliseconds to days
        const daysDifference = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

        const anggaran = {
            biayaHarian: 1 * daysDifference * Number(jenis_perjalanan === 'luar_kota' ? anggaranInDB.rows[0].anggaran_luar_kota : anggaranInDB.rows[0].anggaran_dalam_kota), // jumlah orang x jumlah hari x uang harian
            biayaPenginapan: 1 * daysDifference * Number(anggaranInDB.rows[0].uang_penginapan), // jumlah orang per pangkat x jumlah hari x uang penginapan
            biayaBBMDanPelumas : null,
            biayaTransport: null,
            uangRepresentasi: 1 * daysDifference * Number(jenis_perjalanan === 'luar_kota' ? anggaranInDB.rows[0].uang_representasi_luar_kota : anggaranInDB.rows[0].uang_representasi_dalam_kota), // jumlah orang per tingkat x jumlah hari x uang representasi
            biayaHarianInfo: `1 (jumlah orang) x ${daysDifference} (jumlah hari) x ${jenis_perjalanan === 'luar_kota' ? anggaranInDB.rows[0].anggaran_luar_kota : anggaranInDB.rows[0].anggaran_dalam_kota} uang harian`,
            biayaPenginapanInfo: `1 (jumlah orang) x ${daysDifference} (jumlah hari) x ${anggaranInDB.rows[0].uang_penginapan} (uang penginapan)`,
            uangRepresentasiInfo: `1 (jumlah orang) x ${daysDifference} (jumlah hari) x ${jenis_perjalanan === 'luar_kota' ? anggaranInDB.rows[0].uang_representasi_luar_kota : anggaranInDB.rows[0].uang_representasi_dalam_kota} (uang representasi)`,
            total: 0
        }

        if(transportasi.toLowerCase() === 'mobil') {
            anggaran.biayaBBMDanPelumas = {
                BBM: {
                    PP: ((Number(transportasiInDB.rows[0].jarak) * 2) * 15000) / 4, // (Jarak KM x 2 (PP) x Harga Bensin pertamax per liter) / 4
                    jathar: daysDifference * 7 * 15000 // jumlah hari x 7 x Harga Bensin pertamax per liter
                },
                pelumas: {
                    PP : (0.04 * (Number(transportasiInDB.rows[0].jarak) * 2) * 60000) / 4, // (4% x Jarak KM x 2 (PP) x Harga Pelumas fix 60.000) / 4
                    jathar : 0.04 * daysDifference * 7.5 * 60000 // 4% x jumlah hari x 7.5 x Harga Pelumas fix 60.000
                }
            }
            anggaran.biayaBBMDanPelumasInfo = `PP : (${transportasiInDB.rows[0].jarak} (Jarak KM) x 2 (PP) x 15,000 (Harga Bensin pertamax per liter)) / 4\nJatah Harian : ${daysDifference} (jumlah hari) x 7 x 15,000 (Harga Bensin pertamax per liter)`
        } else {
            anggaran.biayaTransport = daysDifference * 2 * Number(transportasiInDB.rows[0].biaya) // jumlah hari x 2 (PP) x Harga tiket terbaru (sesuai kenyataan manual)
            anggaran.biayaTransportInfo = `${daysDifference} (jumlah hari) x 2 (PP) x ${transportasiInDB.rows[0].biaya} (Harga tiket terbaru)`
        }
        
        anggaran.total += anggaran.biayaHarian + anggaran.biayaPenginapan + anggaran.uangRepresentasi + (anggaran.biayaTransport || 0) + (!anggaran.biayaBBMDanPelumas ? 0 : anggaran.biayaBBMDanPelumas.BBM.PP + anggaran.biayaBBMDanPelumas.BBM.jathar + anggaran.biayaBBMDanPelumas.pelumas.PP + anggaran.biayaBBMDanPelumas.pelumas.jathar)

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
                anggaran,
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
                '${tglBerangkat.toISOString()}',
                '${tglKembali.toISOString()}',
                '${transportasi}',
                ${token.id},
                '${penerimaInDB.rows[0].nama}',
                ${penerimaInDB.rows[0].id},
                '${JSON.stringify(anggaran)}',
                'pending',
                '${createdDate.toISOString()}',
                '${createdDate.toISOString()}'
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
                anggaran,
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
                '${createdDate.toISOString()}',
                '${createdDate.toISOString()}'
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
        const token = jwt.verify(String(req.headers.authorization).slice(7), "$!1HoW6Dr1")
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
                'Pengajuanmu telah di ${newPerjalanan.rows[0].status == 'approved' ? 'Setujui' : 'Tolak'} oleh ${approverDipaInDB.rows[0].nama}',
                '${status == 'rejected' ? keterangan : 'Pengajuanmu telah Disetujui'}',
                'close',
                '${newPerjalanan.rows[0].status}',
                '${new Date(checkPerjalananInDB.rows[0].created_at).toISOString()}',
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
        const token = jwt.verify(String(req.headers.authorization).slice(7), "$!1HoW6Dr1")
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
        const checkPerjalananInDB = await client.query(`SELECT * FROM esipd WHERE id=${req.params.perjalanan_id}`)
        if(!checkPerjalananInDB.rows.length) throw error('Perjalanan Not Found', 404)

        // Check if Approver is valid user
        const approverAdminInDB = await client.query(`SELECT id, nama FROM users WHERE id='${token.id}' AND role='admin'`)
        if(!approverAdminInDB.rows.length) throw error('Admin Not Found', 404)

        // Check if Penerima Exist
        const penerimaInDB = await client.query(`SELECT * FROM users WHERE nama='${checkPerjalananInDB.rows[0].penerima}'`)
        if(!penerimaInDB.rows.length) throw error('Penerima Not Found', 404)

        const pangkat = await client.query(`SELECT * FROM pangkat WHERE sub_pangkat='${penerimaInDB.rows[0].pangkat}'`)
        const anggaranInDB = await client.query(`SELECT * FROM anggaran_harian WHERE golongan='${pangkat.rows[0].golongan}'`)
        const transportasiInDB = await client.query(`SELECT * FROM transportasi WHERE lokasi_awal='${kota_asal}' AND lokasi_tujuan='${kota_tujuan}' AND nama='${transportasi}'`)

        // Dates
        const tglBerangkat = new Date(tgl_berangkat)
        const tglKembali = new Date(tgl_kembali)
        const createdDate = new Date()

        // Calculate the difference in milliseconds
        const differenceInMs = tglKembali - tglBerangkat;

        // Convert milliseconds to days
        const daysDifference = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

        const anggaran = {
            biayaHarian: 1 * daysDifference * Number(jenis_perjalanan === 'luar_kota' ? anggaranInDB.rows[0].anggaran_luar_kota : anggaranInDB.rows[0].anggaran_dalam_kota), // jumlah orang x jumlah hari x uang harian
            biayaPenginapan: 1 * daysDifference * Number(anggaranInDB.rows[0].uang_penginapan), // jumlah orang per pangkat x jumlah hari x uang penginapan
            biayaBBMDanPelumas : null,
            biayaTransport: null,
            uangRepresentasi: 1 * daysDifference * Number(jenis_perjalanan === 'luar_kota' ? anggaranInDB.rows[0].uang_representasi_luar_kota : anggaranInDB.rows[0].uang_representasi_dalam_kota),
            biayaHarianInfo: `1 (jumlah orang) x ${daysDifference} (jumlah hari) x ${jenis_perjalanan === 'luar_kota' ? anggaranInDB.rows[0].anggaran_luar_kota : anggaranInDB.rows[0].anggaran_dalam_kota} uang harian`,
            biayaPenginapanInfo: `1 (jumlah orang) x ${daysDifference} (jumlah hari) x ${anggaranInDB.rows[0].uang_penginapan} (uang penginapan)`,
            uangRepresentasiInfo: `1 (jumlah orang) x ${daysDifference} (jumlah hari) x ${jenis_perjalanan === 'luar_kota' ? anggaranInDB.rows[0].uang_representasi_luar_kota : anggaranInDB.rows[0].uang_representasi_dalam_kota} (uang representasi)`,
            total: 0 // jumlah orang per tingkat x jumlah hari x uang representasi
        }

        if(transportasi.toLowerCase() === 'mobil') {
            anggaran.biayaBBMDanPelumas = {
                BBM: {
                    PP: ((Number(transportasiInDB.rows[0].jarak) * 2) * 15000) / 4, // (Jarak KM x 2 (PP) x Harga Bensin pertamax per liter) / 4
                    jathar: daysDifference * 7 * 15000 // jumlah hari x 7 x Harga Bensin pertamax per liter
                },
                pelumas: {
                    PP : (0.04 * (Number(transportasiInDB.rows[0].jarak) * 2) * 60000) / 4, // (4% x Jarak KM x 2 (PP) x Harga Pelumas fix 60.000) / 4
                    jathar : 0.04 * daysDifference * 7.5 * 60000 // 4% x jumlah hari x 7.5 x Harga Pelumas fix 60.000
                }
            }
            anggaran.biayaBBMDanPelumasInfo = `PP : (${transportasiInDB.rows[0].jarak} (Jarak KM) x 2 (PP) x 15,000 (Harga Bensin pertamax per liter)) / 4\nJatah Harian : ${daysDifference} (jumlah hari) x 7 x 15,000 (Harga Bensin pertamax per liter)`
        } else {
            anggaran.biayaTransport = daysDifference * 2 * Number(transportasiInDB.rows[0].biaya) // jumlah hari x 2 (PP) x Harga tiket terbaru (sesuai kenyataan manual)
            anggaran.biayaTransportInfo = `${daysDifference} (jumlah hari) x 2 (PP) x ${transportasiInDB.rows[0].biaya} (Harga tiket terbaru)`
        }

        anggaran.total += anggaran.biayaHarian + anggaran.biayaPenginapan + anggaran.uangRepresentasi + (anggaran.biayaTransport || 0) + (!anggaran.biayaBBMDanPelumas ? 0 : anggaran.biayaBBMDanPelumas.BBM.PP + anggaran.biayaBBMDanPelumas.BBM.jathar + anggaran.biayaBBMDanPelumas.pelumas.PP + anggaran.biayaBBMDanPelumas.pelumas.jathar)

        // Update
        const newPerjalanan = await client.query(`
            UPDATE esipd
            SET keterangan = '${keterangan}',
                nomor_sprint = '${nomor_sprint}',
                nomor_sppd = '${nomor_sppd}',
                jenis_perjalanan = '${jenis_perjalanan}',
                daerah_tujuan = '${daerah_tujuan}',
                kota_asal = '${kota_asal}',
                kota_tujuan = '${kota_tujuan}',
                tgl_berangkat = '${tglBerangkat.toISOString()}',
                tgl_kembali = '${tglKembali.toISOString()}',
                transportasi = '${transportasi}',
                pengirim = ${token.id},
                penerima = '${penerimaInDB.rows[0].nama}',
                penerima_id = ${penerimaInDB.rows[0].id},
                anggaran = '${JSON.stringify(anggaran)}',
                status = 'pending',
                updated_at = '${createdDate.toISOString()}'
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
                '${new Date(checkPerjalananInDB.rows[0].created_at).toISOString()}',
                '${createdDate.toISOString()}'
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
        const token = jwt.verify(String(req.headers.authorization).slice(7), "$!1HoW6Dr1")

        let allPerjalanan = new Array()

        if(req.query.perjalanan_id) {
            allPerjalanan = await client.query(`SELECT * FROM esipd WHERE id=${req.query.perjalanan_id}`)
        } else if(token.role == 'anggota') {
            allPerjalanan = await client.query(`SELECT * FROM esipd WHERE penerima_id=${token.id} AND status != 'finished' ORDER BY id DESC`)
        } else {
            allPerjalanan = await client.query(`SELECT * FROM esipd WHERE status != 'finished' ORDER BY id DESC`)
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

const getAllLaporan = async (req, res) => {
    try {
        const token = jwt.verify(String(req.headers.authorization).slice(7), "$!1HoW6Dr1")

        let allPerjalanan = new Array()

        if(req.query.perjalanan_id) {
            allPerjalanan = await client.query(`SELECT * FROM laporan_perjalanan WHERE id=${req.query.perjalanan_id}`)
        } else if(token.role == 'anggota') {
            allPerjalanan = await client.query(`SELECT * FROM laporan_perjalanan WHERE penerima_id=${token.id} ORDER BY id DESC`)
        } else {
            allPerjalanan = await client.query(`SELECT * FROM laporan_perjalanan ORDER BY id DESC`)
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
            allPangkat = await client.query(`SELECT * FROM pangkat ORDER BY id ASC`)
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

// Selesai Perjalanan
const selesaiPerjalanan = async (req, res) => {
    try {
        const token = jwt.verify(String(req.headers.authorization).slice(7), "$!1HoW6Dr1")
        
        // Check if Perjalanan exist
        const checkPerjalananInDB = await client.query(`SELECT * FROM esipd WHERE id=${req.params.perjalanan_id}`)
        if(!checkPerjalananInDB.rows.length) throw error('Perjalanan Not Found', 404)
        if(checkPerjalananInDB.rows[0].status == 'finished') throw error('Perjalanan is finished', 400)

        // Check if Approver is user penerima
        if(checkPerjalananInDB.rows[0].penerima_id !== token.id && token.role != 'admin') throw error('User tidak diperbolehkan', 403)

        const createdDate = new Date().toISOString()

        // Update
        const newPerjalanan = await client.query(`
            UPDATE esipd
            SET status = 'finished',
                updated_at = '${createdDate}'
            WHERE id = ${req.params.perjalanan_id}
            RETURNING *;
        `)

        // Create Laporan
        const newLaporan = await client.query(`
            INSERT INTO laporan_perjalanan (
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
                anggaran,
                status,
                created_at,
                updated_at
            ) 
            VALUES (
                '${checkPerjalananInDB.rows[0].keterangan}',
                '${checkPerjalananInDB.rows[0].nomor_sprint}', 
                '${checkPerjalananInDB.rows[0].nomor_sppd}', 
                '${checkPerjalananInDB.rows[0].jenis_perjalanan}',
                '${checkPerjalananInDB.rows[0].daerah_tujuan}',
                '${checkPerjalananInDB.rows[0].kota_asal}',
                '${checkPerjalananInDB.rows[0].kota_tujuan}',
                '${checkPerjalananInDB.rows[0].tgl_berangkat}',
                '${checkPerjalananInDB.rows[0].tgl_kembali}',
                '${checkPerjalananInDB.rows[0].transportasi}',
                ${checkPerjalananInDB.rows[0].pengirim},
                '${checkPerjalananInDB.rows[0].penerima}',
                ${checkPerjalananInDB.rows[0].penerima_id},
                '${checkPerjalananInDB.rows[0].anggaran}',
                'finished',
                '${createdDate}',
                '${createdDate}'
            )
            RETURNING *
        `)

        res.status(201).json({
            success: true,
            data: newLaporan.rows
        })
        
    } catch (error) {
        console.log('Error Set Selesai Perjalanan = ', error.message);
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
    getAllLaporan,
    getAllTransportasi,
    getAnggaran,
    getPangkat,
    selesaiPerjalanan
}