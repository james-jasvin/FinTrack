// TODO: Update all URLs to match Express backend
// Require backend route for searching by user id, like, /api/watchlists?user={user.id} (populate watchlists with instrument data)
// Also add token authentication to the above route

import axios from 'axios'
 
// const watchlistUrl = '/api/watchlists/'
const watchlistUrl = 'http://localhost:3001/watchlists'
// const instrumentUrl = '/api/instruments/'
const instrumentUrl = 'http://localhost:3001/instruments'

let token = null

const setToken = () => {
  const user = JSON.parse(window.localStorage.getItem('loggedInUser'))
  token = user.token
}

const getUserWatchlistData = async (user) => {
  setToken()

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.get(`${watchlistUrl}?/user=${user.id}`, config)

  return response.data
}

const getInstrumentData = async () => {
  const response = await axios.get(instrumentUrl)
  return response.data
}

const create = async (watchlist) => {
  setToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // TODO: This is temporary solution for json-server compatibility
  // Once Express backend is configured, just remove this code snippet and the method should still work fine!
  const user = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const tempWatchlist = {
    ...watchlist,
    "user": user.id
  }

  // Uncomment this line once backend is ready
  // const response = await axios.post(watchlistUrl, watchlist, config)
  const response = await axios.post(watchlistUrl, tempWatchlist, config)
  return response.data
}

// const update = async (blog) => {
//   const response = await axios.put(`${baseUrl}/${blog.id}`, blog)
//   return response.data
// }

const deleteWatchlist = async (watchlist) => {
  setToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.delete(`${watchlistUrl}/${watchlist.id}`, config)
  return response.data
}

const exportObject = { getUserWatchlistData, getInstrumentData, create, deleteWatchlist }

export default exportObject