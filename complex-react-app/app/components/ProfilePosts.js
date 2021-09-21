//Show the loading data status for a few seconds, and then load the real content.

import React, { useEffect, useState } from "react"
import Axios from "axios"

import { useParams, Link } from "react-router-dom"

import LoadingDotsIcon from "./LoadingDotsIcon" //animated loading icon

import Post from "./Post"

function ProfilePosts() {
  const { username } = useParams()

  const [isLoading, setIsLoading] = useState(true)

  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })

        setPosts(response.data)
        setIsLoading(false) //Here, we want to show loaded contents.
      } catch (e) {
        console.log("There was a problem in ProfilePosts.js and was caught.")
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [username])
  //Create a state store all

  if (isLoading) return <LoadingDotsIcon />
  return (
    <div className="list-group">
      {posts.map((post) => {
        return <Post noAuthor={true} post={post} key={post._id} />
      })}
      {!posts.length && (
        <h2>
          This guy is very <strong style={{ color: "red" }}>lazy</strong>. He/She has not created any post yet.
        </h2>
      )}
    </div>
  )
}

export default ProfilePosts
