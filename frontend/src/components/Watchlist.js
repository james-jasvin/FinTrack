import React, { useState } from 'react'
import WatchlistInstrument from './WatchlistInstrument'
const config = require('../config')

/*
  This component is for rendering a single Watchlist and its WatchlistInstruments which are separate components
  Rendering can be for "Your Watchlists" view, i.e. "/" route or for Single Watchlist view, i.e. "/watchlists/:id" route
*/
const Watchlist = ({ watchlist, removeWatchlist, removeWatchlistInstrument }) => {
  // This state is used to determine whether to show the watchlistInstruments or not
  // visibiliy = false => WatchlistInstruments are not shown and shown when true
  const [ visibility, setVisibility ] = useState(false)
  const toggleVisibility = () => setVisibility(!visibility)

  const [ copiedLinkSuccess, setCopiedLinkSuccess ] = useState('')

  // When share watchlist button is clicked, show this text for 2 seconds
  const showCopiedToClipboardNotification = () => {
    setCopiedLinkSuccess('Copied Shareable Watchlist URL to the Clipboard!')

    setTimeout(() => {
      setCopiedLinkSuccess('')
    }, 2000)
  }

  // If no watchlist has been loaded yet, then show loading screen instead to avoid errors
  if (!watchlist)
    return (
      <>
        {
          removeWatchlist?
          <div className='m-5 p-2 rounded regular-shadow' id='watchlists'>
            <h2 className='ml-2'>Your Watchlists</h2>
            <h5 className='ml-3'>Watchlist data not fetched yet </h5>
            <div>
            <div class="spinner-border text-success" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <div class="spinner-grow text-warning" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <div class="spinner-grow text-primary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <div class="spinner-border text-success" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div>
          :
          <div className='m-2 p-2 rounded regular-shadow watchlist text-center'>
            <h5 className='ml-3'>Data not fetched yet or invalid watchlist ID</h5>
            <div className='ml-3'>
              <div class="spinner-border text-success" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <div class="spinner-grow text-warning" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <div class="spinner-grow text-primary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <div class="spinner-border text-success" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        }
      </>
    )

  const watchlistUrl = `${config.FRONTEND_URL}/watchlists/${watchlist.id}`

  const watchlistStyle = {
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5
  }

  const deleteWatchlist = () => {
    const result = window.confirm(`You're about to delete the "${watchlist.name}" watchlist`)
    if (result)
      removeWatchlist(watchlist)
  }

  return (
    <div className='watchlist regular-shadow p-2 m-2 rounded' style={watchlistStyle}>
      <div className='watchlist-header'>
        
        <div>
          <nav className="navbar navbar-dark navbar-expand-sm">
            <button className="navbar-brand btn btn-link border border-dark p-2">
              <h4>{watchlist.name}<br/>
                <small>{watchlist.isMF? 'Mutual Funds Watchlist': 'Stocks Watchlist'}</small>
              </h4>
            </button>

            <div>
              <ul className="navbar-nav mr-auto">
                {
                  // Only show toggling of watchlist feature when not in single watchlist view mode
                  removeWatchlist?
                  <li className="nav-item active">
                    <button onClick={toggleVisibility} className='visibility-button btn btn-link' data-testid='visibility-button'>
                      { visibility? <i className="fa-solid fa-angle-up"></i>: <i className="fa-solid fa-angle-down"></i> }
                    </button>
                  </li>
                  : ''
                }
                <li className='nav-item active'>
                  <button onClick={() => {
                    navigator.clipboard.writeText(watchlistUrl)
                    showCopiedToClipboardNotification()
                  }} className='share-watchlist btn btn-link'>
                    <i className="fa-solid fa-share-nodes"></i>
                  </button>
                </li>

                {
                  /*
                    Only show the option to delete a watchlist if it's creator is accessing the watchlist
                    and not some other user.
                    This is checked with the removeWatchlist parameter.
                    It is non-null if creator is viewing and null otherwise.
                  */
                  removeWatchlist?
                  <li className='nav-item'>
                    <button onClick={deleteWatchlist} className='delete-watchlist remove-button btn btn-link'>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </li>
                  : '' 
                }
              </ul>
            </div>
          </nav>
        </div>

        <div className='ml-4 mb-4 h5 copiedLinkSuccess'>{ copiedLinkSuccess }</div>

      </div>
      {
        /*
          If in single watchlist view mode => removeWatchlist === null,
            then visibility doesn't matter and we should show WatchlistInstruments
          If in normal watchlist view mode => removeWatchlist !== null,
            then visibility should be true for showing WatchlistInstruments
          The summary of these two conditions is, (removeWatchlist === null || visibility)
        */
        (removeWatchlist === null || visibility) &&
        <div className='watchlist-details' data-testid='watchlist-details'>
          <div className='watchlist-content rounded p-2 regular-shadow'>
            {
              watchlist.instruments.length > 0?
                watchlist.instruments.map(
                  instrument => 
                  <WatchlistInstrument 
                    watchlist={watchlist}
                    instrument={instrument}
                    key={instrument.id}
                    removeWatchlistInstrument={removeWatchlistInstrument}
                  />
                )
                : <h5 className='pl-4'>No instruments added to this watchlist yet</h5>
            }
          </div>
        </div>
      }
      
    </div>
  )
}

export default Watchlist