import React, { useState } from 'react'

const SignupForm = ({ startSignup, showLoginForm, setShowLoginForm }) => {
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
    <div className='form-container'>
      <div className='form-box'>
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
                <span className='input-group-text'><i class='fa fa-user'></i></span>
              </div>
              <input type='text' className='form-control' placeholder='Username' value={username} onChange={event => setUsername(event.target.value)} id='signup-username' required/>
            </div>

            <div className='input-group mb-3'>
              <div className='input-group-prepend'>
                <span className='input-group-text'><i class='fa fa-lock'></i></span>
              </div>
              <input type='password' className='form-control' placeholder='Password' value={password} onChange={event => setPassword(event.target.value)} id='signup-password' required/>
            </div>

            <div className='input-group mb-3'>
              <div className='input-group-prepend'>
                <span className='input-group-text'><i class='fa fa-user-secret'></i></span>
              </div>
              <input type='text' className='form-control' placeholder='Name' value={name} onChange={event => setName(event.target.value)} id='signup-name' required/>
            </div>

            <button type='submit' className='btn btn-primary btn-block' id='login-submit'>SIGNUP</button>
            <button type='button' className='btn btn-secondary btn-block' id='login-submit' onClick={() => setShowLoginForm(!showLoginForm)}>LOGIN INSTEAD</button>

          </form>
          {/* <div className="social">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter-square"></i></a>
            <a href="#"><i className="fab fa-google"></i></a>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default SignupForm