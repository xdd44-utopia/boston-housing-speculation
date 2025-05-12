const introImage = document.getElementById('introImage');
const introDetector = document.getElementById('introDetector');

var baseTop;
var baseLeft;
var baseWidth;
var baseHeight;

addEventListener("load", (event) => {
	baseTop = (window.innerHeight - 0.44 * window.innerWidth) / 2;
	baseLeft = 0.05 * window.innerWidth;
	baseWidth = 0.66 * window.innerWidth;
	baseHeight = 0.44 * window.innerWidth;
	updateIntroPhoto();
});
addEventListener("resize", (event) => {
	baseTop = (window.innerHeight - 0.44 * window.innerWidth) / 2;
	baseLeft = 0.05 * window.innerWidth;
	baseWidth = 0.66 * window.innerWidth;
	baseHeight = 0.44 * window.innerWidth;
	updateIntroPhoto();
});
addEventListener("scroll", (event) => {
	updateIntroPhoto();
});

function updateIntroPhoto() {
	const top = introDetector.getBoundingClientRect().top;
	const scale = 6;
	if (top < 0) {
		introImage.style.top = `${baseTop + top * 0.5}px`;
		introImage.style.left = `${baseLeft + top * 2.7}px`;
		introImage.style.width = `${baseWidth * (- top * scale / baseWidth + 1)}px`;
		introImage.style.height = `${baseHeight * (- top * scale / baseHeight + 1)}px`;
		introImage.style.opacity = `${1 + top / 0.9 / window.innerHeight}`;
	}
	introImage.style.display = top < - 0.96 * window.innerHeight ? "none" : "block";
}