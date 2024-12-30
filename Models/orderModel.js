const mongoose = require('mongoose')

const orderShema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userModel'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'ProductModel'
    },
    email:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel'
    },
    paymentId:{
        required:true,
        type:String
    },
    amount:{
        required:true,
        type:Number
    },
    date:{
        required:true,
        type:Date,
        default:Date.now()
    }
})
const orderModel  = mongoose.model('orderModel',orderShema)
module.exports = orderModel