# Profile Not Found Situation
In our `Profile.js` component we didn't account for what should happen if someone visits a URL for a username that doesn't exist.
Inside our Axios request, you can use an `if` statement, and if `response.data` evaluates to false, that means it's empty,
and the server didn't send anything back for that particular username because that user doesn't exist. 
In this case we'd want to render our `<NotFound />` component instead of any profile JSX.


# Login Form: Highlight Empty Fields With Red Border
In our `HeaderLoggedOut.js` component if a visitor submits the login form while leaving either the username field or password
field blank we should prevent any Axios request from ever being sent, as it's obviously going to fail.
Also, if a field is left blank give the `input` element in question an additional class of `is-invalid` which will give it a red border to indicate 
to the user what's wrong.

# Allow For Other Color of Flash Messages (Not Only Green)
In our `FlashMessages.js` component the class of `alert-success` is what makes the flash message have a green background color. Our CSS (Bootstrap) design allows for other class names that create other colors of flash messages:

`alert-primary` (blue)

`alert-secondary` (gray)

`alert-success` (green)

`alert-danger` (red)

`alert-warning` (yellow)

`alert-info` (light blue/teal)

`alert-light`

`alert-dark`

With this in mind, you might want to show a red flash message for situations that aren't positive.
For example, if a user tries to visit the `/edit` URL for a post that they aren't the author of.
The "You do not have permission to edit that post" message would probably make more sense in red instead of green.

Adjust the way you use `appDispatch()` to add flash messages throughout our app so that you also pass along a phrase like "success" or "danger" 
or "primary" to control the color of the message. Then, in FlashMessages.js adjust 
things so that the `alert-success` class is no longer hard-coded and is instead dynamic.
