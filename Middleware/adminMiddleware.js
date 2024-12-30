const userModel = require("../Models/UserModel")

const adminMiddleware = async(req,res,next)=>{
    const id = req.payload
    const user = await userModel.findById(id)
    if(user.role === "1"){
        return next()
    }
    return res.staus(409).send({message:"Access denied"})
}
module.exports = adminMiddleware
    