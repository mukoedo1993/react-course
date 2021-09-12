import React, { useEffect } from "react"
import Container from "./Container"

function Page(props) {
  useEffect(() => {
    document.title = `${props.title}| ComplexApp`
    window.scrollTo(0, 0) //scroll up to the top of screen
  }, []) //The empty array shows that the function of first argument will only be run the first time component is run.

  return <Container wide={props.wide}>{props.children}</Container>
}

export default Page
