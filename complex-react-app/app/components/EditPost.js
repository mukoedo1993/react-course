//all content from CreatePost.js
//But what we want to display when we actually display editing post is

import React, { useEffect, useState, useContext } from "react"

import { useImmerReducer } from "use-immer"

import Page from "./Page"

import { useParams, Link } from "react-router-dom"

import Axios from "axios"

import LoadingDotsIcon from "./LoadingDotsIcon"

import StateContext from "../StateContext"

import DispatchContext from "../DispatchContext" //appwise dispatch

function ViewSinglePost() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true, //To check if the browser is still loading,
    isSaving: false, //when you click the button to send that save request, the property, saveIsLoading will be set to true. And actually, when we hear back
    // from the axio request, it will be set back to false.

    id: useParams().id, //pull the id from the url
    sendCount: 0, //how many times we want to try to send request
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "titleChange":
        draft.title.value = action.value
        return
      case "bodyChange":
        draft.body.value = action.value
        return
      case "submitRequest":
        draft.sendCount++
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  function submitHandler(e) {
    e.preventDefault()
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
        dispatch({ type: "fetchComplete", value: response.data })
      } catch (e) {
        console.log("There was a problem or the request was canceled. Detected in ViewSinglePost.js file")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const ourRequest = Axios.CancelToken.source()

      async function fetchPost() {
        try {
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.title.value, token: appState.user.token }, { cancelToken: ourRequest.token })
          appDispatch({ type: "flashMessage", value: "Post was updated." })
          dispatch({ type: "saveRequestFinished" })
        } catch (e) {
          console.log("There was a problem or the request was canceled. Detected in ViewSinglePost.js file")
        }
      }
      fetchPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon /> {/*Loading animated icon for single post*/}
      </Page>
    )

  return (
    <Page title="Edit Post">
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={(e) => dispatch({ type: "titleChange", value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={(e) => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value}></textarea>
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saved" : "Saving updates"}
        </button>
      </form>
    </Page>
  )
}

export default ViewSinglePost
