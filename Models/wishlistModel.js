const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'UserModel'
    },
    games:[
        {
            gameId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'ProductModel'
            }
        }
    ]
})

const wishlistModel = mongoose.model('wishlistModel',wishlistSchema)
module.exports = wishlistModel