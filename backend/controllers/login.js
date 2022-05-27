const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const loginRouter = require('express').Router()
const config = require('../utils/config')
const sanitize = require('mongo-sanitize')

/*
* For the provided username, check whether such a user exists in the DB
* If there is a user, then check whether the hash of the password sent and stored passwordHash match
* If they do, then login is valid and generate a token using the username, user id & SECRET env variable
* as input to the jwt.sign() method
* Return the token, username, name and user id upon successful login with 200 status code
* Otherwise return 401 status code with error message in response
*/
loginRouter.post('/', async (request, response) => {
	const body = request.body
	const username = sanitize(body.username)
	const password = sanitize(body.password)

	const user = await User.findOne({ username })
	const passwordCorrect = user === null? false: await bcrypt.compare(password, user.passwordHash)

	if (!passwordCorrect)
		return response.status(401).json({ error: 'Invalid username or password' })

	const userForToken = {
		username: user.username,
		id: user.id
	}

	const token = jwt.sign(userForToken, config.SECRET)

	response.status(200).send({ token, username: user.username, name: user.name, id: user.id })
})

module.exports = loginRouter
