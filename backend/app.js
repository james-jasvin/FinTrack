const config = require('./utils/config')
const express = require('express')
require('express-async-errors')

const app = express()

const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')
const instrumentRouter = require('./controllers/instruments')
const watchlistRouter = require('./controllers/watchlists')
const watchlistInstrumentRouter = require('./controllers/watchlistInstruments')
const middleware = require('./utils/middleware')

const cors = require('cors')
const mongoose = require('mongoose')

const logger = require('./utils/logger')

// Adding the Morgan logger
const morgan = require('morgan')
const fs = require('fs')

/*
* Extract request's body and convert it to string
* This output will be tagged as "data" parameter for morgan log pattern
* If request body contains password parameter then set it to '' before setting it as data parameter for Morgan
* This prevents logging of passwords to the log file, thereby enhancing security
*/
morgan.token('data', request => {
	if (request.body.password)
		request.body.password = ''
	return JSON.stringify(request.body)
})

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('Successfully connected to MongoDB')
	})
	.catch((error) => {
		logger.error(`Failed to connect to MongoDB: ${error.message}`)
	})

app.use(cors())
app.use(express.json())

/*
* Add the Morgan logger with the following format specified
* The format is what will be printed by the server each time a request is received
* In the production environment we want the logs to be written to a file
* fs.createWriteStream() writes the specified logs into the /logs/access.log file in the current directory
* The 'a' flag is for appending
* In the development environment we want the logs to be printed to the console
* And the second app.use(morgan()) call does exactly that
*/
if (process.env.NODE_ENV === 'production')
	app.use(morgan(':date[web] :method :url :status :res[content-length] - :response-time ms :data', {
		stream: fs.createWriteStream('./logs/access.log', {flags: 'a'})
	}))
else if (process.env.NODE_ENV === 'development')
	app.use(morgan(':date[web] :method :url :status :res[content-length] - :response-time ms :data'))

app.use(middleware.tokenExtractor)

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/instruments', instrumentRouter)
app.use('/api/watchlists', middleware.userExtractor, watchlistRouter)
app.use('/api/watchlistInstruments', middleware.userExtractor, watchlistInstrumentRouter)

// Any unrecognized routes will be handled by the unknownEndpoint middleware which has to be added secondlast
app.use(middleware.unknownEndpoint)

// Any error in REST API requests would lead to the errorHandler middleware which has to be added the last
app.use(middleware.errorHandler)

module.exports = app