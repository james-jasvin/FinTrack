const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, minLength: 3, unique: true },
	name: { type: String, required: true },
	passwordHash: { type: String, required: true },
})

/*
	Function that will be executed when a User's MongoDB entry is converted into JSON
	That is why we delete passwordHash in order to avoid exposing even the hash to the public
	Store MongoDB generated id field _id in id field and delete the auto-generated __v and _id fields
*/
userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)