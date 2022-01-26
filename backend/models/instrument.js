const mongoose = require('mongoose')

const instrumentSchema = new mongoose.Schema({
	symbol: { type: String, required: true, unique: true },
	name: String,
	isMF: { type: Boolean, required: true },
	url: { type: String, required: true }
})

instrumentSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Instrument', instrumentSchema)