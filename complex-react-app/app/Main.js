import React from 'react'
import ReactDOM from 'react-dom'

function ExampleComponent() {
	return (
		<div>
			<h1>This is our APP.</h1>
			<p>The sky is blues.</p>
		</div>
	)
}

ReactDOM.render(<ExampleComponent />, document.querySelector('#app'))

if (module.hot) {
	module.hot.accept()
}
