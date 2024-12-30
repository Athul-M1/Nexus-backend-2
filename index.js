require('dotenv').config()
require('./DB/connection')

const express = require('express')
const cors = require('cors')
const router = require('./Routes/router')

const server = express()

server.use(cors())            // use Middleware for e commerce website
server.use(express.json())   // convert the data into json 
server.use(router)
server.use('/uploads', express.static('uploads')); 

const port = 3000 || process.env.PORT  

server.listen(port,()=>{
    console.log(`Server is running on the port ${port}`)
})
server.get('/',(req,res)=>{                                          // handler function
    res.send(`<h1>Server is running</h1>`)     
})