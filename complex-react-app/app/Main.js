import React, { useState } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Axios from "axios"

Axios.defaults.baseURL = "http://localhost:8080"

//My Components
import Header from "./components/Header"
import Home from "./components/Home"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"

import About from "./components/About"
import Terms from "./components/Terms"
import CreatePost from "./components/CreatePost"

function Main() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexappToken")))

  return (
    <BrowserRouter>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} /> {/*Our header depends on loggedIn and setLoggedIn*/}
      <Switch>
        <Route path="/" exact>
          {loggedIn ? <Home /> : <HomeGuest />}
        </Route>
        <Route path="/create-post">
          <CreatePost />
        </Route>
        <Route path="/about-us" exact>
          <About />
        </Route>
        <Route path="/terms" exact>
          <Terms />
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

if (module.hot) {
  module.hot.accept()
}
