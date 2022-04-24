const watchlistInstrumentRouter = require('express').Router()
const WatchlistInstrument = require('../models/watchlistInstrument')

//const instrumentRouter = require('express').Router()
const Instrument = require('../models/instrument')

watchlistInstrumentRouter.post('/', async (request, response) => {
	const body = request.body
	const user = request.user
    
	// if(!user)
	// 	return response.status(401).json({ error: 'token missing or invalid' })

	const ins = body.instrument
	//const instrumentObject = await Instrument.find({_id: ins}).select(['symbol', 'name', 'isMF', 'url'])
	//const instrumentObject = await Instrument.find({_id: ins}).select([-'id'])
	// Not able to remove ID from instrument. It is by default

	//const insObject = instrumentObject.toObject()

	// toObject() did not work 

	const instrumentObject = await Instrument.findOne({_id: ins})

	// same line with Instrument.find() did not work 

	
	const watchlistInstrumentObject = new WatchlistInstrument({
		watchlist: body.watchlist,
		instrument: body.instrument
        
	})

	const savedWatchlistInstrument = await watchlistInstrumentObject.save()

	const watch = {
		symbol: instrumentObject.symbol,
		name: instrumentObject.name,
		isMF: instrumentObject.isMF,
		url: instrumentObject.url,
		instrumentId: savedWatchlistInstrument.watchlist,
		watchlistId: savedWatchlistInstrument.instrument,
		id: savedWatchlistInstrument.id
	}


	// const watch = {
	//     ...savedWatchlistInstrument,
	//     ...instrumentObject
	// }

	response.status(201).json(watch)

})




module.exports = watchlistInstrumentRouter