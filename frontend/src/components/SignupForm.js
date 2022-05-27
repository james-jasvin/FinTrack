import React, { useState } from 'react'

/*
  This component renders the Signup Form with all its functionalities and provides an option
  for switching to the Login Form on a button click
*/
const SignupForm = ({ startSignup, showLoginForm, setShowLoginForm }) => {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ name, setName ] = useState('')

  // Error message to be displayed when username contains non-letters or digits
  const username_error_message = 'Username should have atleast three characters. Must begin with a letter and can contain letters and digits only'

  const handleSignup = (event) => {
    event.preventDefault()

    // If user bypassed pattern attribute on frontend, then block the signup attempt here and display the same
    // customValidity message on the username form input element
    if (!username.match(RegExp(/^[a-z][a-z\d]{2,}$/i)))
      document.getElementById('signup-username').setCustomValidity(username_error_message)
    else
      document.getElementById('signup-username').setCustomValidity('')

    const credentials= {
      username, password, name
    }

    // 2nd parameter, isLogin = false
    startSignup(credentials, false)

    setUsername('')
    setPassword('')
    setName('')
  }

  /*
    We assign a pattern attribute to username field so that we can check the following criteria for a username
    - Contains only letters and digits
    - Must start with a letter
    - Must have length atleast 3
    
    And we assign the above custom error message if this pattern check fails via the onInvalid event handler
    The onInput event handler ensures that the customValidity message is reset otherwise form can never be submitted
    once the onInvalid event was triggered
  */
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
          <form onSubmit={handleSignup} id='signup-form'>

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
                id='signup-username' 
                pattern='^[a-zA-Z][a-zA-Z\d]{2,}$'
                onInvalid={event => event.target.setCustomValidity(username_error_message)}
                onInput={event => event.target.setCustomValidity('')}
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
                id='signup-password'
                required
              />
            </div>

            <div className='input-group mb-3'>
              <div className='input-group-prepend'>
                <span className='input-group-text'><i className='fa fa-user-secret'></i></span>
              </div>
              <input
                type='text'
                className='form-control'
                placeholder='Name'
                value={name}
                onChange={event => setName(event.target.value)}
                id='signup-name'
                required
              />
            </div>

            <button type='submit' className='btn btn-primary btn-block' id='login-submit'>SIGNUP</button>
            <button
              type='button'
              className='btn btn-secondary btn-block'
              id='login-submit'
              onClick={() => setShowLoginForm(!showLoginForm)}
            >
              LOGIN INSTEAD
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignupForm