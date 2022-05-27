import React from 'react'
import Watchlist from './Watchlist'

/*
  This component is used for rendering the "Your Watchlists" view which consists of each Watchlist being rendered
  Each Watchlist is its own component
*/
const Watchlists = ({ watchlists, removeWatchlist, removeWatchlistInstrument }) => {  
  if (watchlists === [])
    return null

  return (
    <div className='m-5 p-2 rounded regular-shadow' id="watchlists">
      <h2 className='ml-2'>Your Watchlists</h2>
      { 
        watchlists.map(w =>
          <Watchlist
            watchlist={w}
            key={w.id}
            removeWatchlist={removeWatchlist}
            removeWatchlistInstrument={removeWatchlistInstrument}
          /> 
        )
      }
    </div>
  )
}

export default Watchlists