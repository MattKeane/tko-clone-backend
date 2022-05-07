const mongoose = require('mongoose')

const { MONGOOSE_URI } = process.env

mongoose.connect(MONGODB_URI, {
    useNewUrlParse: true,
    useUnifiedTopolog: true,
})

mongoose.connection.on('connected', () => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: connected to MongoDB`)
})

mongoose.connection.on('disconnected', () => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: Disconnected from MongoDB`)
})

mongoose.connection.on('error', err => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: Error with MongoDB`)
    console.log(err)
})