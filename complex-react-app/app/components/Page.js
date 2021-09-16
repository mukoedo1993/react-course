import React, { useEffect } from "react"
import Container from "./Container"

function Page(props) {
  useEffect(() => {
    document.title = `${props.title}| ComplexApp`
    window.scrollTo(0, 0) //scroll up to the top of screen
  }, [props.title]) //Any time props.title change, this function will be rerun.

  return <Container wide={props.wide}>{props.children}</Container>
}

export default Page
