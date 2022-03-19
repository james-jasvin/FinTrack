import React, { useState } from 'react'
import WatchlistInstrument from './WatchlistInstrument'

const Watchlist = ({ watchlist, removeWatchlist, removeWatchlistInstrument }) => {
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

  // If no watchlist has been loaded yet, then return null immediately to avoid errors
  if (!watchlist)
    return (
      <div>
        {
          removeWatchlist? 'Watchlist data not fetched yet': 'Invalid watchlist ID'
        }
      </div>
    )

  // CHANGE THIS URL ONCE DEPLOYED OR USE ENVIRONMENT VARIABLES
  const watchlistUrl = `http://localhost:3000/watchlists/${watchlist.id}`

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
            <button className="p-0 navbar-brand btn btn-link border h5 border-dark p-2">{watchlist.name} - <small>{watchlist.isMF? 'Mutual Funds Watchlist': 'Stocks Watchlist'}</small></button>

            <div>
              <ul className="navbar-nav mr-auto">
                {
                  // Only show toggling of watchlist feature when not in single watchlist view mode
                  removeWatchlist?
                  <li className="nav-item active">
                    <button onClick={toggleVisibility} className='visibility-button'>
                      {visibility? <i class="fa-solid fa-angle-up"></i>: <i class="fa-solid fa-angle-down"></i>}
                    </button>
                  </li>
                  : ''
                }
                <li className='nav-item active'>
                  <button onClick={() => {
                    navigator.clipboard.writeText(watchlistUrl)
                    showCopiedToClipboardNotification()
                  }} className='share-watchlist'>
                    <i class="fa-solid fa-share"></i>
                  </button>
                </li>

                {
                  // Only show the option to delete watchlist, if owner of watchlist is viewing the watchlist and not some other user
                  // This is checked by checking removeWatchlist parameter, it is non-null if owner is viewing and null otherwise
                  removeWatchlist?
                  <li className='nav-item'>
                    <button onClick={deleteWatchlist} className='delete-watchlist remove-button'>
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </li>
                  : '' 
                }


              </ul>
              
              {/* <div className='inline my-2 my-lg-0'><button className='btn btn-primary' onClick={logout}>Logout</button></div> */}
            </div>
          </nav>
        </div>

        {/* Replace the inline style by something more pleasant later on */}
        <div className='ml-4 mb-4 h5 copiedLinkSuccess'>{ copiedLinkSuccess }</div>

      </div>
      <div className='watchlist-details'>
        {
          // If in single watchlist view mode => removeWatchlist === null, then visibility doesn't matter and we should show WatchlistInstruments
          // If in normal watchlist view mode => removeWatchlist !== null, then visibility should be true for showing WatchlistInstruments
          // The summary of these two conditions is, (removeWatchlist === null || visibility)
          (removeWatchlist === null || visibility) &&
                <div>
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
                      : 'No instruments added to this watchlist yet'
                  }
                </div>
        }
      </div>
    </div>
  )
}

export default Watchlist