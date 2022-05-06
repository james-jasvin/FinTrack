const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Watchlist = require('../models/watchlist')
const WatchlistInstrument = require('../models/watchlistInstrument')
const User = require('../models/user')
const api = supertest(app)
const helper = require('./tests_helper')

let user = null
let watchlistsStored = null

beforeEach(async () => {
  // Increasing timeout otherwise sometimes a timeout error can wreck the whole testing phase
  jest.setTimeout(30000) 

  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
	await Watchlist.deleteMany({})
  await WatchlistInstrument.deleteMany({})

	user = await api
		.post('/api/login')
		.send(helper.loginUser)

	for (let watchlist of helper.initialWatchlists) {
    const watchlistObject = new Watchlist(watchlist)
    await watchlistObject.save()
	}

  for (let watchlistInstrument of helper.initialWatchlistInstruments) {
    const watchlistInstrumentObject = new WatchlistInstrument(watchlistInstrument)
    await watchlistInstrumentObject.save()
	}

  watchlistsStored = await helper.watchlistsInDb()
})

describe('viewing a watchlist\'s instruments', () => {
	test('watchlistInstrument object has id property instead of _id', async () => {
		const id = watchlistsStored[0].id

		const response = await api
      .get(`/api/watchlistInstruments?watchlistId=${id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

		expect(response.body[0].id).toBeDefined()
		expect(response.body[0]._id).toBeUndefined()
		expect(response.body[0].__v).toBeUndefined()
	})

	test('total instruments contained are 1', async () => {
    const id = watchlistsStored[0].id.toString()

		const response = await api
      .get(`/api/watchlistInstruments?watchlistId=${id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

		expect(response.body).toHaveLength(1)
	})

  test('cannot view watchlists without bearer token', async () => {
		const id = watchlistsStored[0].id

		const response = await api
      .get(`/api/watchlistInstruments?watchlistId=${id}`)
      .expect(401)
	})
})

describe('adding a watchlist instrument', () => {
	test('new watchlist instrument is created successfully', async () => {
		const watchlistInstrument = {
      'watchlistId': '626bbee982df749de111a4ca',
      'instrumentId': '626bae84e8e209ce46777196'
    }

    const prevResponse = await api
    .get(`/api/watchlistInstruments?watchlistId=${watchlistsStored[0].id}`)
    .set('Authorization', `Bearer ${user.body.token}`)

		await api
			.post('/api/watchlistInstruments')
			.send(watchlistInstrument)
			.set('Authorization', `Bearer ${user.body.token}`)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api
      .get(`/api/watchlistInstruments?watchlistId=${watchlistsStored[0].id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

		expect(response.body).toHaveLength(prevResponse.body.length + 1)

		const instrumentIds = response.body.map(wI => wI.instrumentId)
		expect(instrumentIds).toContain('626bae84e8e209ce46777196')
	})

  test('watchlist instrument with missing instrumentId gets 400 response', async () => {
		const watchlistInstrument = {
      'watchlistId': '626bbee982df749de111a4ca'
    }

		await api
			.post('/api/watchlistInstruments')
			.send(watchlistInstrument)
			.set('Authorization', `Bearer ${user.body.token}`)
			.expect(400)
	})

  test('stock instrument cannot be added to mf watchlist', async () => {
		const watchlistInstrument = {
      'watchlistId': '626bbee982df749de111a4ca',
      'instrumentId': '626bae84e8e209ce46777194'
    }

		await api
			.post('/api/watchlistInstruments')
			.send(watchlistInstrument)
			.set('Authorization', `Bearer ${user.body.token}`)
			.expect(400)
	})

  test('mf instrument cannot be added to stock watchlist', async () => {
		const watchlistInstrument = {
      'watchlistId': '626bbeea82df749de111a4d0',
      'instrumentId': '626bae84e8e209ce46777196'
    }

		await api
			.post('/api/watchlistInstruments')
			.send(watchlistInstrument)
			.set('Authorization', `Bearer ${user.body.token}`)
			.expect(400)
	})

  test('cannot add same instrument twice in the same watchlist', async () => {
		const watchlistInstrument = {
      'watchlistId': '626bbee982df749de111a4ca',
      'instrumentId': '626bae84e8e209ce46777192'
    }

		await api
			.post('/api/watchlistInstruments')
			.send(watchlistInstrument)
			.set('Authorization', `Bearer ${user.body.token}`)
			.expect(400)
	})
})

describe('deleting a watchlist instrument', () => {
	test('existing watchlist instrument is deleted successfully', async () => {
		const watchlistInstrumentsStored = await helper.watchlistInstrumentsInDb()
		const id = watchlistInstrumentsStored[0].id
		
    await api
			.delete(`/api/watchlistInstruments/${id}`)
			.set('Authorization', `Bearer ${user.body.token}`)
			.expect(201)

		await api
      .get(`/api/watchlists/${id}`)
      .set('Authorization', `Bearer ${user.body.token}`)
			.expect(404)
	})

	test('non-existing watchlist returns 404', async () => {
		const fakeId = await helper.nonExistingId()
		await api
			.delete(`/api/watchlistInstruments/${fakeId}`)
      .set('Authorization', `Bearer ${user.body.token}`)
			.expect(404)
	})
})

describe('deleting all instruments of a watchlist', () => {
	test('deletion happens successfully', async () => {
		const id = watchlistsStored[0].id

    await api
			.delete(`/api/watchlistInstruments?watchlistId=${id}`)
			.set('Authorization', `Bearer ${user.body.token}`)
			.expect(201)

    const response = await api
      .get(`/api/watchlistInstruments?watchlistId=${id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

    expect(response.body).toHaveLength(0)
	})

	test('non-existing watchlist returns 404', async () => {
		const fakeId = await helper.nonExistingId()
		await api
			.delete(`/api/watchlistInstruments/?watchlistId=${fakeId}`)
      .set('Authorization', `Bearer ${user.body.token}`)
			.expect(404)
	})
})

afterAll(() => {
	mongoose.connection.close()
})