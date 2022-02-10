import React, { useState } from 'react'

const LoginForm = ({ startLogin }) => {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()

    const credentials = {
      username, password
    }

    // 2nd parameter, isLogin = true      
    startLogin(credentials, true)

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h3>login</h3>
      <form onSubmit={handleLogin} id='login-form'>
        <div>
          username: <input value={username} onChange={event => setUsername(event.target.value)} type='text' id='username' required/>
        </div>

        <div>
          password: <input value={password} onChange={event => setPassword(event.target.value)} type='password' id='password' required/>
        </div>

        <button type='submit' id='login-submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm