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
	const scale = -0.004;
	if (top < 0) {
		introImage.style.top = `${baseTop + top * 0.16}px`;
		introImage.style.left = `${baseLeft + top * 3.1}px`;
		introImage.style.width = `${baseWidth * (top * scale + 1)}px`;
		introImage.style.height = `${baseHeight * (top * scale + 1)}px`;
		introImage.style.opacity = `${1 + top / 0.96 / window.innerHeight}`;
	}
	introImage.style.display = top < - 0.96 * window.innerHeight ? "none" : "block";
}