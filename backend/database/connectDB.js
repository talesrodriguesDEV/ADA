const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config()
const MONGO_PORT = process.env.MONGO_PORT || 27017

function connectDB () {
  mongoose.set('strictQuery', false)

  mongoose.connect(`mongodb://mongo:${MONGO_PORT}`, { user: 'root', pass: 'example' })
  const db = mongoose.connection

  db.once('open', () => console.log('API conectada ao banco de dados.'))
  db.on('error', (err) => console.log(err))
}

module.exports = connectDB
