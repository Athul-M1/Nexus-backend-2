const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'UserModel'
    },
    products:[  
        {
            productId:{   
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'ProductModel'
            }
        }
    ]
})

const cartModel=mongoose.model('cartModel',cartSchema)
module.exports=cartModel