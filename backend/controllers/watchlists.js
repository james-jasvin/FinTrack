const watchlistRouter = require('express').Router()
const Watchlist = require('../models/watchlist')

// Return all watchlists which have given user-id in the query
watchlistRouter.get('/', async (request, response) => {
	const userId = request.query.user

	const user = request.user
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })
    
	const watchlist = await Watchlist.find({user: userId})
    
	response.status(200).json(watchlist)
})

// Create watchlist with data given in request body
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

// Delete watchlist with given watchlist-id
watchlistRouter.delete('/:watchlistid', async (request, response) => {
	const user = request.user    
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })

	const watchlistId = request.params.watchlistid
	const watchlist = await Watchlist.find({_id: watchlistId})

	if (!watchlist || watchlist.length === 0)
		return response.status(404).json({ success: false, msg: `no watchlist with id '${watchlistId}'` })

	await Watchlist.deleteOne({ _id: watchlistId })

	response.status(201).json({ success: true })
})

// Return watchlist data with given watchlist-id
watchlistRouter.get('/:watchlistid', async (request, response) => {
	const user = request.user
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })

	const watchlistId = request.params.watchlistid
	const watchlist = await Watchlist.findOne({_id: watchlistId})

	if (!watchlist)
		return response.status(404).json({ success: false, msg: `no watchlist with id '${watchlistId}'` })

	response.status(200).json(watchlist)
})

module.exports = watchlistRouter