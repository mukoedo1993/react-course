Quick Note About Debugging
Hello everyone,

In the following lesson we setup a catch block that should run if our request to register a user fails for any reason. However, we don't have it output any actually useful information that will help you debug your issue. I've just adjusted our `backend-api` (May 9th 2020, make sure you have the latest `controllers/userController.js` from GitHub in your backend, here is the link) to actually send the specific reasons why your request failed (for example, your password wasn't long enough, your email is not a valid format, your username uses non-alphanumeric characters, etc...).

To be able to see these messages in the browser's console, simply change this block of code in the following lesson from `HomeGuest.js` from this:
```
async function handleSubmit(e) {
    e.preventDefault()
    try {
      await Axios.post("http://localhost:8080/register", { username, email, password })
      console.log("User was successfully created.")
    } catch (e) {
      console.log("There was an error.")
    }
  }
  ```
To instead be this:
```
async function handleSubmit(e) {
    e.preventDefault()
    try {
      await Axios.post("http://localhost:8080/register", { username, email, password })
      console.log("User was successfully created.")
    } catch (e) {
      console.log(e.response.data)
    }
  }
  ```
The only difference is the line where we are saying what to log to the console in the catch block.

This should help you see the issue with your request; so far the most common issue I've seen is that your password is not at least 12 characters long, or an email address that isn't a valid format.

Thanks!
Brad
