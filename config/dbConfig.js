const mongoose = require('mongoose')


mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection;

connection.on("connected", () => {
    console.log("MongoDb is connected")
})


connection.on('error', () => {
    console.log("error in connection")
})


module.exports = mongoose