import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, screen } from '@testing-library/react'
import Watchlist from './Watchlist'

describe('<Watchlist />', () => {
  const removeWatchlistInstrument = jest.fn()
  const removeWatchlist = jest.fn()

  const watchlist = {
    name: 'Test Watchlist 1',
    isMF: false,
    user: {
      username: 'Joe',
      name: 'Joe Mama'
    },
    instruments: [
      {
        "id": "1",
        "symbol": "TCS",
        "name": "Tata Consultancy Services",
        "isMF": false,
        "url": "https://www.tickertape.in/stocks/tata-consultancy-services-TCS?"
      },
      {
        "id": "2",
        "symbol": "INFY",
        "name": "Infosys",
        "isMF": false,
        "url": "https://www.tickertape.in/stocks/infosys-INFY?"
      }
    ]
  }

  test('watchlist rendered with name and watchlist instruments are not visible', () => {
    const { container } = render(
      <Watchlist watchlist={watchlist} removeWatchlist={removeWatchlist} removeWatchlistInstrument={removeWatchlistInstrument} />
    )
    expect(container).toHaveTextContent('Test Watchlist 1')
    expect(screen.queryByText('TCS')).toBeNull()
  })

  test('watchlist details displayed upon clicking view button', () => {
    render(<Watchlist watchlist={watchlist} removeWatchlist={removeWatchlist} removeWatchlistInstrument={removeWatchlistInstrument} />)
    const viewButton = screen.getByTestId('visibility-button')
    fireEvent.click(viewButton)

    const watchlistDetails = screen.getByTestId('watchlist-details')
    expect(watchlistDetails).toBeDefined()
    expect(watchlistDetails).toHaveTextContent('TCS')
    expect(watchlistDetails).toHaveTextContent('Infosys')
  })
})