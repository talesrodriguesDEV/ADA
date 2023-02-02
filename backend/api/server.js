const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const populateDB = require('../database/populateDB')
const connectDB = require('../database/connectDB')
const router = require('./routes')

dotenv.config()

const API_PORT = process.env.API_PORT || 3001

populateDB()
connectDB()

const server = express()

server.use(cors())
server.use(express.json())
server.use('/contas', router)

server.listen(API_PORT, console.log(`Server running on port ${API_PORT}`))
