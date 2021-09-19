import React, { useEffect, useState } from "react"
import Page from "./Page"

import { useParams, Link } from "react-router-dom"

import Axios from "axios"

import LoadingDotsIcon from "./LoadingDotsIcon"

import ReactMarkdown from "react-markdown"

import ReactTooltip from "react-tooltip"

import NotFound from "./NotFound"

function ViewSinglePost() {
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

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
            {/*we do not need the title property here for the enclosing anchor element.*/}
            <i className="fas fa-edit"></i>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />{" "}
          <a data-tip="Delete" data-for="delete" className="delete-post-button text-danger" style={{ backgroundColor: "pink" }}>
            <i className="fas fa-trash"></i>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </a>
        </span>
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

export default ViewSinglePost
//  <ReactMarkdown children={post.body} />{" "}
