require('dotenv').config()
const http = require('http')
const { Server } = require('socket.io')

const { PORT } = process.env

const server = http.createServer()

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection', socket => {
    console.log('The connection is made')
    
    socket.on('start', () => {
        console.log('starting a game')
    })
})

server.listen(PORT, () => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: Listening on Port ${PORT}`)
})