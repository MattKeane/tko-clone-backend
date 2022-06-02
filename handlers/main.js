const Room = require('../models/room')

function mainHandler(io, socket) {   
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
            io.of('/main').to(accessCode).emit('accessCode', accessCode)
            io.of('/main').to(accessCode).emit('updateRoom', createdRoom)
        } catch (err) {
            const d = new Date()
            console.log(`${d.toLocaleString()}: Error creating a room`)
            console.log(err)
        }
    })
}

module.exports = mainHandler