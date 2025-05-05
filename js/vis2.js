const texts = [
	"Some oversea clients are calling you...",
	"In Downtown Boston, 1 in 5 homes are owned by investors.",
	"This type of home-buyers are treating properties as commodities, and usually they don't even live here...",
	"Get ready to enter your virtual meeting and give a room tour to these investors..."
];

const tourPorperties = [
	"https://my.matterport.com/show?m=xC9M14C6DFD",
	"https://my.matterport.com/show?m=gPcncrtmPkJ",
	"https://my.matterport.com/show?m=4TLU22XdCdL"
]

const tourEmojis = ['🔥', '❤️', '👏', '👍']
const tourEmojiElements = document.getElementsByClassName('clientEmoji');
var tourEmojiTimeoutID;

const textDisplay = document.getElementById('vis2MainText');
const meetingInterface = document.getElementById('clientMeeting');
const vis2Detector = document.getElementById('clientBackground');
const vis2Icon = document.getElementById('loadingIcon');
const tourIframe = document.getElementById('roomTour');

let currentTextIndex = 0;
let currentTourIndex = 0;

addEventListener("load", (event) => {
	resetSequence();

	const vis2Detector = document.getElementById('clientBackground');
	const top = vis2Detector.getBoundingClientRect().top;
	if (top == 0) {
		startSequence();
	}
});
addEventListener("scroll", (e) => {
	e.preventDefault();
	const top = vis2Detector.getBoundingClientRect().top;
	if (top == 0) {
		startSequence();
	} else if ((top <= - window.innerHeight || top >= window.innerHeight)) {
		resetSequence();
	}
});

vis2Detector.addEventListener('click', handleClick, { passive: false });
vis2Icon.addEventListener('click', handleClick, { passive: false });

let vis2LastClickTime = 0;
const vis2ClickThreshold = 1000;

function handleClick(e) {
	e.preventDefault();
	e.stopPropagation();

	const now = Date.now();
	if (now - vis2LastClickTime > vis2ClickThreshold) {
		textDisplay.style.opacity = 0;
		currentTextIndex++;
		if (currentTextIndex < texts.length) {
			setTimeout(() => {
				textDisplay.textContent = texts[currentTextIndex];
				textDisplay.style.opacity = 1;
			}, 1000);
		} else {
			for (let i=0;i<tourEmojiElements.length;i++) {
				tourEmojiElements[i].style.visibility = 'hidden';
			}
			setTimeout(() => {
				meetingInterface.style.display = 'block';
			}, 500);
			setTimeout(() => {
				animateRandomEmoji();
			}, 2500);
		}
		vis2LastClickTime = now;
	}
}

function startSequence() {
	vis2LastClickTime = 0;
	currentTextIndex = 0;
}

function resetSequence() {
	sequenceOngoing = false;
	currentTextIndex = 0;
	currentTourIndex = 0;
	textDisplay.textContent = texts[currentTextIndex];
	textDisplay.style.opacity = 1;
	meetingInterface.style.display = 'none';
	tourIframe.src = tourPorperties[currentTourIndex];
	document.getElementById('nextTourButton').innerText = "Next Property";
	
	if (tourEmojiTimeoutID) {
		clearTimeout(tourEmojiTimeoutID);
		tourEmojiTimeoutID = null;
	}
}

function nextTour() {
	currentTourIndex++;
	if (currentTourIndex < tourPorperties.length) {
		tourIframe.src = tourPorperties[currentTourIndex];
		if (currentTourIndex == tourPorperties.length - 1) {
			document.getElementById('nextTourButton').innerText = "Finish";
		}
	}
	else if (currentTourIndex == tourPorperties.length) {
		window.scrollDown();
	}
}
function animateRandomEmoji() {
	const randomIndex = Math.floor(Math.random() * tourEmojiElements.length);
	const randomElement = tourEmojiElements[randomIndex];
	
	if (randomElement.style.visibility === 'hidden') {
		randomElement.style.visibility = 'visible';
	} else {
		randomElement.style.visibility = 'hidden';
	}
	
	const randomEmojiIndex = Math.floor(Math.random() * tourEmojis.length);
	randomElement.innerText = tourEmojis[randomEmojiIndex];
	
	const randomDuration = Math.floor(Math.random() * 1000) + 500;
	tourEmojiTimeoutID = setTimeout(animateRandomEmoji, randomDuration);
}