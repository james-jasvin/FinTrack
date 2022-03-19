import React from 'react'

const WatchlistInstrument = ({ watchlist, instrument, removeWatchlistInstrument }) => {

  const deleteWatchlistInstrument = () => {
    const result = window.confirm(`You're about to delete "${instrument.symbol}" from your watchlist "${watchlist.name}"`)
    if (result)
      removeWatchlistInstrument(instrument, watchlist)
  }

  return (
    <nav className="navbar navbar-dark navbar-expand-sm watchlist-instrument mb-2">
      <button className="pr-3 btn text-light"><h5>{instrument.symbol} - {instrument.name}</h5></button>

      <div>
        <ul className="navbar-nav mr-auto">
          
          <li className="nav-item active">
            <a href={instrument.url} target='_blank' rel='noreferrer'><i className='tickertape-icon'></i></a>
          </li>
          
          {
            // Only show option to delete watchlist instrument if owner of watchlist is viewing
            // This can be checked as, removeWatchlistInstrument is null if non-owner is viewing and non-null otherwise
            removeWatchlistInstrument &&
            <li className='nav-item'>
              <button onClick={deleteWatchlistInstrument} className='delete-watchlist-instrument remove-button btn btn-link border'><i class="fa-solid fa-trash-can text-light"></i></button>
            </li>  
          }
        </ul>
      </div>
    </nav>
  )
}

export default WatchlistInstrument