My solutions for Mr Brat's assignments:<br>
In his assignments, we need to modify `useEffects` function in two files below:

```
//Profile.js:
useEffect(() => {
    const ourRequest_ = Axios.CancelToken.source() //To distinguish from Profile.js's ourRequest, we add an underscore here.
    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest_.token })

        setProfileData(response.data) //If there is anything changed in response.data
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
  }, [])
```

```
  //ProfilePosts.js
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
  }, [])
```
