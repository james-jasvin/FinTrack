import React, { useState } from 'react'

const WatchlistForm = ({ createWatchlist }) => {
  const [ name, setName ] = useState('')
  const [ isMF, setIsMF ] = useState(false)

  const addWatchlist = (event) => {
    event.preventDefault()

    const watchlist = {
      name,
      isMF
    }

    createWatchlist(watchlist)

    setName('')
    setIsMF('')
  }

  return (
    <div className='bg-dark p-2 m-5 rounded regular-shadow' id='watchlist-form'>
      <h3>Create a New Watchlist</h3>
      <form onSubmit={addWatchlist} id='watchlist-form'>
        <div className='form-group'>
          <label>Watchlist Name:</label>
          <input className='form-control' value={name} onChange={event => setName(event.target.value)} type='text' id='watchlist-name' required/>
        </div>

        <div className='form-check'>
          <input className='form-check-input' checked={isMF} onChange={event => setIsMF(!isMF)} type='checkbox' id='watchlist-is-mf'/>
          <label>Is MF Watchlist?</label>
        </div>

        <button className='btn btn-success' type='submit' id='watchlist-submit'>Submit</button>
      </form>
    </div>
  )
}

export default WatchlistForm