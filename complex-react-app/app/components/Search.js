//https://github.com/LearnWebCode/react-course/blob/master/html-templates/search-is-visible.html
//line 68 to line 102

import React, { useEffect, useContext } from "react"

import DispatchContext from "../DispatchContext"

import { useImmer } from "use-immer"

import Axios from "axios"

import { Link } from "react-router-dom"

function Search() {
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  })

  //only run this useEffect the very first time this component is rendered.
  // Because once you open the search layout, we want to keep track of value in state.
  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler)

    return () => document.removeEventListener("keyup", searchKeyPressHandler)
  }, [])

  useEffect(() => {
    if (state.searchTerm.trim()) {
      //The ms you enter sth, I want to show the spinning loading icon.
      setState((draft) => {
        draft.show = "loading"
      })

      const delay = setTimeout(() => {
        setState((draft) => {
          //without curly brackets, you will mean you return what is inclued here,
          draft.requestCount++
        })
      }, 750)

      return () => clearTimeout(delay) //If the function is run again within 3000ms, this clearTimeout function will be called as a clean-up. The clearTimeout will cancel the first timeout.
    } else {
      setState((draft) => {
        draft.show = "neither"
      })
    }
  }, [state.searchTerm]) //watch for changes for state.searchTerm

  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = Axios.CancelToken.source()

      async function fetchResults() {
        try {
          const response = await Axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token }) //response is an array of matched posts here.
          setState((draft) => {
            draft.results = response.data
            draft.show = "results"
          })
        } catch (e) {
          console.log("There was a problem or the request was cancelled within Search.js file.")
          console.log(e)
        }
      }
      fetchResults()

      return () => ourRequest.cancel() //Here must be a function for cleanUp
    }
  }, [state.requestCount])

  function searchKeyPressHandler(e) {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" })
    }
  }

  function handleInput(e) {
    const value = e.target.value
    setState((draft) => {
      //useImmer allows us to directly mutate the state
      draft.searchTerm = value
    })
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          {/*the element below is spinning loading icon.*/}
          <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : "")}></div>

          <div className={"live-search-results " + (state.show == "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong>({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                </div>
                {state.results.map((post) => {
                  const date = new Date(post.createdDate)
                  const dateFormatted = `${date.getMonth() + 1} / ${date.getDate()} / ${date.getFullYear()}`

                  return (
                    <Link onClick={() => appDispatch({ type: "closeSearch" })} key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                      {/*In additional to give us title and body content, our server is also giving unique id for each post.*/}
                      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
                      <span className="text-muted small">
                        {" "}
                        by {post.author.username} on {dateFormatted}{" "}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
            {!Boolean(state.results.length) && <p className="alert alert-danger text-center shadow-sm">Sorry, we could not find any results for that search.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
