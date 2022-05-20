require('dotenv').config()
const http = require('http')
const { Server } = require('socket.io')
require('./db/db')
const Room = require('./models/room')

const { PORT } = process.env

const server = http.createServer()

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        methods: ['GET', 'POST']
    }
})

io.on('connection', socket => {
    
    socket.on('createRoom', async () => {

        try {

            // generate a random access code and ensure it is unique
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            let desiredAccessCode = ''
            while (desiredAccessCode.length < 4) {
                const randomChoice = Math.floor(Math.random() * alphabet.length)
                const randomLetter = alphabet[randomChoice]
                desiredAccessCode += randomLetter
                if (desiredAccessCode.length === 4) {
                    const codeExists = await Room.findOne({ accessCode: desiredAccessCode})
                    if (codeExists) {
                        desiredAccessCode = ''
                    }
                }
            }

            const createdRoom = await Room.create({
                accessCode: desiredAccessCode,
            })
            const { accessCode } = createdRoom
            socket.join(accessCode)
            io.to(accessCode).emit('accessCode', accessCode)
        } catch (err) {
            const d = new Date()
            console.log(`${d.toLocaleString()}: Error creating a room`)
            console.log(err)
        }
    })

    socket.on('joinRoom', async (accessCode, res) => {
        try {
            const roomToJoin = await Room.findOne({ accessCode })
            if (roomToJoin) {
                res({
                    room: roomToJoin,
                    status: 'ok'
                })
            } else {
                res({
                    room: null,
                    status: 'invalid'
                })
            }
        } catch (err) {
            console.log(err)
            res({
                room: null,
                status: 'error'
            })
        }
    })
})

server.listen(PORT, () => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: Listening on Port ${PORT}`)
})