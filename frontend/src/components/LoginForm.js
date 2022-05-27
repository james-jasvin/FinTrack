import React, { useState } from 'react'

/*
  This component renders the Login Form with all its functionalities and provides an option
  for switching to the Signup Form on a button click
*/
const LoginForm = ({ startLogin, showLoginForm, setShowLoginForm }) => {
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
    <div className='form-container'>
      <div className='form-box regular-shadow'>

        <div className='header-form'>
          <h4 className='text-primary text-center'>
            <i className='fa fa-user-circle' style={{fontSize:'110px', color: 'lightblue'}}></i>
          </h4>
          <div className='image'></div>
        </div>

        <div className='body-form'>
          <form onSubmit={handleLogin} id='login-form'>

            <div className='input-group mb-3'>
              <div className='input-group-prepend'>
                <span className='input-group-text'><i className='fa fa-user'></i></span>
              </div>
              <input 
                type='text'
                className='form-control'
                placeholder='Username'
                value={username}
                onChange={event => setUsername(event.target.value)}
                id='username'
                required
              />
            </div>

            <div className='input-group mb-3'>
              <div className='input-group-prepend'>
                <span className='input-group-text'><i className='fa fa-lock'></i></span>
              </div>
              <input
                type='password'
                className='form-control'
                placeholder='Password'
                value={password}
                onChange={event => setPassword(event.target.value)}
                id='password'
                required
              />
            </div>

            <button type='submit' className='btn btn-primary btn-block' id='login-submit'>LOGIN</button>
            {/* Button to switch Login Form to Signup Form if clicked */}
            <button
              type='button'
              className='btn btn-secondary btn-block'
              id='login-submit'
              onClick={() => setShowLoginForm(!showLoginForm)}
            >
              SIGNUP INSTEAD
            </button>
          </form>
        </div>
      </div>
    </div>   
  )
}

export default LoginForm