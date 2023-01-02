const jwt = require('jsonwebtoken')
const error = require('../helper/error');
const { client } = require('../services/database');

const getAllNotifications = async (req, res) => {
    try {
        const token = jwt.verify(String(req.headers.authorization).slice(7), process.env.TOKEN_PRIVATE_KEY)

        let allNotifications = []

        if(token.role == 'anggota') {
            allNotifications = await client.query(`SELECT * FROM notifikasi WHERE user_id=${token.id} AND user_role='anggota' AND perjalanan_status='approved' ORDER BY id DESC`)
        } else if(token.role == 'admin') {
            allNotifications = await client.query(`SELECT * FROM notifikasi WHERE user_role='anggota' AND user_role='anggota' AND perjalanan_status='rejected' ORDER BY id DESC`)
        } else {
            allNotifications = await client.query(`SELECT * FROM notifikasi WHERE user_role='dipa' ORDER BY id DESC`)
        }

        res.status(201).json({
            success: true,
            data: allNotifications.rows
        })
        
    } catch (error) {
        console.log('Error Get Perjalanan = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

const updateNotification = async (req, res) => {
    try {
        const { status } = req.body

        // Validation
        if(
            !status
        ) throw error(`All Fields is required !`, 400)

        // Check if Notification exist
        const notificationInDB = await client.query(`SELECT * FROM notifikasi WHERE id=${req.params.notification_id}`)
        if(!notificationInDB.rows.length) throw error('Perjalanan Not Found', 404)

        const updatedDate = new Date().toISOString()

        // Update
        const newNotification = await client.query(`
            UPDATE notifikasi
            SET status = '${status}',
                updated_at = '${updatedDate}'
            WHERE id = ${req.params.notification_id}
            RETURNING *;
        `)

        res.status(201).json({
            success: true,
            data: newNotification.rows
        })
        
    } catch (error) {
        console.log('Error Get Perjalanan = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getAllNotifications,
    updateNotification,
}