import React, { useEffect, useState, useContext } from "react"
import Page from "./Page"

import { useParams, Link, withRouter } from "react-router-dom"

import Axios from "axios"

import LoadingDotsIcon from "./LoadingDotsIcon"

import ReactMarkdown from "react-markdown"

import ReactTooltip from "react-tooltip"

import NotFound from "./NotFound"

import StateContext from "../StateContext"

import DispatchContext from "../DispatchContext"

function ViewSinglePost(props) {
  const appState = useContext(StateContext)

  const appDispatch = useContext(DispatchContext)

  const { id } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })

        setPost(response.data)
        setIsLoading(false) //Here, we want to show loaded contents.
      } catch (e) {
        console.log("There was a problem or the request was canceled. Detected in ViewSinglePost.js file")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (!isLoading && !post) {
    //If loading is finished and server couldn't find any valid post
    return <NotFound />
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon /> {/*Loading animated icon for single post*/}
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1} / ${date.getDate()} / ${date.getFullYear()}`

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username
    }
    return false
  }

  async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this post?")

    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })

        if (response.data == "Success") {
          //If actually deleted from the database
          //1: display a flash message
          appDispatch({ type: "flashMessage", value: "Post was successfully deleted" })

          //2: redirect to the current user's profile
          props.history.push(`/profile/${appState.user.username}`) //We need withRouter to access to the props.history here.
        }
      } catch (e) {
        console.log("There was a problem.")
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              {/*we do not need the title property here for the enclosing anchor element.*/}
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger" style={{ backgroundColor: "pink" }}>
              <i className="fas fa-trash"></i>
              <ReactTooltip id="delete" className="custom-tooltip" />
            </a>
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        {" "}
        <ReactMarkdown children={post.body} />
      </div>
    </Page>
  )
}

export default withRouter(ViewSinglePost)
//  <ReactMarkdown children={post.body} />{" "}
