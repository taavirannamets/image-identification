import { useState, useEffect, useRef } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'

function App() {
	const [isLoading, setIsLoading] = useState(false)
	const [model, setModel] = useState(null)
	const [imageURL, setImageURL] = useState(null)

	const imageRef = useRef()

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

	const uploadImage = e => {
		const { files } = e.target

		if (files.length > 0) {
			const url = URL.createObjectURL(files[0])
			setImageURL(url)
		} else {
			setImageURL(null)
		}
	}

	console.log(imageURL)

	useEffect(() => {
		loadModel()
	}, [])

	if (isLoading) {
		return <div>Loading...</div>
	}

	return (
		<div className='App'>
			<h1 className='header'>Image identification</h1>
			<div className='input-holder'>
				<input
					type='file'
					accept='image/'
					capture='camera'
					className='upload-input'
					onChange={uploadImage}
				/>
			</div>
			<div className='main-wrapper'>
				<div className='main-content'>
					<div className='image-holder'>
						{imageURL && (
							<img
								src={imageURL}
								alt='Upload preview'
								crossOrigin='anonymous'
								ref={imageRef}
							/>
						)}
					</div>
				</div>
				{imageURL && <button className='btn'>Identify this image</button>}
			</div>
		</div>
	)
}

export default App
