// Refer to this link to understand how to implement Search functionality on instruments
// Basically have a text input element (with state) whose value will be used to filter through the instruments list provided to the component
// The filtering criteria can be determined by you but directly using .filter() method should work for now
// https://github.com/james-jasvin/Fullstack-Open-Course-Submissions/blob/master/part2/phonebook/src/App.js

import { useState } from "react"
import Instrument from './Instrument'

// Use instruments for searching and watchlists for showing which watchlist to add instrument to
const Search = ({ watchlists, instruments, addToWatchlist }) => {
  const [ filterText, setFilterText ] = useState("")

  // Filtering on the basis of text in filter input text box (case insensitive)
  // filter text can be present anywhere in the stock's or MF's name or symbol and it will still be a match
  // Can also use regex here but this is just way simpler
  const filteredInstruments = filterText === ''? []: instruments.filter(ins => 
    ins.name.toLowerCase().includes(filterText.toLowerCase()) || ins.symbol.toLowerCase().includes(filterText.toLowerCase())
  )

  const stockWatchlists = watchlists.filter(w => w.isMF === false)
  const mfWatchlists = watchlists.filter(w => w.isMF === true)

  return (
    <div>
      <input type="text" placeholder="Search for stocks or MFs" value={ filterText } onChange={ event => setFilterText(event.target.value) }/>
      <h3>search results: </h3> 
      { filteredInstruments.map( ins =>
      <Instrument
        key={ins.id}
        watchlists={ins.isMF? mfWatchlists: stockWatchlists}
        instrument={ins}
        addToWatchlist={addToWatchlist}/>) 
      }
    </div>
  )
}

export default Search