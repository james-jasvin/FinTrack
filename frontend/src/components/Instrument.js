import React, { useState } from 'react'

const Instrument = ({ watchlists, instrument, addToWatchlist }) => {
  // Only show those watchlists which do not have the given instrument already present in them
  const filteredWatchlists = watchlists.filter(w => w.instruments.filter(ins => ins.symbol === instrument.symbol).length === 0)

  const [ selectedWatchlist, setSelectedWatchlist ] = useState(-1)

  const createWatchlistInstrument = (event) => {
    const watchlistIdx = event.target.value
    
    if (watchlistIdx === -1)
      return

    const watchlist = filteredWatchlists[watchlistIdx]

    // Add instrumentId and watchlistId as keys to the instrument object to convert it to a watchlistInstrument object
    const watchlistInstrument = {
      ...instrument,
      instrumentId: instrument.id,
      watchlistId: watchlist.id
    }

    // The object has an extra "id" key which has to be deleted and now it can be sent to the backend
    delete watchlistInstrument.id

    const result = window.confirm(`Do you want to add ${instrument.symbol} to the watchlist ${watchlist.name}?`)
    if (result) {
      setSelectedWatchlist(watchlistIdx)
      addToWatchlist(watchlist, watchlistInstrument)
    }
  }

  // Instruments are added to watchlists with the help of a dropdown list <select>
  // Add a <option> element with value=-1 in the <select> list that will serve as the default option
  // value property corresponds to index of a watchlist in the filteredWatchlists list
  // When user clicks an entry, the onChange of the <select> is triggered which will call createWatchlistInstrument
  // If user clicks default option, then nothing should happen which is why check for watchlistIdx == -1 in the event handler function
  return (
    <div className='instrument'>
      {instrument.symbol} - {instrument.name} <br/>
      Add price and other info here <br/>

      <select value={selectedWatchlist} onChange={createWatchlistInstrument}>
        <option value={-1}>Select a Watchlist</option>
        {
          filteredWatchlists.map((w, idx) => 
            <option key={w.id} value={idx}>{w.name}</option>
          )
        }
      </select>

    </div>
  )
}

export default Instrument