import React from 'react'

const WatchlistInstrument = ({ watchlist, instrument, removeWatchlistInstrument }) => {

  const deleteWatchlistInstrument = () => {
    const result = window.confirm(`You're about to delete "${instrument.symbol}" from your watchlist "${watchlist.name}"`)
    if (result)
      removeWatchlistInstrument(instrument, watchlist)
  }

  const listStyle = {
    listStyleType: 'none'
  }

  return (
    <div className='watchlist-instrument'>
      <ul style={listStyle}>
        <li>{instrument.symbol}</li>
        <li>{instrument.name}</li>
        <li>{instrument.url}</li>
        <li><button onClick={deleteWatchlistInstrument} className='delete-watchlist-instrument remove-button'>delete</button></li>
      </ul>
    </div>
  )
}

export default WatchlistInstrument