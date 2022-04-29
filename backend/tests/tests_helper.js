const mongoose = require('mongoose')
const Watchlist = require('../models/watchlist')
const WatchlistInstrument = require('../models/watchlistInstrument')
const User = require('../models/user')

/* 
  MongoDB IDs for Reference
  * TCS: 626bae84e8e209ce46777190
  * INFY: 626bae84e8e209ce46777191
  * M_AXLB: 626bae84e8e209ce46777192
  * SBIN: 626bae84e8e209ce46777193
  * LT: 626bae84e8e209ce46777194
  * M_TADL: 626bae84e8e209ce46777195
  * M_PARO: 626bae84e8e209ce46777196
  * MF 1: 626bbee982df749de111a4ca
  * MF 2: 626bbee982df749de111a4cd
  * Stocks 1: 626bbeea82df749de111a4d0
  * Stocks 2: 626bbeea82df749de111a4d3
*/

const initialWatchlists = [
	{
		'name': 'Test Watchlist 1: MF',
		'isMF': true,
    '_id': new mongoose.Types.ObjectId('626bbee982df749de111a4ca')
	},
	{
		'name': 'Test Watchlist 2: Stocks',
		'isMF': false,
    '_id': new mongoose.Types.ObjectId('626bbee982df749de111a4cd')
	},
	{
		'name': 'Test Watchlist 3: MF',
		'isMF': false,
    '_id': new mongoose.Types.ObjectId('626bbeea82df749de111a4d0')
	},
	{
		'name': 'Test Watchlist 4: Stocks',
		'isMF': true,
    '_id': new mongoose.Types.ObjectId('626bbeea82df749de111a4d3')
	}
]

const initialWatchlistInstruments = [
  {
    'instrument': new mongoose.Types.ObjectId('626bae84e8e209ce46777190'),
    'watchlist': new mongoose.Types.ObjectId('626bbeea82df749de111a4d0')
  },
  {
    'instrument': new mongoose.Types.ObjectId('626bae84e8e209ce46777190'),
    'watchlist': new mongoose.Types.ObjectId('626bbeea82df749de111a4d3')
  },
  {
    'instrument': new mongoose.Types.ObjectId('626bae84e8e209ce46777193'),
    'watchlist': new mongoose.Types.ObjectId('626bbeea82df749de111a4d0')
  },
  {
    'instrument': new mongoose.Types.ObjectId('626bae84e8e209ce46777192'),
    'watchlist': new mongoose.Types.ObjectId('626bbeea82df749de111a4d3')
  },
  {
    'instrument': new mongoose.Types.ObjectId('626bae84e8e209ce46777192'),
    'watchlist': new mongoose.Types.ObjectId('626bbee982df749de111a4ca')
  },
  {
    'instrument': new mongoose.Types.ObjectId('626bae84e8e209ce46777195'),
    'watchlist': new mongoose.Types.ObjectId('626bbee982df749de111a4cd')
  }
]

const initialUsers = [
	{
		'username': 'User',
		'name': 'User',
		'passwordHash': '$2b$10$qOh8NttvxCvGkWQw6Az.gOQh0pszN4IasMIevYwxzxAdBydtHAMby'
	},
	{
		'username': 'Sal',
		'name': 'Sal Vulcano',
		'passwordHash': '$2b$10$kBdiRopuK.U74Ok9yvKRgewe9LU9h3SFihycza6Vdokkb2QNFteN.'
	}
]

const loginUser = {
	'username': 'Sal',
	'password': '123456'
}

const watchlistsInDb = async () => {
	const watchlists = await Watchlist.find({})
	return watchlists.map(w => w.toJSON())
}

const watchlistInstrumentsInDb = async () => {
	const watchlistInstruments = await WatchlistInstrument.find({})
	return watchlistInstruments.map(w => w.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(user => user.toJSON())
}

const nonExistingId = async () => {
	const watchlist = new Watchlist({ name: 'willremovethissoon', isMF: false })
	await watchlist.save()
	await watchlist.remove()
	return watchlist._id.toString()
}

module.exports = {
	initialWatchlists, initialUsers, initialWatchlistInstruments, nonExistingId,
  watchlistsInDb, watchlistInstrumentsInDb, usersInDb, loginUser
}