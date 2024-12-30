const express = require('express')
const userController = require('../Controller/userController')
const productController = require('../Controller/productController')
const jwtMiddleware = require('../Middleware/jwtMiddleware')
const adminMiddleware = require('../Middleware/adminMiddleware')
const multerConfig = require('../Middleware/multerMiddleware')
const cartController = require('../Controller/cartController')
const wishlistController =require('../Controller/whishlistController')
const orderController = require('../Controller/orderController')
const router = new express.Router()

//register new user
router.post('/register',userController.register)
//login
router.post('/login',userController.login)
//otp verification
router.post('/otp-verification',userController.otpVerification)
//resend otp 
router.post('/otp-resend',userController.resendotp)
//add new game
router.post('/addgame',jwtMiddleware,adminMiddleware,multerConfig.single('gameImage'),productController.addProduct)

//get all games (admin)
router.get('/games-admin',jwtMiddleware,adminMiddleware,productController.getProducts)

//delete game
router.delete('/delete-game/:id',jwtMiddleware,adminMiddleware,productController.deleteGame)

//edit game
router.put('/edit-game/:id',jwtMiddleware,adminMiddleware,multerConfig.single('gameImage'),productController.editGame)

//get game based on genre
router.get('/get-genre/:gameGenre',productController.getcategory)  

//get single game details
router.get('/product-details/:id',productController.getSingleGame)

//get all games home page plus search
router.get('/games',productController.getProducts)
//**************************cart************************/

//add games to the cart 
router.post('/add-to-cart/:userId',jwtMiddleware,cartController.addToCart)

//get games from cart
router.get('/get-games-from-cart/:userId',jwtMiddleware,cartController.getCartProduct)

//remove from cart
router.delete('/remove-from-cart/:productId',jwtMiddleware,cartController.removeFromCart)

//**************************Wishlist************************/
// add to wishlist
router.post('/add-to-wishlist/:userId',jwtMiddleware,wishlistController.addToWishlist)
//get games from wishlist
router.get('/get-games-from-wishlist/:userId',wishlistController.getWishlistProducts)

//********************************forgot Password*************** */
router.post('/forgotpassword',userController.forgotPassword)
//update password
router.put('/updatepassword',userController.updatePassword)
//google Signin
router.post('/google-signin',userController.googleSignIn)
//get all users for admin 
router.get('/admin-users',jwtMiddleware,adminMiddleware,userController.getAllUsers)

//*************************orders***************/
router.post('/payment',jwtMiddleware,orderController.paymentController)
//place order
router.post('/place-order',jwtMiddleware,orderController.placeOrderController)
//get orders 
router.get('/get-orders',jwtMiddleware,orderController.getOrders)
//pdf
router.post('/pdf-generation',jwtMiddleware,orderController.pdfGeneration)
// product review
router.put('/product-review',jwtMiddleware,productController.reviews)


module.exports = router    