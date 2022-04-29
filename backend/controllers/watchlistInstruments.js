const watchlistInstrumentRouter = require('express').Router()
const WatchlistInstrument = require('../models/watchlistInstrument')
const Instrument = require('../models/instrument')
const Watchlist = require('../models/watchlist')


// Create watchlist-instrument with given watchlist-id and instrument-id in request body
watchlistInstrumentRouter.post('/', async (request, response) => {
	const body = request.body
	const user = request.user
    
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })
	
	if (!body.watchlistId || !body.instrumentId)
		return response.status(400).json({ error: 'missing watchlistId or instrumentId in request' })

	const checkWatchlistInstrumentId = await WatchlistInstrument.findOne({watchlist: body.watchlistId, instrument: body.instrumentId})
	
	const watchlistObject = await Watchlist.findOne({_id: body.watchlistId})
	const instrumentObject = await Instrument.findOne({_id: body.instrumentId})
	
	if(checkWatchlistInstrumentId)
		return response.status(401).json({ error: `You have already added '${instrumentObject.name}' to watchlist '${watchlistObject.name}'` })	

	if(watchlistObject.isMF !== instrumentObject.isMF)
	{
		if(watchlistObject.isMF === true)
			return response.status(401).json({ error: `Stock '${instrumentObject.symbol}' cannot be added to MF watchlist '${watchlistObject.name}'` })
		
		else
			return response.status(401).json({ error: `MF '${instrumentObject.symbol}' cannot be added to Stock watchlist '${watchlistObject.name}'` })
	}
		
	const watchlistInstrumentObject = new WatchlistInstrument({
		watchlist: body.watchlistId,
		instrument: body.instrumentId
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


// Return all watchlist-instruments which belong to given watchlist-id
watchlistInstrumentRouter.get('/', async (request, response) => {
	const watchlistId = request.query.watchlistId

	const user = request.user
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })
    
	const watchlistInstrumentsList = await WatchlistInstrument.find({watchlist: watchlistId}).populate('instrument')
    
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


// Delete the watchlist-instrument with given watchlistInstrument-id
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


// Delete all instruments which belong to given watchlist-id 
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