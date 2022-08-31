const User = require('../models/user')
const Room = require('../models/room')

// Handles all requests from the "client" front end (i.e. users' phones)

function clientHandler(io, socket) {
    // handles joining rooms
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

    // handles creating user names
    socket.on('createUser', async (accessCode, desiredName, res) => {
        try {
            const roomToJoin = await Room.findOne({ accessCode }).populate('users')
            if (roomToJoin) {
                if (roomToJoin.users.some(user => user.displayName === desiredName)) {
                    res({
                        status: 'taken',
                        user: null,
                    })
                } else {
                    console.log(desiredName)
                    const createdUser = await User.create({
                        displayName: desiredName,
                    })
                    roomToJoin.users.push(createdUser)
                    await roomToJoin.save()
                    res({
                        status: 'success',
                        user: createdUser
                    })
                    io.of('/main').to(accessCode).emit('updateRoom', roomToJoin)
                }
            } else {
                res({
                    status: 'invalid',
                    user: null
                })
            }
        } catch (err) {
            res({
                status: 'error',
                user: null
            })
            const d = new Date()
            console.log(`${d.toLocaleString()}: Error creating user.`)
            console.log(err)
        }
    })
}

module.exports = clientHandler