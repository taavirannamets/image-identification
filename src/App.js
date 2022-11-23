import { useState, useEffect, useRef } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'

function App() {
	const [isLoading, setIsLoading] = useState(false)
	const [model, setModel] = useState(null)
	const [imageURL, setImageURL] = useState(null)
	const [results, setResults] = useState([])

	const imageRef = useRef()
	const textInputRef = useRef()
	const fileInputRef = useRef()

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

	const identify = async () => {
		textInputRef.current.value = ''
		const results = await model.classify(imageRef.current)
		setResults(results)
	}

	const handleChange = e => {
		setImageURL(e.target.value)
		setResults([])
	}

	const triggerUpload = () => {
		fileInputRef.current.click()
	}

	useEffect(() => {
		loadModel()
	}, [])

	if (isLoading) {
		return <div>Loading...</div>
	}

	console.log(results)

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
					ref={fileInputRef}
				/>
				<button className='upload-image' onClick={triggerUpload}>
					Upload image
				</button>
				<span className='or'>or</span>
				<input
					type='text'
					placeholder='Paste image URL...'
					crossOrigin='anonymous'
					ref={textInputRef}
					onChange={handleChange}
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
					{results.length > 0 && (
						<div className='results-holder'>
							{results.map((result, index) => {
								return (
									<div className='result' key={result.className}>
										<span className='name'>{result.className}</span>
										<span className='confidence'>
											Confidence level: {(result.probability * 100).toFixed(0)}%{' '}
											{index === 0 && (
												<span className='best-guess'>Top Result</span>
											)}
										</span>
									</div>
								)
							})}
						</div>
					)}
				</div>
				{imageURL && (
					<button className='btn' onClick={identify}>
						Identify this image
					</button>
				)}
			</div>
		</div>
	)
}

export default App
