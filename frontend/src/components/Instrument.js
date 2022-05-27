import React, { useState } from 'react'

/*
  This component is used for rendering a single instrument's view in the "/search" route.
  Show's the instrument's name, symbol, Tickertape link and a Dropdown list which contains the names of watchlists to which
  this instrument can be added to.
  On clicking one of these watchlist names, the instrument should be added to that watchlist
*/
const Instrument = ({ watchlists, instrument, addToWatchlist }) => {
  /*
    State used for controlling the Select Watchlist dropdown list.
    It stores the index of a watchlist in the filteredWatchlists list.
    Initially set to -1, which is used for representing the default "Select a Watchlist" option.
  */
  const [ selectedWatchlist, setSelectedWatchlist ] = useState(-1)

  // Only show those watchlists which do not have the given instrument already present in them
  const filteredWatchlists = watchlists.filter(w => 
    w.instruments.filter(ins => ins.symbol === instrument.symbol).length === 0
  )

  const createWatchlistInstrument = (event) => {
    const watchlistIdx = event.target.value
    
    // If watchlistIdx == -1 => User clicked on "Select a Watchlist" option,
    // in this case no further action should be done and changes should not be reflected
    if (watchlistIdx === -1)
      return

    const watchlist = filteredWatchlists[watchlistIdx]

    // Add instrumentId and watchlistId as keys to the instrument object to convert it to a watchlistInstrument object
    const watchlistInstrument = {
      ...instrument,
      instrumentId: instrument.id,
      watchlistId: watchlist.id
    }

    // The object has an extra "id" key (the instrument's id) which has to be deleted, before sending to the backend
    delete watchlistInstrument.id

    const result = window.confirm(`Do you want to add ${instrument.symbol} to the watchlist ${watchlist.name}?`)
    if (result) {
      // Set selectedWatchlist option so that its displayed to the user on the frontend
      setSelectedWatchlist(watchlistIdx)

      addToWatchlist(watchlist, watchlistInstrument)

      // Reset selectedWatchlist option to -1,
      // so that default option of "Select a watchlist" will be displayed and user can again select other watchlists
      // for the same instrument
      setSelectedWatchlist(-1)
    }
  }

  /*
    Instruments are added to watchlists with the help of a dropdown list <select>.
    Add a <option> element with value=-1 in the <select> list that will serve as the default option.
    "value" property corresponds to index of a watchlist in the filteredWatchlists list.
    When user clicks an entry, the onChange of the <select> is triggered which will call createWatchlistInstrument.
    If user clicks default option, then nothing should happen which is why we check for watchlistIdx == -1
    in the createWatchlistInstrument function.
  */
  return (
    <nav className="navbar navbar-expand-sm instrument mb-2 regular-shadow">
      <button className="btn text-light mr-auto"><h5>{instrument.symbol} - {instrument.name}</h5></button>

      <div>
        <ul className="navbar-nav">

          <li className="nav-item active">
            <a href={instrument.url} target='_blank' rel='noreferrer'><i className='tickertape-icon'></i></a>
          </li>

          <li className="nav-item active">
            <select className='form-select p-2 regular-shadow rounded-lg' value={selectedWatchlist} onChange={createWatchlistInstrument}>
              <option value={-1}>Add to Watchlist</option>
              {
                filteredWatchlists.map((w, idx) => 
                  <option key={w.id} value={idx}>{w.name}</option>
                )
              }
            </select>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Instrument