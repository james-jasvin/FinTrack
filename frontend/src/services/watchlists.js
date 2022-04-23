// TODO: Update all URLs to match Express backend
// Require backend route for searching by user id, like, /api/watchlists?user={user.id} (populate watchlists with instrument data)
// Also add token authentication to the above route

import axios from 'axios'
const config = require('../config')

// Uncomment the /api/ URLs and remove the non-/api/ URLs once the backend is ready

const watchlistUrl = `${config.BACKEND_URL}/api/watchlists`
// const watchlistUrl = `${config.BACKEND_URL}/watchlists`

const instrumentUrl = `${config.BACKEND_URL}/api/instruments`
// const instrumentUrl = `${config.BACKEND_URL}/instruments`

const watchlistInstrumentUrl = `/api/watchlistInstruments`
// const watchlistInstrumentUrl = `${config.BACKEND_URL}/watchlistInstruments`

// const ttStockPriceUrl = 'https://quotes-api.tickertape.in/quotes?sids='
// const ttMFPriceUrl = 'https://api.tickertape.in/mutualfunds/'  // Example of complete URL: https://api.tickertape.in/mutualfunds/M_TAIM/info

let token = null

const setToken = () => {
  const user = JSON.parse(window.localStorage.getItem('loggedInUser'))
  token = user.token
}

const getWatchlistData = async (watchlistId) => {
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


  // For each watchlist, get the corresponding instruments in it and attach it as a list with property name "instruments"
  watchlists.forEach(async (w, idx) => {
    const cur_response = await axios.get(`${watchlistInstrumentUrl}?watchlistId=${w.id}`, config)
    watchlists[idx].instruments = cur_response.data

    // This section fetches instrument price data from external APIs but there's CORS issues right now, so commented it out
    // watchlists[idx].instruments.forEach(async (ins, index) => {
    //   let tt_response = null
    //   if (ins.isMF) {
    //     // tt_response = await axios.get(ttMFPriceUrl + `${ins.symbol}/info`)
    //     tt_response = await axios.get('https://restcountries.eu/rest/v2/all')
        
    //     console.log(tt_response.data)
    //   }
    //   else {
    //     // tt_response = await axios.get(ttStockPriceUrl + ins.symbol)
    //     tt_response = await axios.get('https://restcountries.eu/rest/v2/all')
    //     console.log(tt_response.data)
    //   }
    // })
    
  })

  return watchlists
}

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

  // TODO: This is temporary solution for json-server compatibility
  // Once Express backend is configured, just remove this code snippet and the method should still work fine
  // because backend will use the token to verify authenticity instead of user id which is required for json-server
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

const deleteWatchlist = async (watchlist) => {
  setToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.delete(`${watchlistUrl}/${watchlist.id}`, config)
  // Add request to delete WatchlistInstruments which have watchlistId=${watchlist.id}
  // Something like, DELETE /api/watchlistInstruments?watchlistId=${watchlist.id}
  // Use the deleteMany() function in Mongoose to achieve this in the backend
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
  // Add request to delete WatchlistInstruments which have watchlistId=${watchlist.id}
  // Something like, DELETE /api/watchlistInstruments?watchlistId=${watchlist.id}
  // Use the deleteMany() function in Mongoose to achieve this in the backend
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

  // Add request to delete WatchlistInstruments which have watchlistId=${watchlist.id}
  // Something like, DELETE /api/watchlistInstruments?watchlistId=${watchlist.id}
  // Use the deleteMany() function in Mongoose to achieve this in the backend
  return response.data
}

const exportObject = { getWatchlistData, getUserWatchlistData, getInstrumentData, createWatchlist, deleteWatchlist, deleteWatchlistInstrument, addWatchlistInstrument }

export default exportObject