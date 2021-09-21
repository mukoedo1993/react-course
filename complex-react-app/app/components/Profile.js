import React, { useEffect, useContext } from "react"

import Page from "./Page"

import { useParams, NavLink, Switch, Route } from "react-router-dom" //

import Axios from "axios"

import StateContext from "../StateContext"

import ProfilePosts from "./ProfilePosts"

//import ProfileFollowers from "./ProfileFollowers" //Sunsetting it as assignments

//import ProfileFollowing from "./ProfileFollowing" //Sunsetting it as assignments

import ProfileFollow from "./ProfileFollow"

import { useImmer } from "use-immer"

function Profile() {
  const { username } = useParams() //https://reactrouter.com/web/api/Hooks/useparams   //We need to destructing it.

  const appState = useContext(StateContext)

  //profileData and setProfileData will be immediately available as soon as this website is going to load.
  const [state, setState] = useImmer({
    //If the follow actions has completed or not. It might take half a second to complete that operation.
    followActionLoading: false,

    startFollowingRequestCount: 0,

    stopFollowingRequestCount: 0,

    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" },
    },
  })

  useEffect(() => {
    const ourRequest_ = Axios.CancelToken.source() //To distinguish Profile's ourRequest, we add an underscore here.
    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest_.token })

        setState((draft) => {
          draft.profileData = response.data
        })
        console.log("Profile.js test!")
        console.log(response.data)
      } catch (e) {
        console.log("There was a problems in Profile.js and was caught.")
      }
    }
    fetchData()

    return () => {
      ourRequest_.cancel()
    }
  }, [username]) //Run at each time the username is changed.

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true
      })

      const ourRequest_ = Axios.CancelToken.source() //To distinguish Profile's ourRequest, we add an underscore here.
      async function fetchData() {
        try {
          const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest_.token })

          setState((draft) => {
            draft.profileData.isFollowing = true
            draft.profileData.counts.followerCount++
            draft.followActionLoading = false
          })
          console.log("Profile.js test!")
          console.log(response.data)
        } catch (e) {
          console.log("There was a problems in Profile.js and was caught.")
        }
      }
      fetchData()

      return () => {
        ourRequest_.cancel()
      }
    }
  }, [state.startFollowingRequestCount])

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true
      })

      const ourRequest_ = Axios.CancelToken.source() //To distinguish Profile's ourRequest, we add an underscore here.
      async function fetchData() {
        try {
          const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest_.token })

          setState((draft) => {
            draft.profileData.isFollowing = false
            draft.profileData.counts.followerCount--
            draft.followActionLoading = false
          })
          console.log("Profile.js test!")
          console.log(response.data)
        } catch (e) {
          console.log("There was a problems in Profile.js and was caught.")
        }
      }
      fetchData()

      return () => {
        ourRequest_.cancel()
      }
    }
  }, [state.stopFollowingRequestCount])

  function startFollowing() {
    setState((draft) => {
      draft.startFollowingRequestCount++
    })
  }

  function stopFollowing() {
    setState((draft) => {
      draft.stopFollowingRequestCount++
    })
  }

  return (
    <Page title="Profile Screen">
      <h2>
        {!appState.loggedIn && (
          <div className="alert text-center" style={{ color: "red" }}>
            Please! Please! Please! Register or login!
          </div>
        )}
        {/*https://github.com/LearnWebCode/react-course/blob/master/html-templates/profile-posts.html*/} {/*line 42nd to 72nd*/}
        {/*The user is viewing another user's profile, and has not yet followed.*/}
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i> {/*disabled here, if set as true, will make the follow button grayed out.*/}
          </button>
        )}
        {/*The user is viewing another user's profile, and has already followed.*/}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
            Stop Following <i className="fas fa-user-times"></i> {/*disabled here, if set as true, will make the follow button grayed out.*/}
          </button>
        )}
      </h2>
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Switch>
        <Route exact path="/profile/:username">
          <ProfilePosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollow action="ProfileFollowers" />
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollow action="ProfileFollowing" />
        </Route>
      </Switch>
    </Page>
  )
}

export default Profile
