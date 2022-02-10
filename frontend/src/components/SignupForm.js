import React, { useState } from 'react'

const SignupForm = ({ startSignup }) => {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ name, setName ] = useState('')

  const handleSignup = (event) => {
    event.preventDefault()

    const credentials= {
      username, password, name
    }

    // 2nd parameter, isLogin = false
    startSignup(credentials, false)

    setUsername('')
    setPassword('')
    setName('')
  }

  return (
    <div>
      <h3>signup</h3>
      <form onSubmit={handleSignup} id='signup-form'>
        <div>
          username: <input value={username} onChange={event => setUsername(event.target.value)} type='text' id='signup-username' required/>
        </div>

        <div>
          password: <input value={password} onChange={event => setPassword(event.target.value)} type='password' id='signup-password' required/>
        </div>

        <div>
          name: <input value={name} onChange={event => setName(event.target.value)} type='text' id='signup-name' required/>
        </div>

        <button type='submit' id='signup-submit'>signup</button>
      </form>
    </div>
  )
}

export default SignupForm