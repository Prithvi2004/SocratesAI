import { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import { Context } from "../../context/Context";

const Main = () => {
	const {
		onSent,
		recentPrompt,
		showResults,
		loading,
		resultData,
		setInput,
		input,
	} = useContext(Context);
	const [speechRecognition, setSpeechRecognition] = useState(null);
	const [isListening, setIsListening] = useState(false);

	// Function to handle gallery selection
	const handleGalleryClick = () => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.onchange = (event) => {
			const file = event.target.files[0];
			if (file) {
				console.log("Selected file:", file);
			}
		};
		fileInput.click();
	};

	// Function to handle microphone input
	const handleMicClick = () => {
		if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
			alert("Speech Recognition not supported in this browser.");
			return;
		}

		const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
		recognition.lang = 'en-US';
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;

		recognition.start();
		setIsListening(true); // Show the popup when speech recognition starts

		recognition.onresult = (event) => {
			const speechResult = event.results[0][0].transcript;
			setInput(speechResult);
			setIsListening(false); // Hide the popup when speech is captured
		};

		recognition.onerror = (event) => {
			console.error("Speech recognition error:", event.error);
			setIsListening(false); // Hide the popup if an error occurs
		};

		recognition.onend = () => {
			setIsListening(false); // Hide the popup when speech recognition ends
		};

		setSpeechRecognition(recognition);
	};

	// Handle pressing the "Enter" key
	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault(); // Prevent form submission if in a form context
			console.log("Input value before sending:", input); // Debugging line
			onSent(); // Send the input when Enter is pressed
		}
	};

	// Attach the "Enter" key event listener to the input field
	useEffect(() => {
		const inputField = document.getElementById('prompt-input');
		if (inputField) {
			inputField.addEventListener('keypress', handleKeyPress);
		}

		// Cleanup the event listener when component unmounts
		return () => {
			if (inputField) {
				inputField.removeEventListener('keypress', handleKeyPress);
			}
		};
	}, [input]); // Include input in dependencies to ensure the latest state is captured

	const handleCardClick = (promptText) => {
		setInput(promptText);
	};

	return (
		<div className="main">
			<div className="nav">
				<p>SocratesAI</p>
				<img src={assets.user} alt="" />
			</div>
			<div className="main-container">
				{!showResults ? (
					<>
						<div className="greet">
							<p>
								<span>Hello, Dev </span>
							</p>
							<p>How Can I Help You Today?</p>
						</div>
						<div className="cards">
							<div
								className="card"
								onClick={() => handleCardClick("Suggest Some Place To Visit In Kerala")}
							>
								<p>Suggest Some Place To Visit In Kerala </p>
								<img src={assets.compass_icon} alt="" />
							</div>
							<div
								className="card"
								onClick={() =>
									handleCardClick("Brainstorm team bonding activities for our work retreat")
								}
							>
								<p>Brainstorm team bonding activities for our work retreat </p>
								<img src={assets.message_icon} alt="" />
							</div>
							<div
								className="card"
								onClick={() =>
									handleCardClick("How to Create a Gyroscope using Disc?")
								}
							>
								<p>How to Create a Gyroscope using Disc?</p>
								<img src={assets.bulb_icon} alt="" />
							</div>
							<div
								className="card"
								onClick={() => {
									handleCardClick("Create a Script for the YouTube video about coding");
								}}
							>
								<p>Create a Script for the YouTube video about coding</p>
								<img src={assets.code_icon} alt="" />
							</div>
						</div>
					</>
				) : (
					<div className="result">
						<div className="result-title">
							<img src={assets.user} alt="" />
							<p>{recentPrompt}</p>
						</div>
						<div className="result-data">
							<img src={assets.gemini_icon} alt="" />
							{loading ? (
								<div className="loader">
									<hr />
									<hr />
									<hr />
								</div>
							) : (
								<p dangerouslySetInnerHTML={{ __html: resultData }}></p>
							)}
						</div>
					</div>
				)}

				<div className="main-bottom">
					<div className="search-box">
						<input
							id="prompt-input"
							onChange={(e) => setInput(e.target.value)}
							value={input}
							type="text"
							placeholder="Enter the Prompt Here"
						/>
						<div>
							<img src={assets.gallery_icon} alt="" onClick={handleGalleryClick} />
							<img src={assets.mic_icon} alt="" onClick={handleMicClick} />
							<img
								src={assets.send_icon}
								alt=""
								onClick={() => {
									onSent();
								}}
							/>
						</div>
					</div>
					<div className="bottom-info">
						<p>
							SocratesAI may display inaccurate info, including about people, so
							double-check its responses. Your privacy & SocratesAI Apps
						</p>
					</div>
				</div>
			</div>

			{/* Microphone listening popup */}
			{isListening && (
				<div className="mic-popup">
					<p>🎙️ Capturing your voice... Please speak now.</p>
				</div>
			)}
		</div>
	);
};

export default Main;
