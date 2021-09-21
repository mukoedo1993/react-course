import React, { useEffect } from "react"

import { Link } from "react-router-dom"

function Post(props) {
  const post = props.post
  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1} / ${date.getDate()} / ${date.getFullYear()}`

  return (
    //we do not need a key for link here. Because whenever we leverage our component, we alreay use it in an area where the outer component is providing a key for us.
    <Link onClick={props.onClick} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
      {/*In additional to give us title and body content, our server is also giving unique id for each post.*/}
      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {" "}
        {!props.noAuthor && <>by {post.author.username}</>} on {dateFormatted}{" "}
      </span>
    </Link>
  )
}

export default Post
