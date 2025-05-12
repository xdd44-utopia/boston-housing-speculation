const transition1Image = document.getElementById('transition1Image');
const transition1Button = document.getElementById('proceedButton');
const transition1Detector = document.getElementById('transition1Detector');

const bubble1 = document.getElementById('bubble1');
const bubble2 = document.getElementById('bubble2');
const bubble3 = document.getElementById('bubble3');
const bubble4 = document.getElementById('bubble4');

var currentBubble1 = 0;

const transition1BaseTop = 0;
const transition1BaseLeft = 0;
var transition1BaseWidth;
var transition1BaseHeight;

addEventListener("load", (event) => {
	transition1BaseWidth = 0.98 * window.innerWidth;
	transition1BaseHeight = window.innerHeight;
	updateTransition1Photo();

	const top = transition1Detector.getBoundingClientRect().top;
	if (top == 0) {
		window.scrollLocked = true;
		startTransitionSequence();
	}
});
addEventListener("resize", (event) => {
	transition1BaseWidth = 0.98 * window.innerWidth;
	transition1BaseHeight = window.innerHeight;
	updateTransition1Photo();
});
addEventListener("scroll", (event) => {
	updateTransition1Photo();
	const top = transition1Detector.getBoundingClientRect().top;
	if (top == 0) {
		window.scrollLocked = true;
		startTransitionSequence();
	} else if ((top <= - window.innerHeight || top >= window.innerHeight)) {
		resetTransitionSequence();
	}
});

transition1Button.addEventListener('click', (event) => {
	currentBubble1++;
	bubble1.style.display = currentBubble1 == 0 ? "block" : "none";
	bubble2.style.display = currentBubble1 == 1 ? "block" : "none";
	bubble3.style.display = currentBubble1 >= 2 ? "block" : "none";
	bubble4.style.display = currentBubble1 >= 2 ? "block" : "none";
	if (currentBubble1 >= 3) {
		window.scrollLocked = false;
		window.scrollDown();
		transition1Button.style.display = "none";
	}
}, { passive: false });

transition1Image.addEventListener('click', (event) => {
	currentBubble1++;
	bubble1.style.display = currentBubble1 == 0 ? "block" : "none";
	bubble2.style.display = currentBubble1 == 1 ? "block" : "none";
	bubble3.style.display = currentBubble1 >= 2 ? "block" : "none";
	bubble4.style.display = currentBubble1 >= 2 ? "block" : "none";
	if (currentBubble1 >= 3) {
		window.scrollLocked = false;
		window.scrollDown();
	}
}, { passive: false });

function updateTransition1Photo() {
	const top = transition1Detector.getBoundingClientRect().top;
	const scale = 5;
	transition1Image.style.width = `${transition1BaseWidth * (Math.abs(top) * scale / transition1BaseWidth + 1)}px`;
	transition1Image.style.height = `${transition1BaseHeight * (Math.abs(top) * scale / transition1BaseHeight + 1) - 1}px`;
	if (top < 0) {
		transition1Image.style.top = `${transition1BaseTop + top * 0.7}px`;
		transition1Image.style.left = `${transition1BaseLeft + top * 3.4}px`;
		transition1Image.style.opacity = `${1 + top / 0.9 / window.innerHeight}`;
	}
	else {
		transition1Image.style.top = `${transition1BaseTop - top * 2.65}px`;
		transition1Image.style.left = `${transition1BaseLeft - top * 3.4}px`;
		transition1Image.style.opacity = `${1 - top / 0.9 / window.innerHeight}`;
	}
	transition1Image.style.display = (top < - 0.96 * window.innerHeight || top > 0.96 * window.innerHeight) ? "none" : "block";
}



function startTransitionSequence() {
	bubble1.style.display = "block";
	bubble2.style.display = "none";
	bubble3.style.display = "none";
	bubble4.style.display = "none";
	transition1Button.style.display = "block";
	currentBubble1 = 0;
}

function resetTransitionSequence() {
	bubble1.style.display = "block";
	bubble2.style.display = "none";
	bubble3.style.display = "none";
	bubble4.style.display = "none";
	transition1Button.style.display = "block";
	window.scrollLocked = false;
	currentBubble1 = 0;
}