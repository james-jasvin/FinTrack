const mongoose = require('mongoose')

const watchlistInstrumentSchema = new mongoose.Schema({
	watchlist: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Watchlist',
		required: true
	},
	instrument: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Instrument',
		required: true
	}
})

watchlistInstrumentSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('WatchlistInstrument', watchlistInstrumentSchema)