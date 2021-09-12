import React, { useEffect } from "react"

//props.childern is a generic box that includes all of the child contents of the Container component.

function Container(props) {
  return <div className={"container py-md-5 " + (props.wide ? "" : "container--narrow")}>{props.children}</div>
}

export default Container
//container container--narrow py-md-5
