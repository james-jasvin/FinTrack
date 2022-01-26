import React from 'react'

const LoginMessage = ({ user, setUser }) => {
  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }
  if (!user)
    return null

  return (
    <div>
      {user.name} logged in <button onClick={logout}>logout</button>
    </div>
  )
}

export default LoginMessage