const Razorpay = require("razorpay")
const orderModel = require('../Models/orderModel')
const PDFDocument = require('pdfkit');

exports.paymentController = async (req, res) => {
    const { amount } = req.body
    // console.log(amount)
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_SECRET_KEY 
        })
        const options = {
            amount,
            currency: 'INR'
        }
        const response = await razorpay.orders.create(options)
        res.status(200).send(response )
    } catch (error) {
        res.status(500).send("Internal Server Error")
        console.log(error)
    }  
}
//
exports.placeOrderController = async(req,res)=>{
    const userId=req.payload
    // console.log(userId)
    const {   
        productId,
        paymentId,
    } = req.body
    
    if( !productId || !paymentId){
        return res.status(401).send("Something went wrong")
    }   
    try {
        const savePayment = new orderModel({
            userId,
            productId,
            paymentId
        })
        const response = await savePayment.save()
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send("Internal server Error")
        console.log(error)
    }
}
exports.getOrders = async(req,res)=>{
    const userId = req.payload
    try {
        const products = await orderModel.find({userId}).populate('productId','gameName gamePrice description gameImage')
    
        if(!products){
            return res.status(404).send("Orders not found..!")
        }
        res.status(200).send(products)
        
    } catch (error) {
        res.status(500).send("Internal server error")
        console.log(error)
    }
}
// invoice creation
exports.pdfGeneration = async(req,res)=>{
    const {id} = req.body
try {
        const orderDetails = await orderModel.findById(id).populate('userId', 'email')
    
        //pdf generation 
        const doc = new PDFDocument()
    
        // set header to indicate file download 
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=receipt-${id}.pdf`);
     
         // Pipe the PDF directly to the response
         doc.pipe(res);
         // Add content to the PDF
         doc.fontSize(20).text('Payment Receipt', { align: 'center' });
         doc.moveDown();
         doc.fontSize(12).text(`Payment ID: ${orderDetails.paymentId}`);
         doc.text(`Order ID: ${orderDetails._id}`);
         doc.text(`Amount: ₹${orderDetails.amount / 100}`); // Razorpay stores amount in paise
         doc.text(`Email: ${orderDetails.userId.email}`);
         // Finalize the PDF and end the stream
         doc.end();
    
} catch (error) {
    res.status(500).send("Internal server Error")
    console.log(error)
}
}
    