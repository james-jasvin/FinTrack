const watchlistInstrumentRouter = require('express').Router()
const WatchlistInstrument = require('../models/watchlistInstrument')
const Instrument = require('../models/instrument')

watchlistInstrumentRouter.post('/', async (request, response) => {
	const body = request.body
	const user = request.user
    
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })

	const ins = body.instrumentId
	
	const instrumentObject = await Instrument.findOne({_id: ins})

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

watchlistInstrumentRouter.delete('/:watchlistInstrumentid', async (request, response) => {
	const user = request.user    
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })

	const watchlistInstrumentId = request.params.watchlistInstrumentid
	const watchlistInstrument = await WatchlistInstrument.find({_id: watchlistInstrumentId})

	if (!watchlistInstrument) {
		return response
			.status(404)
			.json({ success: false, msg: `no watchlistInstrument with id ${watchlistInstrumentId}` })
	}

	await WatchlistInstrument.deleteOne({ _id: watchlistInstrumentId })

	response.status(201).json({ success: true })
})

watchlistInstrumentRouter.delete('/', async (request, response) => {
	const user = request.user    
	if(!user)
		return response.status(401).json({ error: 'token missing or invalid' })

	const watchlistId = request.query.watchlistId
	const watchlistInstrument = await WatchlistInstrument.find({watchlist: watchlistId})

	if (!watchlistInstrument) {
		return response
			.status(404)
			.json({ success: false, msg: `no watchlist with id ${watchlistId}` })
	}

	await WatchlistInstrument.deleteMany({ watchlist: watchlistId })

	response.status(201).json({ success: true })
})


module.exports = watchlistInstrumentRouter