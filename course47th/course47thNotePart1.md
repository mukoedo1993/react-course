```
useEffect(() => {
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`)

        setPost(response.data)
        setIsLoading(false) //Here, we want to show loaded contents.
      } catch (e) {
        console.log("There was a problem.")
      }
    }
    fetchPost()
  }, [])
```

See, we use axios to send request, and we have no idea how long it will take for our requests to be sent. We wait for the `await Axios.get(...)` to finish, and then
we update the state. The problem is that you can no longer mounted or rendered it to the screen.<br>
Here's what is going on. Imagine this `await Axios.get(...)` takes 3 or 4 seconds to complete. But if during the 3 or 4 seconds, the user clicks away back to the homepage,
well, during another 3 or 4 seconds, ` setPost(response.data) setIsLoading(false) //Here, we want to show loaded contents.`
is still going to be attempted to be executed. Only these code is not in the picture any longer. So, it is a waste of memory and computer resources. So, in order
to solve this problem, we need to clean up after ourseleves.<br>
Soln: within the function `userEfffect`, we can return a cleanup function.<br>

```
useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })

        setPost(response.data)
        setIsLoading(false) //Here, we want to show loaded contents.
      } catch (e) {
        console.log("There was a problem or the request was canceled.")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])
```
