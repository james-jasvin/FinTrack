const instrumentRouter = require('express').Router()
const Instrument = require('../models/instrument')


// Get all instruments stored in DB

instrumentRouter.get('/', async (request, response) => {
	const instruments = await Instrument.find({})
	response.status(200).json(instruments)
})

module.exports = instrumentRouter