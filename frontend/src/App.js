// TODO: 

// Can .env file contain actual IP address instead of localhost, perhaps can use Ansible playbook for this
// Get the IP Address from the inventory file or something

// Add footer and fancy stuff like that
// Can use reactjs-popup to replace the alert window dialog boxes
// Can add, react-alerts to replace the basic notification system that we have going on right now, but its a bit of a work to integrate

// Test with more stocks and MFs in the DB => Think of a method to add more instruments in the DB => Add API but what about security? Add admin login?
// Think of possibilities where elements can be deleted at backend but still appear at frontend, not added at frontend but already added at backend

// Fetch stock and MF prices from public APIs => CORS issue right now => Find public stock + MF API that provides access with API keys

// Topic of discussion, should users be able to view shared watchlists without logging in to an account?
// If yes, then GET watchlistInstruments and GET watchlists routes have to function without authentication
// If no, then current implementation works as it should

import React, { useState, useEffect, useRef } from 'react'

import watchlistService from './services/watchlists'
import loginService from './services/login'

import Notification from './components/Notification'

import Watchlists from './components/Watchlists'
import Watchlist from './components/Watchlist'
import Search from './components/Search'

import WatchlistForm from './components/WatchlistForm'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

import { 
  Switch, Route, useRouteMatch
} from 'react-router-dom'
import NavBar from './components/NavBar'


const App = () => {
  // user state will store the logged in user object, if no login has been done yet then it will be null
  const [ user, setUser ] = useState(null)

  // If no user is logged yet, then show login form by default and provide a button to switch to signup form if required
  // Which form is displayed is controlled by the showLoginForm state, if true then show login form, else show signup form
  const [ showLoginForm, setShowLoginForm ] = useState(true)

  // Will store the watchlists of logged in user
  const [ watchlists, setWatchlists ] = useState([])

  // Will store the watchlist of single watchlist view page
  const [ watchlist, setWatchlist ] = useState(null)

  // Will store the instruments in the entire database
  const [ instruments, setInstruments ] = useState([])

  // These states are used to control the notifications that show up at the top of the screen for events like login, signup, watchlist creation, etc.
  const [ notification, setNotification ] = useState(null)
  const [ notificationType, setNotificationType ] = useState(null)

  // A useRef hook to attach to Watchlist Form component, so that we can toggle the visibility of the form on and off
  const watchlistFormRef = useRef()

  // A useRouteMatch that will check whether the current page's route matches the pattern /watchlists/:id
  // match = Object that contains various information about route matched including the "id" in path, if route matched successfully
  // Else, match = null
  const match = useRouteMatch('/watchlists/:id')

  // Create a notification at the top of the screen with given message for 5 seconds 
  // Notifications are of two types, "error" and "success"
  // The appearance of these two notifications can be adjusted in the .css file
  const notificationHandler = (message, type) => {
    setNotification(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotificationType(null)
      setNotification(null)
    }, 10000)
  }

  const handleLogin = async (credentials, isLogin) => {
    try {
      const userObject = await loginService.login(credentials, isLogin)
      setUser(userObject)

      window.localStorage.setItem('loggedInUser', JSON.stringify(userObject))

      if (isLogin)
        notificationHandler(`Logged in successfully as ${userObject.name}`, 'success')
      else
        notificationHandler(`Signed up successfully as ${userObject.name}`, 'success')
    }
    catch (exception) {
      notificationHandler(exception.response.data.error, 'error')
    }
  }

  const createWatchlist = async (watchlistObject) => {
    try {
      const createdWatchlist = await watchlistService.createWatchlist(watchlistObject)

      // Add empty list of instruments to the watchlist because it is not stored at the backend but is required at the frontend
      createdWatchlist.instruments = []

      setWatchlists(watchlists.concat(createdWatchlist))

      notificationHandler(`A new ${createdWatchlist.isMF? 'MF':'Stocks'} watchlist "${createdWatchlist.name}" has been successfully created`, 'success')
    }
    catch (exception) {
      notificationHandler(exception.response.data.error, 'error')
    }
  }

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

  const removeWatchlistInstrument = async (watchlistInstrumentObject, watchlist) => {
    try {
      await watchlistService.deleteWatchlistInstrument(watchlistInstrumentObject)

      setWatchlists(
        watchlists.map(
          w => w.id !== watchlist.id? 
          w:
          {...w, instruments: w.instruments.filter(ins => ins.id !== watchlistInstrumentObject.id) }
      ))

      notificationHandler(`Successfully removed "${watchlistInstrumentObject.symbol}" from watchlist "${watchlist.name}"`, 'success')
    }
    catch (exception) {
      notificationHandler(exception.response.data.error, 'error')
    }
  }

  const addToWatchlist = async (watchlist, watchlistInstrument) => {
    try {
      const addedWatchlistInstrument = await watchlistService.addWatchlistInstrument(watchlistInstrument)

      // Append newly added instrument to the respective watchlist so that the frontend reflects the new state
      // Note that we attach the object that was returned by the backend instead of watchlistInstrument passed to the function
      setWatchlists(
        watchlists.map(
          w => w.id !== watchlist.id? 
          w:
          {...w, instruments: w.instruments.concat(addedWatchlistInstrument) }
      ))

      notificationHandler(`Successfully added "${watchlistInstrument.symbol}" to watchlist "${watchlist.name}"`, 'success')
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

  // Fetch specific watchlist data only if we are single watchlist view mode, i.e. /watchlists/:id route, so match !== null
  // Providing "match" as a parameter in the dependency array of the useEffect hook results in an infinite loop of getWatchlistData() being called
  // and crashing the system, so that's why dependency array is kept as empty
  useEffect(() => {
    if (match && user !== null) {
      watchlistService
      .getWatchlistData(match.params.id)
      .then(data => setWatchlist(data))
    }
  }, [user])
  

  return (
    <div>
      <div className='text-center page-header p-2 regular-text-shadow regular-shadow'>
          <div className='display-4 font-weight-bold'>
            F<small>IN</small>T<small>RACK</small> {' '}
            <i className='fa fa-cog fa-spin' aria-hidden='true'></i> {' '}
          </div>
          <h5>Share investment watchlists easily!</h5>
      </div>
      
      <Notification notification={notification} type={notificationType} />

      { user === null && showLoginForm && <LoginForm startLogin={handleLogin} showLoginForm={showLoginForm} setShowLoginForm={setShowLoginForm}/> }
      { user === null && showLoginForm === false && <SignupForm startSignup={handleLogin} showLoginForm={showLoginForm} setShowLoginForm={setShowLoginForm}/> }

      {
        user !== null && 
        <NavBar user={user} setUser={setUser}/>
      } 

      {
        user !== null &&
        <Switch>
          <Route path='/watchlists/:id'>
            <Watchlist watchlist={watchlist} removeWatchlist={null} removeWatchlistInstrument={null} />
          </Route>

          <Route path="/search">
            <Search instruments={instruments} watchlists={watchlists} addToWatchlist={addToWatchlist}/>
          </Route>

          <Route path="/">
            {/* <Toggleable buttonLabel={'Click Here!'} ref={watchlistFormRef}> */}
              <WatchlistForm createWatchlist={createWatchlist} />
            {/* </Toggleable> */}
            
            <Watchlists watchlists={watchlists} removeWatchlist={removeWatchlist} removeWatchlistInstrument={removeWatchlistInstrument} />
          </Route>

        </Switch>  
      }

      <footer className='footer rounded text-center p-2'>
        <span>Returd Gang 2022-23 &copy;</span>  
      </footer>

    </div>
  )
}

export default App