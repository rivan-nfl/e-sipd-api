const { Client } = require('pg')

require('dotenv').config()

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "e-sipd",
    password: "root",
    port: 5432,
})

const createTables = async() => {
    await client.query(`
        BEGIN;
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
                CREATE TYPE user_role AS ENUM ('admin', 'dipa', 'anggota');
            END IF;
        END $$;
        COMMIT;

        CREATE TABLE IF NOT EXISTS users (
            id serial PRIMARY KEY,
            nama VARCHAR(50) NOT NULL,
            nrp VARCHAR(50) NOT NULL,
            alamat VARCHAR(255) NOT NULL,
            pangkat VARCHAR(50) NOT NULL,
            jabatan VARCHAR(50) NOT NULL,
            bagian VARCHAR(50),
            foto VARCHAR(255),
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role user_role NOT NULL,
            active BOOLEAN NOT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS esipd (
            id serial PRIMARY KEY,
            keterangan VARCHAR(500) NOT NULL,
            nomor_sprint VARCHAR(50) NOT NULL,
            nomor_sppd VARCHAR(50) NOT NULL,
            jenis_perjalanan VARCHAR(50) NOT NULL,
            daerah_tujuan VARCHAR(50) NOT NULL,
            kota_asal VARCHAR(50) NOT NULL,
            kota_tujuan VARCHAR(50) NOT NULL,
            tgl_berangkat VARCHAR(50) NOT NULL,
            tgl_kembali VARCHAR(50) NOT NULL,
            transportasi VARCHAR(50) NOT NULL,
            pengirim INT NOT NULL,
            penerima VARCHAR(50) NOT NULL,
            penerima_id INT NOT NULL,
            pejalan VARCHAR(1000),
            anggaran VARCHAR(1000),
            status VARCHAR(50) NOT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS transportasi (
            id serial PRIMARY KEY,
            nama VARCHAR(50) NOT NULL,
            provinsi VARCHAR(50) NOT NULL,
            lokasi_awal VARCHAR(50) NOT NULL,
            lokasi_tujuan VARCHAR(50) NOT NULL,
            type VARCHAR(50) NOT NULL,
            biaya VARCHAR(50) NOT NULL,
            jarak VARCHAR(50) NOT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS anggaran_harian (
            id serial PRIMARY KEY,
            pangkat VARCHAR(50) NOT NULL,
            golongan VARCHAR(50) NOT NULL,
            tingkat VARCHAR(50) NOT NULL,
            anggaran_luar_kota VARCHAR(50) NOT NULL,
            anggaran_dalam_kota VARCHAR(50) NOT NULL,
            uang_penginapan VARCHAR(50),
            uang_representasi_luar_kota VARCHAR(50),
            uang_representasi_dalam_kota VARCHAR(50),
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS notifikasi (
            id serial PRIMARY KEY,
            user_id INT NOT NULL,
            user_role VARCHAR(50) NOT NULL,
            id_perjalanan INT NOT NULL,
            title VARCHAR(100) NOT NULL,
            deskripsi VARCHAR(100) NOT NULL,
            detail VARCHAR(500) NOT NULL,
            status VARCHAR(50) NOT NULL,
            perjalanan_status VARCHAR(50) NOT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS pangkat (
            id serial PRIMARY KEY,
            pangkat VARCHAR(50) NOT NULL,
            sub_pangkat VARCHAR(50) NOT NULL,
            golongan VARCHAR(50) NOT NULL,
            tingkat VARCHAR(50) NOT NULL,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS laporan_perjalanan (
            id serial PRIMARY KEY,
            keterangan VARCHAR(500) NOT NULL,
            nomor_sprint VARCHAR(50) NOT NULL,
            nomor_sppd VARCHAR(50) NOT NULL,
            jenis_perjalanan VARCHAR(50) NOT NULL,
            daerah_tujuan VARCHAR(50) NOT NULL,
            kota_asal VARCHAR(50) NOT NULL,
            kota_tujuan VARCHAR(50) NOT NULL,
            tgl_berangkat VARCHAR(50) NOT NULL,
            tgl_kembali VARCHAR(50) NOT NULL,
            transportasi VARCHAR(50) NOT NULL,
            pengirim INT NOT NULL,
            penerima VARCHAR(50) NOT NULL,
            penerima_id INT NOT NULL,
            pejalan VARCHAR(1000),
            anggaran VARCHAR(1000),
            status VARCHAR(50) NOT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL
        );
    `)

    console.log('Database Tables created');
}

const connectDB = async() => {
    try {
        await client.connect()
        
        const checkTables = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`)
        if(checkTables.rowCount < 7) createTables()

        console.log('Database is connected !');
        return true
        
    } catch (error) {
        console.log('Error Connecting DB = ', error);
        return false
    }
}

module.exports = {
    client,
    connectDB,
}