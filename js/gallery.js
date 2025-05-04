window.scrollLocked = false;

var currentPage = 0;
var num = 0;

numIntroPage = 2;
numPage = 9;
var barLength = 100 / (numPage - numIntroPage);

titleTexts = ['Affordability', 'Virtual Tour', 'Ownership', 'Vacancy Rate', '!?#%', 'Flipping Trend', 'Acknowledgement']


document.onkeydown = onKeyDown;
window.onload = setUp();
addEventListener("scroll", (event) => {
	checkScroll();
});
addEventListener("resize", (event) => {
	checkScroll();
});

function setUp() {
	num = document.getElementsByClassName('container').length;
	document.getElementById('upArrow').onclick = scrollUp;
	document.getElementById('downArrow').onclick = scrollDown;
	currentPage = 0;
	document.getElementById('currentTitle').style.height = `${barLength}%`;
	checkScroll();
}

let lastWheelTime = 0;
const wheelThreshold = 200;
const trackpadThreshold = 1600;

document.addEventListener('wheel', function(e) {

	if (window.scrollLocked) {
		return;
	}
	e.preventDefault();

	var isTrackpad = false;
	if (e.wheelDeltaY) {
		if (e.wheelDeltaY === (e.deltaY * -3)) {
		isTrackpad = true;
		}
	}
	else if (e.deltaMode === 0) {
		isTrackpad = true;
	}
	
	const now = Date.now();
	if (now - lastWheelTime > (isTrackpad ? trackpadThreshold : wheelThreshold)) {
		currentPage += e.deltaY > 0 ? 1 : -1;
		currentPage = Math.min(Math.max(currentPage, 0), numPage - 1);
		scroll(currentPage);
		lastWheelTime = now;
	}

}, { passive: false });

var touchStartY;

document.addEventListener('touchstart', function(e) {
	if (!window.scrollLocked) {
		touchStartY = e.touches[0].clientY;
		e.preventDefault();
	}
}, { passive: false });

document.addEventListener('touchmove', function(e) {
	if (window.scrollLocked) {
		return;
	}
	e.preventDefault();

	const now = Date.now();
	if (now - lastWheelTime > wheelThreshold) {
		const touchY = e.touches[0].clientY;
		const diff = touchStartY - touchY;
		if (Math.abs(diff) > 20) {
			currentPage += diff > 0 ? 1 : -1;
			currentPage = Math.min(Math.max(currentPage, 0), numPage - 1);
			scroll(currentPage);
			touchStartY = touchY;
		}
		lastWheelTime = now;
	}
}, { passive: false });

function onKeyDown(event) {
	if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.code) > -1) {
		event.preventDefault();
	}
	var event = event || window.event;
	switch (event.keyCode) {
		case 38:
			scrollUp();
			break;
		case 87:
			scrollUp();
			break;
		case 40:
			scrollDown();
			break;
		case 83:
			scrollDown();
			break;
	}
}

function scrollUp() {
	if (currentPage > 0) {
		currentPage--;
		scroll(currentPage);
	}
}

function scrollDown() {
	if (currentPage < num - 1) {
		currentPage++;
		scroll(currentPage);
	}
}

function scroll(index) {
	document.getElementsByClassName('container')[index].scrollIntoView();
}

function checkScroll() {
	for (let i = 0; i < num; i++) {
		const top = document.getElementsByClassName('container')[i].getBoundingClientRect().top;
		const bottom = document.getElementsByClassName('container')[i].getBoundingClientRect().bottom;
		const center = (top + bottom) / 2;
		if (center > 5 && center < window.innerHeight - 5) {
			currentPage = i;
			break;
		}
	}

	if (currentPage < numIntroPage) {
		document.getElementById('progressBarContainer').style.left = "100vw";
		document.getElementById('currentTitleText').innerText = "";
		document.getElementById('upperBar').style.height = "0";
		document.getElementById('lowerBar').style.height = "100%";
	}
	else {
		document.getElementById('progressBarContainer').style.left = "98vw";
		document.getElementById('currentTitleText').innerText = titleTexts[currentPage - numIntroPage];
		document.getElementById('upperBar').style.height = `${(currentPage - numIntroPage) * barLength}%`;
		document.getElementById('lowerBar').style.height = `${(numPage - numIntroPage - currentPage + 1) * barLength}%`;
	}

	document.getElementById('upArrowImg').style.display = "block";
	document.getElementById('downArrowImg').style.display = "block";
	if (currentPage == 0) {
		document.getElementById('upArrowImg').style.display = "none";
	} else if (currentPage == num - 1) {
		document.getElementById('downArrowImg').style.display = "none";
	}
}