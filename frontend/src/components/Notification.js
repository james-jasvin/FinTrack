import React from 'react'

const Notification = ({ notification, type }) => {
  if (notification === null)
    return null

  return (
    <div className={`${type} notification`}>
      {notification}
    </div>
  )
}

export default Notification