//To show the part of header only when you logged out.

import React, { useEffect, useState } from "react"

import Axios from "axios"

function HeaderLoggedOut() {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const response = await Axios.post("http://localhost:8080/login", { username, password })
      if (response.data) {
        //If response.data exists
        console.log(response.data)
      } else {
        //If response doesn't exist
        console.log("Incorrect Username / password")
      }
    } catch (e) {
      console.log("There was a problem.")
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
        <div className="row align-items-center">
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input name="username" onChange={(e) => setUsername(e.target.value)} className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
          </div>
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input name="password" onChange={(e) => setPassword(e.target.value)} className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
          </div>
          <div className="col-md-auto">
            <button className="btn btn-success btn-sm">Sign In</button>
          </div>
        </div>
      </form>
    </>
  )
}

export default HeaderLoggedOut
