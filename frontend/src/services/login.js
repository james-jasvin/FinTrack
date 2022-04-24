import axios from 'axios'
const config = require('../config')

const loginBaseUrl = `${config.BACKEND_URL}/api/login`
const signupBaseUrl = `${config.BACKEND_URL}/api/users/`

const login = async (credentials, isLogin) => {
  let response = ""
  
  if (isLogin)
    response = await axios.post(loginBaseUrl, credentials)
  else
    response = await axios.post(signupBaseUrl, credentials)

  return response.data
}

const exportObject = { login }

export default exportObject