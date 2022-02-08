import React from 'react'

const WatchlistInstrument = ({ instrument }) => {

  const listStyle = {
    listStyleType: 'none'
  }

  return (
    <div className='instrument'>
      <ul style={listStyle}>
        <li>{instrument.symbol}</li>
        <li>{instrument.name}</li>
        <li>{instrument.url}</li>
      </ul>
    </div>
  )
}

export default WatchlistInstrument