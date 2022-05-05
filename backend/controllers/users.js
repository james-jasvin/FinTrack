const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt') 
const config = require('../utils/config')

/*
* Return all users in the database database
* populate() method fills the data for the specified field, i.e. watchlists field with its "id" and "name"
* It is equivalent to a join operation in SQL DBs
*/
userRouter.get('/', async (request, response) => {
	const users = await User.find({})
	response.json(users)
})

/*
* Create a new user in the database using the data provided in the request
* Do validation checks in the password specified so that it satisfies the criteria for a good password
* Encrypt the password using bcrypt to obtain the hash value and store this data in the DB
* Return the saved user (which will also include user id added by MongoDB) back
* as a response with 201 Status (Content Created)
*/
userRouter.post('/', async (request, response) => {
	const body = request.body

	if (body.password.length < 3)
		return response.status(400).json({ error: 'password should have length atleast 3' })

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const userObject = new User({
		username: body.username,
		passwordHash,
		name: body.name
	})

	const savedUser = await userObject.save()

	const userForToken = {
		username: savedUser.username,
		id: savedUser.id
	}

	const token = jwt.sign(userForToken, config.SECRET)

	response.status(201).send({ token, username: savedUser.username, name: savedUser.name, id: savedUser.id })
})

module.exports = userRouter