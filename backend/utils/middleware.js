const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const config = require('./config')
const User = require('../models/user')

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'Unknown URL endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)

	if (error.name === 'CastError')
		return response.status(400).send({ error: 'malformatted id' })

	else if (error.name === 'ValidationError')
		return response.status(400).send({ error: error.message })

	else if (error.name === 'JsonWebTokenError')
		return response.status(401).send({ error: 'token missing or invalid' })
    
	next(error)
}

// Adds the "token" field to the request object
const tokenExtractor = (request, response, next) => {
	request.token = null
	const authorization = request.get('authorization')

	if (authorization && authorization.toLowerCase().startsWith('bearer '))
		request.token = authorization.substring(7)

	next()
}

// Adds the "user" field to the request object
const userExtractor = async (request, response, next) => {
	const token = request.token

	// This is to ensure that only those routes that are concerned with token-authentication
	// like POST and DELETE and the GET user watchlists routes use this middleware
	// All other GET routes are allowed to bypass this
	if (token === null)
		return next()

	const decodedToken = await jwt.verify(token, config.SECRET)

	if (!token || !decodedToken.id)
		request.user = null
	else
		request.user = await User.findById(decodedToken.id)

	next()
}

module.exports = { unknownEndpoint, errorHandler, tokenExtractor, userExtractor }