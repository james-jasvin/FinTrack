const watchlistInstrumentRouter = require('express').Router()
const WatchlistInstrument = require('../models/watchlistInstrument')
const Instrument = require('../models/instrument')
const Watchlist = require('../models/watchlist')
const sanitize = require('mongo-sanitize');

/*
* Create a new watchlist-instrument with given watchlist-id and instrument-id in request body
* Check if a watchlist-instrument already exists in the given watchlist with desired instrument.
* If yes, return 401 status code with the error "Duplicate Watchlist-Instrument"
* Check if added instrument is of same type as watchlist. If not, return 401 status code with type-mismatch error 
* Otherwise, return the symbol, name, type, url, id , watchlist-id, instrument-id upon successful creation
* with 201 status code
*/
watchlistInstrumentRouter.post('/', async (request, response) => {
	const user = request.user
  
	const watchlistId = sanitize(request.body.watchlistId)
	const instrumentId = sanitize(request.body.instrumentId)

	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })
	
	if (!watchlistId || !instrumentId)
		return response.status(400).json({ error: 'missing watchlistId or instrumentId in request' })

	const checkWatchlistInstrumentId = await WatchlistInstrument.findOne({watchlist: watchlistId, instrument: instrumentId})
	
	const watchlistObject = await Watchlist.findOne({_id: watchlistId})
	const instrumentObject = await Instrument.findOne({_id: instrumentId})
	
	if(checkWatchlistInstrumentId)
		return response.status(400).json({ error: `You have already added '${instrumentObject.name}' to watchlist '${watchlistObject.name}'` })	

	if(watchlistObject.isMF !== instrumentObject.isMF)
	{
		if(watchlistObject.isMF === true)
			return response.status(400).json({ error: `Stock '${instrumentObject.symbol}' cannot be added to MF watchlist '${watchlistObject.name}'` })
		
		else
			return response.status(400).json({ error: `MF '${instrumentObject.symbol}' cannot be added to Stock watchlist '${watchlistObject.name}'` })
	}
		
	const watchlistInstrumentObject = new WatchlistInstrument({
		watchlist: watchlistId,
		instrument: instrumentId
	})

	const savedWatchlistInstrument = await watchlistInstrumentObject.save()

	const watch = {
		symbol: instrumentObject.symbol,
		name: instrumentObject.name,
		isMF: instrumentObject.isMF,
		url: instrumentObject.url,
		instrumentId: savedWatchlistInstrument.instrument,
		watchlistId: savedWatchlistInstrument.watchlist,
		id: savedWatchlistInstrument.id
	}

	response.status(201).json(watch)
})


/*
* Return all watchlist-instruments which belong to given watchlist-id
* Check if watchlist-id exists. If it does, populate instrument database in a new object using mongoose' populate() method. 
* Otherwise, return 401 status code with error "Invalid Watchlist-id"
*/
watchlistInstrumentRouter.get('/', async (request, response) => {
	const watchlistId = request.query.watchlistId

	const user = request.user
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })
    
	const watchlistInstrumentsList = await WatchlistInstrument.find({watchlist: watchlistId}).populate('instrument')
    
	if(!watchlistInstrumentsList)
		return response.status(404).json({ error: 'Invalid watchlist' })

	const modifiedWatchlistInstrumentsList = watchlistInstrumentsList.map((watchlistInstrument) =>{
		return {
			symbol: watchlistInstrument.instrument.symbol,
			name: watchlistInstrument.instrument.name,
			isMF: watchlistInstrument.instrument.isMF,
			url: watchlistInstrument.instrument.url,
			instrumentId: watchlistInstrument.instrument.id,
			watchlistId: watchlistInstrument.watchlist,
			id: watchlistInstrument.id
		}
	})	

	response.status(200).json(modifiedWatchlistInstrumentsList)
})


/*
* Delete the watchlist-instrument with given watchlistInstrument-id
* Check if watchlist-id exists. If it does, delete watchlist-instrument from WatchlistInstrument Database 
* Otherwise return 404 status code with error "Invalid Watchlist-id"
*/
watchlistInstrumentRouter.delete('/:watchlistInstrumentid', async (request, response) => {
	const user = request.user    
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })

	const watchlistInstrumentId = request.params.watchlistInstrumentid
	const watchlistInstrument = await WatchlistInstrument.find({_id: watchlistInstrumentId})

	if (!watchlistInstrument || watchlistInstrument.length === 0) {
		return response
			.status(404)
			.json({ success: false, msg: `no watchlistInstrument with id '${watchlistInstrumentId}'` })
	}

	await WatchlistInstrument.deleteOne({ _id: watchlistInstrumentId })

	response.status(201).json({ success: true })
})


/*
* Delete all instruments which belong to given watchlist-id 
* Check if watchlist-id exists. If it does, delete all the instruments belonging to this watchlist from WatchListInstrument Database 
* Otherwise return 404 status code with error "Invalid Watchlist-id"
*/
watchlistInstrumentRouter.delete('/', async (request, response) => {
	const user = request.user    
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })

	const watchlistId = request.query.watchlistId
	const watchlistInstrument = await WatchlistInstrument.find({watchlist: watchlistId})

	if (!watchlistInstrument || watchlistInstrument.length === 0) {
		return response
			.status(404)
			.json({ success: false, msg: `no watchlist with id '${watchlistId}'` })
	}

	await WatchlistInstrument.deleteMany({ watchlist: watchlistId })

	response.status(201).json({ success: true })
})


module.exports = watchlistInstrumentRouter