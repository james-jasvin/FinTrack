/*
  Some things to note for future scope,
  
  Can use reactjs-popup to replace the alert window dialog boxes
  Can add react-alerts to replace the basic notification system that we have going on right now,
  but its a bit of a work to integrate so :P

  Test with more stocks and MFs in the DB => Think of a method to add more instruments in the DB via a portal
  => Add API but what about security? Add admin login?
  
  Think of possibilities where elements can be deleted at backend but still appear at frontend or
  not added at frontend but already added at backend

  The following point is invalid now because MongoDB objectIDs are no longer dependent on MAC address and things like that
  but still it's a nice point to note
  https://stackoverflow.com/questions/4587523/mongodb-is-it-safe-to-use-documents-id-in-public
  Don't store user id on localStorage, send only the JWT token, create a mapping from token to user id or extract
  user id from token & secret

  Add expiry timer to JWT tokens if possible
  Add better error messages in Notifications instead of straight up backend errors
  Use Guardrails to plug security vulnerabilities
  Use HashiCorp's Vault to not be dependent on Ansible Vault
  Can use TradingView as stock API to fetch stock prices & MFAPI.in for fetching MF prices (https://www.mfapi.in/)
  Use Sentry for monitoring instead of ELK
*/

import React, { useState, useEffect } from 'react'

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
  Switch, Route, useRouteMatch, Redirect
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

  // Will store the instruments of the entire database
  const [ instruments, setInstruments ] = useState([])

  // These states are used to control the notifications that show up at the top of the screen for events like 
  // login, signup, watchlist creation, etc.
  const [ notification, setNotification ] = useState(null)
  const [ notificationType, setNotificationType ] = useState(null)

  /* 
    A useRouteMatch that will check whether the current page's route matches the pattern /watchlists/:id
    match is an object that contains various information about the route matched
    including the "id" in path, if route matched successfully
    else, match = null
  */
  const match = useRouteMatch('/watchlists/:id')

  // Create a notification at the top of the screen with given message for 10 seconds 
  // Notifications are of two types, "error" and "success"
  // The appearance of these two notifications can be adjusted via the index.css file
  const notificationHandler = (message, type) => {
    setNotification(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotificationType(null)
      setNotification(null)
    }, 10000)
  }

  // Function that handles login as well as signup of users, isLogin = true => Login, else Signup
  const handleLogin = async (credentials, isLogin) => {
    try {
      const userObject = await loginService.login(credentials, isLogin)
      setUser(userObject)

      // Cache the logged in user to local storage so that it persists for the client and further logins can happen
      // automatically without the client having to type in the credentials.
      window.localStorage.setItem('loggedInUser', JSON.stringify(userObject))

      if (isLogin)
        notificationHandler(`Logged in successfully as ${userObject.name}`, 'success')
      else {
        notificationHandler(`Signed up successfully as ${userObject.name}`, 'success')

        /*
          This is to handle a very specific bug,
          If the client is logged in as a user, the watchlists state will contain that user's watchlists
          Now if the client signs up for another account, the watchlists state will still contain the old user's watchlists
          and will be able to see both which is an issue.
          This doesn't happen if client logs in to another account because that user will have their own watchlists
          which will be fetched via the Effect hook and accordingly setWatchlists will be called
        */
        setWatchlists([])
      }
        
    }
    catch (exception) {
      notificationHandler(exception.response.data.error, 'error')
    }
  }

  // Function that creates a new watchlist using the watchlistObject that is passed to the function
  const createWatchlist = async (watchlistObject) => {
    try {
      const createdWatchlist = await watchlistService.createWatchlist(watchlistObject)

      // Add empty list of instruments to the watchlist because this field will eventually be accessed at the frontend
      createdWatchlist.instruments = []

      setWatchlists(watchlists.concat(createdWatchlist))

      notificationHandler(`A new ${createdWatchlist.isMF? 'MF':'Stocks'} watchlist "${createdWatchlist.name}" has been successfully created`, 'success')
    }
    catch (exception) {
      notificationHandler(exception.response.data.error, 'error')
    }
  }

  // Function that deletes a watchlist using the watchlistObject that is passed to the function
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

  // Function that deletes a watchlistInstrument from a watchlist, both are given as parameters to the function
  const removeWatchlistInstrument = async (watchlistInstrumentObject, watchlist) => {
    try {
      await watchlistService.deleteWatchlistInstrument(watchlistInstrumentObject)

      // Iterate through all the watchlists, if watchlist id equal to id for watchlist from which watchlistInstrument was deleted,
      // Then iterate through all the instruments of that watchlist and filter out that watchlistInstrument which has been deleted
      // "...w" means leave all other fields of the affected watchlist as it is and only update the "instruments" field
      setWatchlists(
        watchlists.map(w =>
          w.id !== watchlist.id? w:
          {...w, instruments: w.instruments.filter(ins => ins.id !== watchlistInstrumentObject.id) }
      ))

      notificationHandler(`Successfully removed "${watchlistInstrumentObject.symbol}" from watchlist "${watchlist.name}"`, 'success')
    }
    catch (exception) {
      notificationHandler(exception.response.data.error, 'error')
    }
  }

  // Function that creates a new watchlistInstrument in a watchlist, both are given as parameters to the function
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

  // Effect Hook that fetches all the instruments in the database
  useEffect(() => {
    watchlistService
      .getInstrumentData()
      .then(data => {
        setInstruments(data)
      })
  }, [])

  // Effect Hook that parses the local storage for 'loggedInUser' and sets the "user" state if a valid match is found
  // This enables user to login automatically without having to type in the credentials. Caching the login if you will.
  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser)
      setUser(JSON.parse(loggedInUser))
  }, [])

  // Effect Hook that fetches a user's watchlists, if "user" state changes, then new watchlists must be fetched.
  // This is why "user" is part of the dependency array of this hook
  useEffect(() => {
    if (user) {
      watchlistService
      .getUserWatchlistData(user)
      .then(data => {
        setWatchlists(data)
      })
    }
  }, [user])

  /*
    Effect Hook that fetches specific watchlist data but only if we are single watchlist view mode,
    i.e. /watchlists/:id route, so match !== null
    If "user" state changes then watchlist data must be fetched again because the existing "watchlist" state will get cleared
    So the single-watchlist view will keep on loading the data but not be able to display anything because the Effect hook
    only gets executed on first render, i.e. when user == null
    So the Effect hook should trigger every time "user" state changes, so it is added to the dependency array
    Providing "match" as a parameter in the dependency array of the useEffect hook results in an infinite loop of
    getWatchlistData() being called and crashing the system, so that's why dependency array contains "user" only
  */
  useEffect(() => {
    if (match) {
      watchlistService
      .getWatchlistData(match.params.id)
      .then(data => setWatchlist(data))
    }
  // This eslint line is to disable warning showed on not adding "match" to the dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  
  // Check whether each watchlist in "watchlists" state has the "instruments" key in them
  const checkWhetherWatchlistInstrumentsLoaded = watchlists => {
    return watchlists.filter(w => w.instruments).length === watchlists.length
  }

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

      {
        // Show Login for when no login has happened and showLoginForm is true
        user === null && showLoginForm && 
        <LoginForm startLogin={handleLogin} showLoginForm={showLoginForm} setShowLoginForm={setShowLoginForm}/>
      }
      { 
        // Show Signup form when no login has happened and showLoginForm is false
        user === null && showLoginForm === false &&
        <SignupForm startSignup={handleLogin} showLoginForm={showLoginForm} setShowLoginForm={setShowLoginForm}/>
      }

      {
        // Show NavBar when login has happened
        user !== null && 
        <NavBar user={user} setUser={setUser}/>
      } 

      {
        /*
          React Router for specifying routes of the app, only valid when login has happened
          Routes available,
          /watchlists/:id => Single watchlist view
          /search => Shows search bar for searching instruments and adding them to watchlists
          / => Home page that shows "Create Watchlist form" and "Your Watchlists" view
        */
        user !== null &&
        <Switch>
          <Route path='/watchlists/:id'>
            <Watchlist watchlist={watchlist} removeWatchlist={null} removeWatchlistInstrument={null} />
          </Route>

          <Route path='/search'>
            {
              // If watchlists or instruments haven't loaded or if even one watchlist doesn't have instruments
              // property loaded then redirect to home page instead of remaining on search page
              // It's a stopgap solution to an app crashing bug but it is what it is :(
              watchlists && instruments && checkWhetherWatchlistInstrumentsLoaded(watchlists)?
              <Search instruments={instruments} watchlists={watchlists} addToWatchlist={addToWatchlist}/>:
              <Redirect to='/' />
            } 
          </Route>

          <Route path='/'>
            <WatchlistForm createWatchlist={createWatchlist} />
            
            <Watchlists
              watchlists={watchlists}
              removeWatchlist={removeWatchlist}
              removeWatchlistInstrument={removeWatchlistInstrument}
            />
          </Route>

        </Switch>  
      }

      {/* Epic Footer */}
      <footer className='footer rounded text-center p-2'>
        <span>Returd Gang 2022-23 &copy;</span>  
      </footer>

    </div>
  )
}

export default App