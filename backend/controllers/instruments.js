const instrumentRouter = require('express').Router()
const Instrument = require('../models/instrument')

/*
	- Return all instruments in the database database
	- populate() method fills the data for the specified field, i.e. watchlists field with its "id" and "name"
	- It is equivalent to a join operation in SQL DBs
*/

instrumentRouter.get('/', async (request, response) => {
	const instruments = await Instrument.find({})
	response.status(200).json(instruments)
})

module.exports = instrumentRouter