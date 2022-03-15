import React from 'react'
import Watchlist from './Watchlist'

const Watchlists = ({ watchlists, removeWatchlist, removeWatchlistInstrument }) => {  
  if (watchlists === [])
    return null

  return (
    <div className='bg-dark m-5'>
      <h3>Your Watchlists</h3>
      { watchlists.map(w => <Watchlist watchlist={w} key={w.id} removeWatchlist={removeWatchlist} removeWatchlistInstrument={removeWatchlistInstrument} /> )}
    </div>
  )
}

export default Watchlists