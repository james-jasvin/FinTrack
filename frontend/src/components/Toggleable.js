import React, { useState, useImperativeHandle } from 'react'

const Toggleable = React.forwardRef((props, ref) => {
  const [ visibility, setVisibility ] = useState(false)

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  const hideWhenVisible = { display: visibility? 'none': '' }
  const showWhenVisible = { display: visibility? '': 'none' }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
      <br/>
    </div>
  )
})

Toggleable.displayName = 'Toggleable'

export default Toggleable