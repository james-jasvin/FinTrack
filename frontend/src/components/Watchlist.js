import React, { useState } from 'react'
import WatchlistInstrument from './WatchlistInstrument'

const Watchlist = ({ watchlist, removeWatchlist, removeWatchlistInstrument }) => {
  const [ visibility, setVisibility ] = useState(false)
  const toggleVisibility = () => setVisibility(!visibility)

  // If no watchlist has been loaded yet, then return null immediately to avoid errors
  if (!watchlist)
    return null

  const watchlistStyle = {
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5
  }

  // const updateLikes = () => {
  //   const updatedBlog = {
  //     ...blog,
  //     likes: blog.likes + 1
  //   }
  //   handleLike(updatedBlog)
  // }

  const deleteWatchlist = () => {
    const result = window.confirm(`You're about to delete the "${watchlist.name}" watchlist`)
    if (result)
      removeWatchlist(watchlist)
  }

  return (
    <div className='watchlist' style={watchlistStyle}>
      <div className='watchlist-header'>
        {watchlist.name} - {watchlist.isMF? 'Mutual Funds Watchlist': 'Stocks Watchlist'}
        <button onClick={toggleVisibility} className='visibility-button'>
          {visibility? 'hide': 'view'}
        </button>
      </div>
      {/* TODO: Share Button can be placed here */}
      <div className='watchlist-details'>
        {
          visibility &&
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

                  {/* <li>likes: <span>{blog.likes}</span><button onClick={updateLikes} className='like-button'>like</button></li>
                  <li>user: <span>{blog.user.name}</span></li> */}
                </div>
        }
        <div>
          <button onClick={deleteWatchlist} className='delete-watchlist remove-button'>delete</button>
        </div>
      </div>
    </div>
  )
}

export default Watchlist