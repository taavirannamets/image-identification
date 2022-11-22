import { useState, useEffect } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'

function App() {
	const [isLoading, setIsLoading] = useState(false)
	const [model, setModel] = useState(null)
	const [imageURL, setImageURL] = useState(null)

	const loadModel = async () => {
		setIsLoading(true)

		try {
			const model = await mobilenet.load()
			setModel(model)
			setIsLoading(false)
		} catch (err) {
			console.log(err)
			setIsLoading(false)
		}
	}

	useEffect(() => {
		loadModel()
	}, [])

	if (isLoading) {
		return <div>Loading...</div>
	}

	return (
		<div className='App'>
			<h1 className='header'>Image classification</h1>
			<div className='input-holder'>
				<input
					type='file'
					accept='image/'
					capture='camera'
					className='upload-input'
				/>
			</div>
		</div>
	)
}

export default App
