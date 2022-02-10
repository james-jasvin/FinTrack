import React, { useState } from 'react'

const WatchlistForm = ({ createWatchlist }) => {
  const [ name, setName ] = useState('')
  const [ isMF, setIsMF ] = useState(false)

  const addWatchlist = (event) => {
    event.preventDefault()

    const watchlist = {
      name,
      isMF,
      instruments: []
    }

    createWatchlist(watchlist)

    setName('')
    setIsMF('')
  }

  return (
    <div>
      <h3>create a new watchlist</h3>
      <form onSubmit={addWatchlist} id='watchlist-form'>
        <div>
          watchlist name: <input value={name} onChange={event => setName(event.target.value)} type='text' id='watchlist-name' required/>
        </div>

        <div>
          is MF watchlist?: <input checked={isMF} onChange={event => setIsMF(!isMF)} type='checkbox' id='watchlist-is-mf'/>
        </div>

        <button type='submit' id='watchlist-submit'>submit</button>
      </form>
    </div>
  )
}

export default WatchlistForm