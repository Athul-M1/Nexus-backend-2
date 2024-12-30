const mongoose = require('mongoose')
const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log("Mongodb connection sucessful")
}).catch((err)=>{
    console.log("connection failed",err)
})
