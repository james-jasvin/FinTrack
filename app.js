const config = require('./utils/config')
const express = require('express')
require('express-async-errors')

const app = express()

const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')
// const testingRouter = require('./controllers/test')
const middleware = require('./utils/middleware')

const cors = require('cors')
const mongoose = require('mongoose')

const logger = require('./utils/logger')

// Adding the Morgan logger
const morgan = require('morgan')
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
  - Don't use logging when in testing environment which is why NODE_ENV is checked
*/
if (process.env.NODE_ENV !== 'test')
	app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(middleware.tokenExtractor)

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

// app.use('/api/blogs', middleware.userExtractor, blogsRouter)

// if (process.env.NODE_ENV === 'test')
// 	app.use('/api/testing', testingRouter)

// Any unrecognized routes will be handled by the unknownEndpoint middleware which has to be added secondlast
app.use(middleware.unknownEndpoint)

// Any error in REST API requests would lead to the errorHandler middleware which has to be added the last
app.use(middleware.errorHandler)

module.exports = app