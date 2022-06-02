require('dotenv').config()
const http = require('http')
const { Server } = require('socket.io')
require('./db/db')
const mainHandler = require('./handlers/main')
const clientHandler = require('./handlers/client')

const { PORT } = process.env

const server = http.createServer()

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        methods: ['GET', 'POST']
    }
})

io.of('/main').on('connection', socket => mainHandler(io, socket))
io.of('/client').on('connection', socket => clientHandler(io, socket))

server.listen(PORT, () => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: Listening on Port ${PORT}`)
})