const jwt = require('jsonwebtoken')
const error = require('./error')

require('dotenv').config()

const checkAuth = async (req, res, next) => {
    try {
        if(!req.headers.authorization) throw error('Token is required', 401);

        const token = String(req.headers.authorization).slice(7)
        if(!token) throw error('Invalid Token', 401);

        const decoded = jwt.verify(token, "$!1HoW6Dr1");
        if(!decoded) throw error('Invalid Token', 401);
    
        next()
        
    } catch (error) {
        console.log('Error Token Auth = ', error.message);
        res.status(error.status || 500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = checkAuth