import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from "@testing-library/user-event";
import { render, fireEvent, screen } from '@testing-library/react'
import WatchlistForm from './WatchlistForm'

describe('<WatchlistForm/>', () => {
  const createWatchlist = jest.fn()

  test('watchlist form submission simulated successfully', () => {
    render(<WatchlistForm createWatchlist={createWatchlist} />)

    const watchlistNameInput = screen.getByLabelText('Watchlist Name:')
    const isMFInput = screen.getByTestId('mf-radio-button')

    const form = screen.getByTestId('watchlist-form')

    fireEvent.change(watchlistNameInput, {
      target: {
        value: 'Joe Mama'
      }
    })

    userEvent.click(isMFInput)

    fireEvent.submit(form)

    expect(createWatchlist.mock.calls).toHaveLength(1)

    expect(createWatchlist.mock.calls[0][0].name).toBe('Joe Mama')
    expect(createWatchlist.mock.calls[0][0].isMF).toBe(true)
  })
})