import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = ({ user, setUser }) => {
  const logout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  if (!user)
    return null

  return (
    <div className='regular-shadow mb-1'>
      <nav className="navbar navbar-expand-lg navbar-dark" id="menu">
        <button className="navbar-brand btn btn-link border border-light p-2">Welcome, {user.name}</button>
        
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" to="/search">Search</Link>
            </li>
          </ul>
          
          <div className='inline my-2 my-lg-0'><button className='btn btn-primary' onClick={logout}>Logout</button></div>
        </div>
      </nav>
    </div>
  )
}

export default NavBar