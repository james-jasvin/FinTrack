import React from 'react'
import Watchlist from './Watchlist'

const Watchlists = ({ watchlists, removeWatchlist }) => {  
  if (watchlists === [])
    return null

  // const blogsCopy = [...blogs]

  // blogsCopy
  //   .sort((blogA, blogB) => {
  //     if (blogB.likes > blogA.likes)
  //       return 1
  //     else
  //       return -1
  //   })blogFormRef

  // console.log(watchlists)


  return (
    <div>
      { watchlists.map(w => <Watchlist watchlist={w} key={w.id} removeWatchlist={removeWatchlist}/> )}
    </div>
  )
}

export default Watchlists