import React, { useEffect, useState } from "react"
import Axios from "axios"

import { useParams, Link } from "react-router-dom"

import LoadingDotsIcon from "./LoadingDotsIcon" //animated loading icon

function ProfileFollow(props) {
  const { username } = useParams()

  const [isLoading, setIsLoading] = useState(true)

  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/${props.action == "ProfileFollowers" ? "followers" : ""}${props.action == "ProfileFollowing" ? "following" : ""}`, { cancelToken: ourRequest.token })

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
  }, [username, props.action])
  //Create a state store all

  if (isLoading) return <LoadingDotsIcon />
  return (
    <div className="list-group">
      {posts.map((follower, index) => {
        return (
          <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
            {/*In additional to give us title and body content, our server is also giving unique id for each post.*/}
            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
          </Link>
        )
      })}
      {!posts.length && props.action == "ProfileFollowers" && <h2>This guy doesn't have any follower now.</h2>}
      {!posts.length && props.action == "ProfileFollowing" && <h2>This guy has not followed anyone yet.</h2>}
    </div>
  )
}

export default ProfileFollow
