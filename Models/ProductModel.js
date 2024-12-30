const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    gameName: {
        required: true,
        type: String
    },
    gamePrice: {
        required: true,
        type: Number
    },
    description: {
        required: true,
        type: String
    },
    gameGenre: {
        required: true,
        type: String
    },
    gameImage: {
        required: true,
        type: String
    },
    reviews: [
        {
            review: {
                type: String
            },
            username:{
                type:String
            }
        }
    ]
})

const ProductModel = mongoose.model('ProductModel', ProductSchema)
module.exports = ProductModel