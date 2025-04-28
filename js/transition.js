const transitionImage = document.getElementById('transitionImage');
const transitionDetector = document.getElementById('transitionDetector');

const transitionBaseTop = 0;
const transitionBaseLeft = 0;
var transitionBaseWidth;
var transitionBaseHeight;

addEventListener("load", (event) => {
	transitionBaseWidth = 0.98 * window.innerWidth;
	transitionBaseHeight = window.innerHeight;
	updateTransitionPhoto();
});
addEventListener("resize", (event) => {
	transitionBaseWidth = 0.98 * window.innerWidth;
	transitionBaseHeight = window.innerHeight;
	updateTransitionPhoto();
});
addEventListener("scroll", (event) => {
	updateTransitionPhoto();
});

function updateTransitionPhoto() {
	const top = transitionDetector.getBoundingClientRect().top;
	const scale = 5;
	transitionImage.style.width = `${transitionBaseWidth * (Math.abs(top) * scale / transitionBaseWidth + 1)}px`;
	transitionImage.style.height = `${transitionBaseHeight * (Math.abs(top) * scale / transitionBaseHeight + 1) - 1}px`;
	if (top < 0) {
		transitionImage.style.top = `${transitionBaseTop + top * 0.7}px`;
		transitionImage.style.left = `${transitionBaseLeft + top * 3.4}px`;
		transitionImage.style.opacity = `${1 + top / 0.9 / window.innerHeight}`;
	}
	else {
		transitionImage.style.top = `${transitionBaseTop - top * 2.65}px`;
		transitionImage.style.left = `${transitionBaseLeft - top * 3.4}px`;
		transitionImage.style.opacity = `${1 - top / 0.9 / window.innerHeight}`;
	}
	transitionImage.style.display = (top < - 0.96 * window.innerHeight || top > 0.96 * window.innerHeight) ? "none" : "block";
}