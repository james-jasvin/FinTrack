import axios from 'axios'
const config = require('../config')

const watchlistUrl = `${config.BACKEND_URL}/api/watchlists`
const instrumentUrl = `${config.BACKEND_URL}/api/instruments`
const watchlistInstrumentUrl = `${config.BACKEND_URL}/api/watchlistInstruments`

let token = null

const setToken = () => {
  const user = JSON.parse(window.localStorage.getItem('loggedInUser'))
  token = user.token
}

// Gets watchlist data by watchlistId
const getWatchlistData = async (watchlistId) => {
  // All services which require token authentication will first call setToken() so that we can add the token
  // in the Authorization header packet
  setToken()

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Fetch given watchlist data
  let response = await axios.get(`${watchlistUrl}/${watchlistId}`, config)

  // If invalid watchlist id was supplied then return null as the watchlist data
  if (response.status === 404)
    return null

  const watchlist = response.data
  
  // Fetch watchlist instruments data
  response = await axios.get(`${watchlistInstrumentUrl}?watchlistId=${watchlistId}`, config) 
  watchlist.instruments = response.data

  return watchlist
}

// Gets all watchlists which belong to a user
const getUserWatchlistData = async (user) => {
  setToken()

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Get watchlists of given user
  const response = await axios.get(`${watchlistUrl}?user=${user.id}`, config)
  const watchlists = response.data

  // For each watchlist, fetch its watchlisInstruments and attach them to that watchlist with the property name "instruments"
  await watchlists.forEach(async (w, idx) => {
    const cur_response = await axios.get(`${watchlistInstrumentUrl}?watchlistId=${w.id}`, config)
    watchlists[idx].instruments = cur_response.data
  })

  return watchlists
}

// No token required for this route
const getInstrumentData = async () => {
  const response = await axios.get(instrumentUrl)
  return response.data
}

const createWatchlist = async (watchlist) => {
  setToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.post(watchlistUrl, watchlist, config)
  return response.data
}

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

const deleteWatchlistInstrument = async (watchlistInstrument) => {
  setToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.delete(`${watchlistInstrumentUrl}/${watchlistInstrument.id}`, config)
  return response.data
}

const addWatchlistInstrument = async (watchlistInstrument) => {
  setToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.post(watchlistInstrumentUrl, watchlistInstrument, config)
  return response.data
}

const exportObject = { getWatchlistData, getUserWatchlistData, getInstrumentData, createWatchlist, deleteWatchlist, deleteWatchlistInstrument, addWatchlistInstrument }

export default exportObject