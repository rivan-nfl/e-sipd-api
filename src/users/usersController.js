const error = require("../helper/error")
const { client } = require("../services/database")

const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query

        let users
        if(role) users = await client.query(`SELECT id, nama, nrp, pangkat, jabatan, bagian, image, username, email, role FROM users WHERE role='${role}' ORDER BY id DESC`)
        else users = await client.query(`SELECT id, nama, nrp, pangkat, jabatan, bagian, image, username, email, role FROM users ORDER BY id DESC`)

        res.status(200).json({
            success: true,
            data: users.rows
        })
        
    } catch (error) {
        console.log('Error Get All Users = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const { user_id } = req.params

        const user = await client.query(`SELECT id, nama, nrp, pangkat, jabatan, bagian, image, username, email, role FROM users WHERE id=${user_id}`)
        if(!user.rows.length) throw error('User not Found', 404)

        res.status(200).json({
            success: true,
            data: user.rows[0]
        })
        
    } catch (error) {
        console.log('Error Get User by ID = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

const editUser = async (req, res) => {
    try {
        const { user_id } = req.params
        const { nama, nrp, pangkat, jabatan, bagian, image } = req.body

        if(
            !nama ||
            !nrp ||
            !pangkat ||
            !jabatan
            // (role == 'dipa' && !bagian)
        ) throw error(`All Fields is required !`, 400)

        const user = await client.query(`SELECT id, nama, nrp, pangkat, jabatan, bagian, image, username, email, role FROM users WHERE id=${user_id}`)
        if(!user.rows.length) throw error('User not Found', 404)

        const editUser = await client.query(`
            UPDATE users
            SET nama = '${nama || user.rows[0].nama}',
                nrp = '${nrp || user.rows[0].nrp}',
                pangkat = '${pangkat || user.rows[0].pangkat}',
                jabatan = '${jabatan || user.rows[0].jabatan}',
                bagian = '${bagian || user.rows[0].bagian}'
            WHERE id = ${user_id}
            RETURNING nama, nrp, pangkat, jabatan, bagian;
        `)

        res.status(200).json({
            success: true,
            data: editUser.rows
        })
        
    } catch (error) {
        console.log('Error Edit User = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    editUser
}