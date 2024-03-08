var jwt = require('jsonwebtoken');
const error = require("../helper/error")
const { client } = require("../services/database")

require('dotenv').config()

const register = async (req, res) => {
    try {
        const { nama, nrp, alamat, pangkat, jabatan, bagian, image, username, password, role } = req.body

        if(
            !nama ||
            !nrp ||
            !alamat ||
            !pangkat ||
            !jabatan ||
            !role ||
            (role == 'dipa' && !bagian) ||
            !username ||
            !password
        ) throw error(`All Fields is required !`, 400)

        const checkUserInDB = await client.query(`SELECT nama FROM users WHERE username='${username}'`)
        if(checkUserInDB.rows.length) throw error('User already exist', 400)

        const createdDate = new Date().toISOString()

        const newUser = await client.query(`
            INSERT INTO users (
                nama,
                nrp,
                alamat,
                pangkat,
                jabatan,
                bagian,
                foto,
                username,
                password,
                role,
                active,
                created_at,
                updated_at
            ) 
            VALUES (
                '${nama}',
                '${nrp}', 
                '${alamat}', 
                '${pangkat}',
                '${jabatan}',
                '${bagian}',
                '${image || 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'}',
                '${username}',
                '${password}',
                '${role}',
                true,
                '${createdDate}',
                '${createdDate}'
            )
        `)

        res.status(201).json({
            success: true,
            data: newUser.rows[0]
        })
        
    } catch (error) {
        console.log('Error Register = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body

        if(!username || !password) throw error(`All Fields is required !`, 400)

        const userInDB = await client.query(`SELECT * FROM users WHERE username='${username}'`)
        if(!userInDB.rows.length) throw error('User Not Found', 404)
        if(userInDB.rows[0].password != password) throw error('Invalid Credentials', 401)

        delete userInDB.rows[0].password

        const token = jwt.sign(userInDB.rows[0], "$!1HoW6Dr1");

        res.status(201).json({
            success: true,
            data: userInDB.rows[0],
            token
        })
        
    } catch (error) {
        console.log('Error Login = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    register,
    login
}