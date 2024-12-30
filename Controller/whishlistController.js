const wishlistModel = require('../Models/wishlistModel')

// Add to wishlist

exports.addToWishlist = async (req, res) => {

    const { gameId } = req.body
    const { userId } = req.params

    try {
        const isUserExist = await wishlistModel.findOne({ userId })
        if (isUserExist) {
            const isGameInWishlist = isUserExist.games.find(game => game.gameId == gameId)
            if (isGameInWishlist) {
                return res.status(409).send({ message: "This game is already in the wishlist" })
            }
            isUserExist.games.push({ gameId })
            await isUserExist.save()
            res.status(200).send({ message: "Game is added to the wishlist" })
        }
        else {
            const wishlistData = new wishlistModel({
                userId,
                games: { gameId }
            })
            await wishlistData.save()
            res.status(200).send({ message: "Game is added to the wishlist" })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error })
        console.log(error)
    }
}

exports.getWishlistProducts = async (req, res) => {
    const { userId } = req.params
    try {
        const games = await wishlistModel.findOne({ userId }).populate('games.gameId','gameName gamePrice description gameGenre gameImage')
        console.log(games)
        if (!games) {
            return res.status(404).send("Your wishlist  is empty")
        }
        res.status(200).send(games)
    } catch (error) {
        res.status(500).send("Internal server error")
        console.log(error)
    }

}
