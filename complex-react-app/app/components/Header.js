import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"

import ExampleContext from "../ExampleContext"

import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"

function Header(props) {
  const { setLoggedIn } = useContext(ExampleContext) //destructure

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ComplexApp
          </Link>
        </h4>
        {/* So that our HeaderLoggedOut component could have access to the setLoggedIn, even without declared below, as soon as we set it as context. */}
        {props.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
      </div>
    </header>
  )
}

export default Header
