//Show the loading data status for a few seconds, and then load the real content.

import React, { useEffect, useState } from "react"
import Axios from "axios"

import { useParams, Link } from "react-router-dom"

function ProfilePosts() {
  const { username } = useParams()

  const [isLoading, setIsLoading] = useState(true)

  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`)

        setPosts(response.data)
        setIsLoading(false) //Here, we want to show loaded contents.
      } catch (e) {
        console.log("There was a problem.")
      }
    }
    fetchPosts()
  }, [])
  //Create a state store all

  if (isLoading) return <div>loading...</div>
  return (
    <div className="list-group">
      {posts.map((post) => {
        //Date format:
        const date = new Date(post.createdDate)
        const dateFormatted = `${date.getMonth() + 1} / ${date.getDate()} / ${date.getFullYear()}`

        return (
          <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            {/*In additional to give us title and body content, our server is also giving unique id for each post.*/}
            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong> <span className="text-muted small">on {dateFormatted} </span>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfilePosts
