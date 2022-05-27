import React, { useState } from 'react'

/*
  This component is used for creating a new Watchlist
*/
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
    setIsMF(false)
  }

  return (
    <div className='p-2 m-5 rounded regular-shadow' id='watchlist-form-div'>
      <h3>Create a New Watchlist</h3>

      <form onSubmit={addWatchlist} id='watchlist-form' data-testid='watchlist-form'>
        <div className='form-group'>
          <label htmlFor='watchlist-name'>Watchlist Name:</label>
          <input
            className='form-control'
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder='Enter watchlist name'
            type='text'
            id='watchlist-name'
            required
          />
        </div>

        <div className='form-radio-group' onChange={event => setIsMF(event.target.value === 'mf')}>
          <input required type='radio' id='mf' name='watchlist-type' value='mf' className='mr-2' data-testid='mf-radio-button'/>
          <label htmlFor='mf'>Mutual Funds Watchlist</label><br/>
          <input type='radio' id='stock' name='watchlist-type' value='stock' className='mr-2'/>
          <label htmlFor='stock'>Stocks Watchlist</label><br/>
        </div>

        <button className='btn btn-success' type='submit' id='watchlist-submit'>Submit</button>
      </form>
    </div>
  )
}

export default WatchlistForm