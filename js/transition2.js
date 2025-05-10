const transition2Image = document.getElementById('transition2Image');
const transition2Detector = document.getElementById('transition2Detector');

const transition2BaseTop = 0;
const transition2BaseLeft = 0;
var transition2BaseWidth;
var transition2BaseHeight;

addEventListener("load", (event) => {
	transition2BaseWidth = 0.98 * window.innerWidth;
	transition2BaseHeight = window.innerHeight;
	updateTransition2Photo();
});
addEventListener("resize", (event) => {
	transition2BaseWidth = 0.98 * window.innerWidth;
	transition2BaseHeight = window.innerHeight;
	updateTransition2Photo();
});
addEventListener("scroll", (event) => {
	updateTransition2Photo();
});

function updateTransition2Photo() {
	const top = transition2Detector.getBoundingClientRect().top;
	const scale = 5;
	transition2Image.style.width = `${transition2BaseWidth * (Math.abs(top) * scale / transition2BaseWidth + 1)}px`;
	transition2Image.style.height = `${transition2BaseHeight * (Math.abs(top) * scale / transition2BaseHeight + 1) - 1}px`;
	if (top < 0) {
		transition2Image.style.top = `${transition2BaseTop + top * 0.7}px`;
		transition2Image.style.left = `${transition2BaseLeft + top * 3.4}px`;
		transition2Image.style.opacity = `${1 + top / 0.9 / window.innerHeight}`;
	}
	else {
		transition2Image.style.top = `${transition2BaseTop - top * 2.65}px`;
		transition2Image.style.left = `${transition2BaseLeft - top * 3.4}px`;
		transition2Image.style.opacity = `${1 - top / 0.9 / window.innerHeight}`;
	}
	transition2Image.style.display = (top < - 0.96 * window.innerHeight || top > 0.96 * window.innerHeight) ? "none" : "block";
}