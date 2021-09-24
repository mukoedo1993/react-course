import React, { useState, useReducer, useEffect, Suspense } from "react"
import ReactDOM from "react-dom"

import { useImmerReducer } from "use-immer"

import { BrowserRouter, Switch, Route } from "react-router-dom"

import { CSSTransition } from "react-transition-group"

import Axios from "axios"

Axios.defaults.baseURL = process.env.BACKENDURL || "https://tom-kimi-backend-react.herokuapp.com/" //for deploying using DOTENV file.

//Context
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

//My Components
import LoadingDotsIcon from "./components/LoadingDotsIcon"

import Header from "./components/Header"
import Home from "./components/Home"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"

import About from "./components/About"
import Terms from "./components/Terms"

const CreatePost = React.lazy(() => import("./components/CreatePost"))

const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"))

import FlashMessages from "./components/FlashMessages"

import Profile from "./components/Profile"

import EditPost from "./components/EditPost"

import NotFound from "./components/NotFound"

const Search = React.lazy(() => import("./components/Search"))

const Chat = React.lazy(() => import("./components/Chat"))

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
    isChatOpen: false,
    unreadChatCount: 0,
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
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen
        return
      case "closeChat":
        draft.isChatOpen = false
        return
      case "incrementUnreadChatCount":
        draft.unreadChatCount++
        return
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0
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

  //Check if token has expired or not on first render:
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source()

      async function fetchResults() {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: ourRequest.token })
          if (!response.data) {
            //if !response.data means our duration has expired
            dispatch({ type: "logout" })
            dispatch({ type: "flashMessage", value: "Your session has expired. Please log in again." })
          }
        } catch (e) {
          console.log("There was a problem or the request was cancelled within Main.js file.")
          console.log(e)
        }
      }
      fetchResults()

      return () => ourRequest.cancel() //Here must be a function for cleanUp
    }
  }, [])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {/*Set value as an object with multiple properties.*/}

        {/*No matter how many layers deep is nested, we will be able to access to this value. */}
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header /> {/*Our header depends on loggedIn and setLoggedIn*/}
          <Suspense fallback={<LoadingDotsIcon />}>
            <Switch>
              {/*Suspense for the whole Switch. Because all contents of Switch are dependent on the current URL.*/}
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
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
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
