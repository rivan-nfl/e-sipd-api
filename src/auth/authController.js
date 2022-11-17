var jwt = require('jsonwebtoken');
const error = require("../helper/error")
const { client } = require("../services/database")

require('dotenv').config()

const register = async (req, res) => {
    try {
        const { nama, nrp, pangkat, jabatan, bagian, image, username, email, password, role } = req.body

        if(
            !nama ||
            !nrp ||
            !pangkat ||
            !jabatan ||
            (role == 'dipa' && !bagian) ||
            !username ||
            !email ||
            !password ||
            !role
        ) throw error(`All Fields is required !`, 400)

        const checkUserInDB = await client.query(`SELECT nama, email FROM users WHERE username='${username}' OR email='${email}'`)
        if(checkUserInDB.rows.length) throw error('User already exist', 400)

        const newUser = await client.query(`
            INSERT INTO users (
                nama,
                nrp,
                pangkat,
                jabatan,
                bagian,
                image,
                username,
                email,
                password,
                role
            )
            VALUES (
                '${nama}',
                '${nrp}',
                '${pangkat}',
                '${jabatan}',
                '${bagian}',
                '${image || 'https://asset.kompas.com/crops/hR9ws8oHmOUpyvfttDaOPaZgkew=/0x37:521x384/750x500/data/photo/2022/03/30/624390f3cc33d.jpeg'}',
                '${username}',
                '${email}',
                '${password}',
                '${role}'
            )
            RETURNING nama, username, email, nrp, pangkat, jabatan, bagian, image, role;
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

        const userInDB = await client.query(`SELECT id, nama, username, email, password FROM users WHERE username='${username}'`)
        if(!userInDB.rows.length) throw error('User Not Found', 404)
        if(userInDB.rows[0].password != password) throw error('Invalid Credentials', 401)

        delete userInDB.rows[0].password

        const token = jwt.sign(userInDB.rows[0], process.env.TOKEN_PRIVATE_KEY);

        res.status(201).json({
            success: true,
            // data: userInDB.rows[0],
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