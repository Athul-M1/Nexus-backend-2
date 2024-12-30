const cartModel = require('../Models/cartModel')

exports.addToCart = async (req, res) => {
    const { productId } = req.body
    const { userId } = req.params
    //    console.log(productId)  

    try {
        const existingUser = await cartModel.findOne({ userId })
        if (existingUser) {
            const product = existingUser.products.find(p => p.productId == productId)
            if (product) {
                return res.status(409).send({ message: "Item already exist" })
            }
            existingUser.products.push({ productId })
            await existingUser.save()
            res.status(200).send("Product added to cart...")
        } else {
            const cartData = await new cartModel({
                userId,
                products: { productId }
            })
            await cartData.save()
            res.status(200).send("Product added to cart")
        }
    } catch (err) {
        res.status(500).send("Internal server error...")
        console.log(err);
    }
}

exports.getCartProduct = async (req, res) => {
    const { userId } = req.params
    // console.log(userId);

    try {
        const products = await cartModel.findOne({ userId }).populate('products.productId', 'gameName gamePrice description gameImage gameGenre')
        // console.log(products)
        if (!products) {
            return res.status(404).send({ message: 'cart is empty' })
        }
        res.status(200).send(products)
    }
    catch (error) {

        res.status(500).send("Internal server error")
        console.log(error)
    }
}
exports.removeFromCart = async (req, res) => {
    const userId = req.payload
    const { productId } = req.params
    // console.log(productId)
    try {
        const cartData = await cartModel.findOne({ userId })
        if (!cartData) {
            return res.status(404).send("You haven't added anything to the cart")
        }
        // console.log(cartData)
        // Filter out the product to be removed
        const updatedCart = cartData.products.filter((p) => p._id.toString() != productId)       
        cartData.products = updatedCart
        await cartData.save()
        res.status(200).send({message: "Item is removed from the cart "})

    } catch (error) {
        res.status(500).send("Internal server error")
        console.log(error)
    }
}
   

