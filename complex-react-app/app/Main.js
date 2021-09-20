import React, { useState, useReducer } from "react"
import ReactDOM from "react-dom"

import { useImmerReducer } from "use-immer"

import { BrowserRouter, Switch, Route } from "react-router-dom"

import { CSSTransition } from "react-transition-group"

import Axios from "axios"

Axios.defaults.baseURL = "http://localhost:8080"

//Context
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

//My Components
import Header from "./components/Header"
import Home from "./components/Home"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"

import About from "./components/About"
import Terms from "./components/Terms"
import CreatePost from "./components/CreatePost"

import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"

import Profile from "./components/Profile"

import EditPost from "./components/EditPost"

import NotFound from "./components/NotFound"

import Search from "./components/Search"

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
    },
    isSearchOpen: false,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value) //We actually want to modify flashMessages in this case.
        return
      case "openSearch":
        draft.isSearchOpen = true
        return
      case "closeSearch":
        draft.isSearchOpen = false
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  React.useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token)
      localStorage.setItem("complexappUsername", state.user.username)
      localStorage.setItem("complexappAvatar", state.user.avatar)
    } else {
      localStorage.removeItem("complexappToken")
      localStorage.removeItem("complexappUsername")
      localStorage.removeItem("complexappAvatar")
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {/*Set value as an object with multiple properties.*/}

        {/*No matter how many layers deep is nested, we will be able to access to this value. */}
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header /> {/*Our header depends on loggedIn and setLoggedIn*/}
          <Switch>
            <Route path="/profile/:username">
              {" "}
              {/*path's parameter username is acceeeible by useParams. Ref: https://reactrouter.com/web/api/Hooks/useparams*/}
              <Profile />
            </Route>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>{" "}
            {/*:id works like a variable, unique to each single post. */}
            <Route path="/post/:id/edit" exact>
              <EditPost />
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
            {/*last Route below is our fallback route*/}
            <Route>
              <NotFound />
            </Route>
          </Switch>
          {/* For the CSSTransition part below:
          timeout: how many ms does it take for your CSS transition to complete? 330.
              in: if it is false, then search will be hidden.
              classNames: NOT className
              unmountOnExit: when in is false, we don't just want our search component to be invisible or hide our CSS, we actually want to unmount it, or
              just completely remove it from the DOM. 
              classNames: first load: '<classNames>-enter' for about {timeout} seconds. Then... '<classNames>-enter-active'. And, immediately you exit it, '<classNames>-exit' class will be added. '<classNames>-exit-active',after a few ms, will be added, i.e., zoom-out effect.
              After a given time, these classes will be completely moved away from the DOM, includeing the '<classNames>'
            */}
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <Search />
          </CSSTransition>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

if (module.hot) {
  module.hot.accept()
}
