import axios from 'axios'

const loginBaseUrl = '/api/login'
const signupBaseUrl = '/api/users'

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