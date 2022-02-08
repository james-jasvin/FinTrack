// TODO: Update all URLs to match Express backend
// Require backend route for searching by user id, like, /api/watchlists?user={user.id}
// Also add token authentication to the above route

import axios from 'axios'
 
// const watchlistUrl = '/api/watchlists/'
const watchlistUrl = 'http://localhost:3001/watchlists'
// const instrumentUrl = '/api/instruments/'
const instrumentUrl = 'http://localhost:3001/instruments'


// const baseUrl = 'http://localhost:3001/'

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

// const create = async (blog) => {
//   setToken()
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   }

//   const response = await axios.post(baseUrl, blog, config)
//   return response.data
// }

// const update = async (blog) => {
//   const response = await axios.put(`${baseUrl}/${blog.id}`, blog)
//   return response.data
// }

// const deleteBlog = async (blog) => {
//   setToken()
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   }

//   const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
//   return response.data
// }

const exportObject = { getUserWatchlistData, getInstrumentData }

export default exportObject