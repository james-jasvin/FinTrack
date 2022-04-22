const config = require('./utils/config')
const express = require('express')
require('express-async-errors')

const app = express()

const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')
const instrumentRouter = require('./controllers/instruments')
const watchlistRouter = require('./controllers/watchlists')
// const testingRouter = require('./controllers/test')
const middleware = require('./utils/middleware')

const cors = require('cors')
const mongoose = require('mongoose')

const logger = require('./utils/logger')

// Adding the Morgan logger
const morgan = require('morgan')
const fs = require('fs')

// Extract request's body, convert it to string and this output will be tagged as 
// "data" parameter for morgan log pattern
morgan.token('data', request => JSON.stringify(request.body))

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
  - Add the Morgan logger with the following format specified
  - The format is what will be printed by the server each time a request is received
	- In the production environment we want the logs to be written to a file
	- fs.createWriteStream() writes the specified logs into the access.log file in the current directory
	- The 'a' flag is for appending
	- In the development environment we want the logs to be printed to the console
	- And the second app.use(morgan()) call does exactly that
*/
if (process.env.NODE_ENV === 'production')
	app.use(morgan(':date[web] :method :url :status :res[content-length] - :response-time ms :data', {
		stream: fs.createWriteStream('./access.log', {flags: 'a'})
	}))
else if (process.env.NODE_ENV === 'development')
	app.use(morgan(':date[web] :method :url :status :res[content-length] - :response-time ms :data'))

app.use(middleware.tokenExtractor)

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/instruments', instrumentRouter)
app.use('/api/watchlists', middleware.userExtractor, watchlistRouter)


// This is how you should include your API controller
// app.use('/api/blogs', middleware.userExtractor, blogsRouter)

// Can skip for now
// if (process.env.NODE_ENV === 'test')
// 	app.use('/api/testing', testingRouter)

// Any unrecognized routes will be handled by the unknownEndpoint middleware which has to be added secondlast
app.use(middleware.unknownEndpoint)

// Any error in REST API requests would lead to the errorHandler middleware which has to be added the last
app.use(middleware.errorHandler)

module.exports = app