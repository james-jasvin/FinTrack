// TODO: 
// Add Delete Watchlist option
// Add delete instruments from a particular Watchlist option
// Look into using React Router for a separate Watchlist view page so that watchlists can become shareable
// Implement Searching module as a separate view with the help of React Router
// Or you can implement Searching as a component of a Watchlist itself

import React, { useState, useEffect, useRef } from 'react'

import watchlistService from './services/watchlists'
import loginService from './services/login'

import Notification from './components/Notification'
import LoginMessage from './components/LoginMessage'
import Toggleable from './components/Toggleable'

import Watchlists from './components/Watchlists'

import WatchlistForm from './components/WatchlistForm'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

const App = () => {
  // user state will store the logged in user object, if no login has been done yet then it will be null
  const [ user, setUser ] = useState(null)

  // If no user is logged yet, then show login form by default and provide a button to switch to signup form if required
  // Which form is displayed is controlled by the showLoginForm state, if true then show login form, else show signup form
  const [ showLoginForm, setShowLoginForm ] = useState(true)

  // Will store the watchlists of logged in user
  const [ watchlists, setWatchlists ] = useState([])

  // Will store the instruments in the entire database
  const [ instruments, setInstruments ] = useState([])

  // These states are used to control the notifications that show up at the top of the screen for events like login, signup, watchlist creation, etc.
  const [ notification, setNotification ] = useState(null)
  const [ notificationType, setNotificationType ] = useState(null)

  const watchlistFormRef = useRef()

  // Create a notification at the top of the screen with given message for 5 seconds 
  // Notifications are of two types, "error" and "success"
  // The appearance of these two notifications can be adjusted in the .css file
  const notificationHandler = (message, type) => {
    setNotification(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotificationType(null)
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (credentials, isLogin) => {
    try {
      const userObject = await loginService.login(credentials, isLogin)
      setUser(userObject)

      window.localStorage.setItem('loggedInUser', JSON.stringify(userObject))

      if (isLogin)
        notificationHandler(`logged in successfully as ${userObject.name}`, 'success')
      else
        notificationHandler(`signed up successfully as ${userObject.name}`, 'success')
    }
    catch (exception) {
      notificationHandler(exception.response.data.error, 'error')
    }
  }

  const createWatchlist = async (watchlistObject) => {
    try {
      watchlistFormRef.current.toggleVisibility()
      const createdWatchlist = await watchlistService.createWatchlist(watchlistObject)

      // Add empty list of instruments to the watchlist because it is not stored at the backend but is required at the frontend
      createdWatchlist.instruments = []

      setWatchlists(watchlists.concat(createdWatchlist))

      notificationHandler(`a new ${createdWatchlist.isMF? 'MF':'stocks'} watchlist "${createdWatchlist.name}" has been successfully created`, 'success')
    }
    catch (exception) {
      notificationHandler(exception.response.data.error, 'error')
    }
  }

  // const handleLike = async (blogObject) => {
  //   try {
  //     await blogService.update(blogObject)
  //     setBlogs(blogs.map(blog => blog.id === blogObject.id? blogObject: blog))
  //   }
  //   catch (exception) {
  //     notificationHandler(exception.response.data.error, 'error')
  //   }
  // }

  const removeWatchlist = async (watchlistObject) => {
    try {
      await watchlistService.deleteWatchlist(watchlistObject)
      setWatchlists(watchlists.filter(watchlist => watchlist.id !== watchlistObject.id))
      notificationHandler(`Successfully deleted the "${watchlistObject.name}" watchlist`, 'success')
    }
    catch (exception) {
      notificationHandler(exception.response.data.error, 'error')
    }
  }

  useEffect(() => {
    watchlistService
      .getInstrumentData()
      .then(data => {
        setInstruments(data)
      })
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser)
      setUser(JSON.parse(loggedInUser))
  }, [])

  useEffect(() => {
    if (user) {
      watchlistService
      .getUserWatchlistData(user)
      .then(data => {
        setWatchlists(data)
      })
    }
  }, [user])

  return (
    <div>
      <h2> fintrack </h2>
      <Notification notification={notification} type={notificationType} />
      <LoginMessage user={user} setUser={setUser}/>
      
      { user === null && showLoginForm && <LoginForm startLogin={handleLogin}/> }
      { user === null && showLoginForm === false && <SignupForm startSignup={handleLogin}/> }
      { user === null && <button onClick={() => setShowLoginForm(!showLoginForm)}>{showLoginForm? 'signup instead': 'login instead'}</button> }

      {
        user !== null &&
        <Toggleable buttonLabel={'create a watchlist'} ref={watchlistFormRef}>
          <WatchlistForm createWatchlist={createWatchlist} />
        </Toggleable>
      }

      <div>
        { user !== null? <Watchlists watchlists={watchlists} removeWatchlist={removeWatchlist}/>: '' }
      </div>
    </div>
  )
}

export default App