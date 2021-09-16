import React, { useEffect, useContext, useState } from "react"

import Page from "./Page"

import { useParams } from "react-router-dom"

import Axios from "axios"

import StateContext from "../StateContext"

function Profile() {
  const { username } = useParams() //https://reactrouter.com/web/api/Hooks/useparams   //We need to destructing it.

  const appState = useContext(StateContext)

  //profileData and setProfileData will be immediately available as soon as this website is going to load.
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" },
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token })

        setProfileData(response.data) //If there is anything changed in response.data

        console.log(response.data)
      } catch (e) {
        console.log("There was a problem.")
      }
    }
    fetchData()
  }, []) // Only run the first argument's function the first time it is run.

  return (
    <Page title="Profile Screen">
      <h2>
        {" "}
        {/*https://github.com/LearnWebCode/react-course/blob/master/html-templates/profile-posts.html*/} {/*line 42nd to 72nd*/}
        <img className="avatar-small" src={profileData.profileAvatar} /> {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>

      <div className="list-group">
        <a href="#" className="list-group-item list-group-item-action">
          <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #1</strong>
          <span className="text-muted small">on 2/10/2020 </span>
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #2</strong>
          <span className="text-muted small">on 2/10/2020 </span>
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #3</strong>
          <span className="text-muted small">on 2/10/2020 </span>
        </a>
      </div>
    </Page>
  )
}

export default Profile
