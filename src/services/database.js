const { Client } = require('pg')

require('dotenv').config()

const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
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
            nama VARCHAR(255) NOT NULL,
            nrp VARCHAR(255) NOT NULL,
            pangkat VARCHAR(255) NOT NULL,
            jabatan VARCHAR(255) NOT NULL,
            bagian VARCHAR(255),
            image VARCHAR(255),
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role user_role NOT NULL
        );
    `)

    console.log('Database Tables created');
}

const connectDB = async() => {
    try {
        await client.connect()
        
        const checkTables = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`)
        if(checkTables.rowCount < 1) createTables()

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