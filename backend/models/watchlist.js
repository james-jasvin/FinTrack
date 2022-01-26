const mongoose = require('mongoose')

const watchlistSchema = new mongoose.Schema({
	name: { type: String, required: true },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	instruments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Instrument'
		}
	]
})

watchlistSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Blog', watchlistSchema)