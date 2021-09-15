//This message should be displayed once you created a new post, and should last for a few seconds.
//We do not really let React to delete this element, but let CSS do this work.

import React, { useEffect } from "react"

function FlashMessages(props) {
  return (
    <div className="floating-alerts">
      {/*loop through messages.*/}
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className="alert alert-success text-center floating-alert shadow-sm">
            {msg}
          </div>
        )
      })}
    </div>
  )
}

export default FlashMessages
