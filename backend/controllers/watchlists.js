const watchlistRouter = require('express').Router()
const Watchlist = require('../models/watchlist')


watchlistRouter.post('/', async (request, response) => {
	const body = request.body
	const user = request.user
    
    if(!user)
        return response.status(401).json({ error: "token missing or invalid" })

		user: user._id
	const watchlistObject = new Watchlist({
		name: body.name,
		isMF: body.isMF,
	})

	const savedWatchlist = await watchlistObject.save()
	response.status(201).json(savedWatchlist)
})

module.exports = watchlistRouter