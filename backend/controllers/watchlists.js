const watchlistRouter = require('express').Router()
const Watchlist = require('../models/watchlist')
const sanitize = require('mongo-sanitize');

/*
* Return all watchlists which belong to given user (user-id)
* Check whether user has sent jwt token in packet header
* Otherwise, return 401 status code with error "invalid token" 
*/
watchlistRouter.get('/', async (request, response) => {
	const userId = request.query.user

	const user = request.user
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })
    
	const watchlist = await Watchlist.find({user: userId})
    
	response.status(200).json(watchlist)
})


/*
* Create a new watchlist in the database with data provided in request body.
* Check whether user has sent jwt token in packet header
* Otherwise, return 401 status code with error "invalid token"
* Return watchlist name, type, user-id upon successful creation with 201 status code  
*/
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


/*
* Delete watchlist with given watchlist-id
* Check if watchlist-id exists. If it does, delete given watchlist from Watchlist Database 
* Otherwise return 404 status code with error "Invalid Watchlist-id"
*/
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


/*
* Return watchlist data with given watchlist-id in route params.
* Check if the watchlistid is valid. If not, return status code 404 with error "Invalid watchlist-id"
* Otherwise return watchlist data from Database. 
*/
watchlistRouter.get('/:watchlistid', async (request, response) => {
	const user = request.user
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })

	const watchlistId = sanitize(request.params.watchlistid) 
	const watchlist = await Watchlist.findOne({_id: watchlistId})

	if (!watchlist)
		return response.status(404).json({ success: false, msg: `no watchlist with id '${watchlistId}'` })

	response.status(200).json(watchlist)
})

module.exports = watchlistRouter