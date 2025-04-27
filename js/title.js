const detector = document.getElementById('skylineBackground');
const skyline1 = document.getElementById('skyline1');
const skyline2 = document.getElementById('skyline2');
const skyline3 = document.getElementById('skyline3');
const skyline4 = document.getElementById('skyline4');
const bottomBar = document.getElementById('author');

var baseBottom;

addEventListener("load", (event) => {
	baseBottom = window.innerHeight / 10;
	updateGraph();
});
addEventListener("resize", (event) => {
	baseBottom = window.innerHeight / 10;
	updateGraph();
});
addEventListener("scroll", (event) => {
	updateGraph();
});

function updateGraph() {
	const top = detector.getBoundingClientRect().top;
	skyline1.style.bottom = `${baseBottom - top}px`;
	skyline2.style.bottom = `${baseBottom - top / 2}px`;
	skyline3.style.bottom = `${baseBottom - top / 3}px`;
	skyline4.style.bottom = `${baseBottom - top / 4}px`;
	bottomBar.style.top = `${window.innerHeight - baseBottom + top * 2 - 10}px`;
}