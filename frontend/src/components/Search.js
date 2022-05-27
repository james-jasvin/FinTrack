import { useState } from "react"
import Instrument from './Instrument'

/*
  This component is used to render the Search view which contains the Search Bar and the list of Instruments
  which are their own components.

  For the search functionality,
  - There is a text input element whose value is controlled by a state which will be used to filter
    through the instruments list provided to the component.
  - The filtering criteria can be determined here but directly using .filter() method should work for now
  - So basically we use the instruments object for searching and the watchlists object for showing
    which watchlist to add any instrument to.
*/
const Search = ({ watchlists, instruments, addToWatchlist }) => {
  const [ filterText, setFilterText ] = useState("")

  /*
    Filtering on the basis of text in filter input text box (case insensitive)
    filterText can be present anywhere in the stock's or MF's name or symbol and it will still be a match
    Can also use regex here but this is just way simpler
    If filterText is empty, then display all the instruments, otherwise perform the filtering operation
  */
  const filteredInstruments = filterText === ''? instruments: instruments.filter(ins => {
    const filterTextLowerCase = filterText.toLowerCase()
    return ins.name.toLowerCase().includes(filterTextLowerCase) || ins.symbol.toLowerCase().includes(filterTextLowerCase)
  })

  const stockWatchlists = watchlists.filter(w => w.isMF === false)
  const mfWatchlists = watchlists.filter(w => w.isMF === true)

  return (
    <div className="m-5">
      {/* Search Bar */}
      <div className='input-group regular-shadow rounded' id='search-bar'>
        <div className='input-group-prepend'>
          <span className='input-group-text bg-dark text-light border-dark'>
            <i className='fa-solid fa-magnifying-glass'></i>
          </span>
        </div>
        <input type="text" className='form-control form-control-lg' placeholder="Search for Stocks or MFs" value={ filterText } onChange={ event => setFilterText(event.target.value) }/>
      </div>

      {/* Instruments View */}
      <div className="rounded mt-5 regular-shadow" id="search-results">
        <div className="regular-shadow p-2 pl-3 rounded" id="search-results-header"><h3>Search Results</h3></div>
        <div className="pb-4 pt-2">
          { filteredInstruments.length?
            filteredInstruments.map( ins =>
            <Instrument
              key={ins.id}
              watchlists={ins.isMF? mfWatchlists: stockWatchlists}
              instrument={ins}
              addToWatchlist={addToWatchlist}/>) 
            : <h5 className="p-3">No valid instruments found</h5>
          }
        </div>
      </div>
      
    </div>
  )
}

export default Search