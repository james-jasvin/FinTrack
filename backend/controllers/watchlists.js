const watchlistRouter = require('express').Router()
const Watchlist = require('../models/watchlist')

watchlistRouter.get('/', async (request, response) => {
	const userId = request.query.user

	const user = request.user
	// if(!user)
	// 	return response.status(401).json({ error: 'token missing or invalid' })
    
	const watchlist = await Watchlist.find({user: userId})
    
	response.json(watchlist)
})

watchlistRouter.post('/', async (request, response) => {
	const body = request.body
	const user = request.user
    
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })

	const watchlistObject = new Watchlist({
		name: body.name,
		isMF: body.isMF,
		user: user._id
	})

	const savedWatchlist = await watchlistObject.save()
	response.status(201).json(savedWatchlist)
})

watchlistRouter.delete('/:watchlistid', async (request, response) => {
	const user = request.user    
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })

	const watchlistId = request.params.watchlistid
	const watchlist = await Watchlist.find({_id: watchlistId})

	if (!watchlist) {
		return response
			.status(404)
			.json({ success: false, msg: `no watchlist with id ${watchlistId}` })
	}

	await Watchlist.deleteOne({ _id: watchlistId })

	return response.status(201).json({ success: true })
})

watchlistRouter.get('/:watchlistid', async (request, response) => {

	const user = request.user
	// if(!user)
	// 	return response.status(401).json({ error: 'token missing or invalid' })

	const watchlistId = request.params.watchlistid
	const watchlist = await Watchlist.find({_id: watchlistId})

	if (!watchlist) {
		return response
			.status(404)
			.json({ success: false, msg: `no watchlist with id ${watchlistId}` })
	}

	response.json(watchlist)
})


module.exports = watchlistRouter