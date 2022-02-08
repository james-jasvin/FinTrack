import React, { useState } from 'react'
import WatchlistInstrument from './WatchlistInstrument'

const Watchlist = ({ watchlist }) => {
  const [ visibility, setVisibility ] = useState(false)
  const toggleVisibility = () => setVisibility(!visibility)

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

  // const deleteBlog = () => {
  //   const result = window.confirm(`You're about to delete the blog entry, ${blog.title} by ${blog.author}`)
  //   if (result)
  //     removeBlog(blog)
  // }

  return (
    <div className='watchlist' style={watchlistStyle}>
      <div className='watchlist-header'>{watchlist.name}<button onClick={toggleVisibility} className='visibility-button'>{visibility? 'hide': 'view'}</button></div>
      <div className='watchlist-details'>
        {
          visibility &&
                <div>
                  {/* TODO: <li>Share Button can be placed here </li> */}

                  { watchlist['instruments'].map(instrument => <WatchlistInstrument instrument={instrument} key={instrument.id} />) }

                  {/* <li>likes: <span>{blog.likes}</span><button onClick={updateLikes} className='like-button'>like</button></li>
                  <li>user: <span>{blog.user.name}</span></li> */}
                </div>
        }
        {/* {
          user.username === blog.user.username &&
            <div>
              <button onClick={deleteBlog} className='remove-button'>remove</button>
            </div>
        } */}
      </div>
    </div>
  )
}

export default Watchlist