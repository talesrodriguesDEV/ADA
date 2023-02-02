const express = require('express')
const dotenv = require('dotenv')
const populateDB = require('../database/populateDB')
const connectDB = require('../database/connectDB')

dotenv.config()

const API_PORT = process.env.API_PORT || 3001

populateDB()
connectDB()

const server = express()

server.listen(API_PORT, console.log(`Server running on port ${API_PORT}`))
