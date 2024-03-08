const cors = require('cors')
const express = require('express')
const { connectDB } = require('./src/services/database')

const authRouter = require('./src/auth/authRouter')
const usersRouter = require('./src/users/usersRouter')
const esipdRouter = require('./src/e-sipd/e-sipdRouter')
const notificationRouter = require('./src/notification/notificationRouter')

const checkAuth = require('./src/helper/checkAuth')

const PORT = process.env.PORT || 4000
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_, res) => res.status(200).send('E-SIPD API'))

app.use('/auth', authRouter)
app.use('/users', checkAuth, usersRouter)
app.use('/e-sipd', checkAuth, esipdRouter)
app.use('/notifications', checkAuth, notificationRouter)

const startServer = async () => {
    await connectDB()
    app.listen(PORT, () => console.log('Server is running...'))
}

startServer()