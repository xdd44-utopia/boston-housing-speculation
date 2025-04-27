var isFrameOut = true;

const texts = [
	"Some oversea clients are calling you...",
	"In Downtown Boston, xx% of high-end housing stocks are owned by foreign-investors.",
	"This type of home-buyers are treating properties as commodities, and usually they don't even live here...",
	"Get ready to enter your virtual meeting and give a room tour to these investors..."
];

const textDisplay = document.getElementById('vis2MainText');
const meetingInterface = document.getElementById('clientMeeting');

let currentTextIndex = 0;
let sequenceStarted = false;
let timeoutId = null;

addEventListener("load", (event) => {
	resetSequence();
	const detector = document.getElementById('clientBackground');
	const top = detector.getBoundingClientRect().top;
	if (top == 0 && !sequenceStarted) {
		startTextSequence();
	}
});
addEventListener("scroll", (event) => {
	const detector = document.getElementById('clientBackground');
	const top = detector.getBoundingClientRect().top;
	if (top == 0 && !sequenceStarted) {
		startTextSequence();
	} else if ((top <= - window.innerHeight || top >= window.innerHeight) && sequenceStarted) {
		resetSequence();
	}
});

function displayText(text) {
	textDisplay.style.opacity = 0;
	
	setTimeout(() => {
		textDisplay.textContent = text;
		textDisplay.style.opacity = 1;
	}, 1000);
}

function startTextSequence() {
	if (sequenceStarted) return;
	sequenceStarted = true;
	currentTextIndex = 0;
	
	displayText(texts[currentTextIndex]);
	
	function scheduleNextText() {
		currentTextIndex++;
		if (currentTextIndex < texts.length) {
			timeoutId = setTimeout(() => {
				displayText(texts[currentTextIndex]);
				scheduleNextText();
			}, 5000);
		} else {
			timeoutId = setTimeout(() => {
				meetingInterface.style.display = 'block';
			}, 5000);
		}
	}
	
	timeoutId = setTimeout(scheduleNextText, 0);
}

function resetSequence() {
	sequenceStarted = false;
	currentTextIndex = 0;
	textDisplay.textContent = '';
	textDisplay.style.opacity = 0;
	meetingInterface.style.display = 'none';
	
	if (timeoutId) {
		clearTimeout(timeoutId);
		timeoutId = null;
	}
}