const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Watchlist = require('../models/watchlist')
const User = require('../models/user')
const api = supertest(app)
const helper = require('./tests_helper')

let user = null

beforeEach(async () => {
  // Increasing timeout otherwise sometimes a timeout error can wreck the whole testing phase
  jest.setTimeout(30000) 

  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
	await Watchlist.deleteMany({})

	user = await api
		.post('/api/login')
		.send(helper.loginUser)

	for (let watchlist of helper.initialWatchlists) {
		await api
			.post('/api/watchlists')
			.send(watchlist)
			.set('Authorization', `Bearer ${user.body.token}`)
	}
})

describe('viewing a user\'s watchlists', () => {
	test('watchlist object has id property instead of _id', async () => {
		const response = await api
      .get(`/api/watchlists?user=${user.body.id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

		expect(response.body[0].id).toBeDefined()
		expect(response.body[0]._id).toBeUndefined()
		expect(response.body[0].__v).toBeUndefined()
	})

	test('total watchlists contained are 4', async () => {
		const response = await api
      .get(`/api/watchlists?user=${user.body.id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

		expect(response.body).toHaveLength(4)
	})

  test('cannot view watchlists without bearer token', async () => {
		await api
      .get(`/api/watchlists?user=${user.body.id}`)
      .expect(401)
	})
})

describe('viewing a single watchlist', () => {
	test('existing watchlist can be viewed successfully', async () => {
		const watchlistsStored = await helper.watchlistsInDb()
		const response = await api
      .get(`/api/watchlists/${watchlistsStored[0].id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

		expect(response.body.name).toBe('Test Watchlist 1: MF')
	})

  test('existing watchlist cannot be viewed without bearer token', async () => {
		const watchlistsStored = await helper.watchlistsInDb()
		await api
      .get(`/api/watchlists/${watchlistsStored[0].id}`)
      .expect(401)
	})

	test('non-existing watchlist returns 404', async () => {
		const fakeId = await helper.nonExistingId()
		await api
			.get(`/api/watchlists/${fakeId}`).set('Authorization', `Bearer ${user.body.token}`)
			.expect(404)
	})
})

describe('adding a watchlist', () => {
	test('new watchlist is created successfully', async () => {
		const watchlist = {
      'name': 'Test Watchlist 69',
      'isMF': true
    }

		await api
			.post('/api/watchlists')
			.send(watchlist)
			.set('Authorization', `Bearer ${user.body.token}`)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api
      .get(`/api/watchlists?user=${user.body.id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

		expect(response.body).toHaveLength(helper.initialWatchlists.length + 1)

		const watchlistNames = response.body.map(w => w.name)
		expect(watchlistNames).toContain('Test Watchlist 69')
	})

	test('watchlist object with missing name gets 400 response', async () => {
		const watchlist = {
      'isMF': true
    }

		await api
			.post('/api/watchlists')
			.send(watchlist)
			.set('Authorization', `Bearer ${user.body.token}`)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const response = await api
      .get(`/api/watchlists?user=${user.body.id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

		expect(response.body).toHaveLength(helper.initialWatchlists.length)
	})

	test('watchlist object with missing isMF parameter gets 400 response', async () => {
		const watchlist = {
      'name': 'Test Watchlist 420'
    }

		await api
			.post('/api/watchlists')
			.send(watchlist)
			.set('Authorization', `Bearer ${user.body.token}`)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const response = await api
      .get(`/api/watchlists?user=${user.body.id}`)
      .set('Authorization', `Bearer ${user.body.token}`)

		expect(response.body).toHaveLength(helper.initialWatchlists.length)
	})
})

describe('deleting a watchlist', () => {
	test('existing watchlist is deleted successfully', async () => {
		const watchlistsStored = await helper.watchlistsInDb()
		const id = watchlistsStored[0].id
		
    await api
			.delete(`/api/watchlists/${id}`)
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
			.delete(`/api/watchlists/${fakeId}`)
      .set('Authorization', `Bearer ${user.body.token}`)
			.expect(404)
	})
})

afterAll(() => {
	mongoose.connection.close()
})