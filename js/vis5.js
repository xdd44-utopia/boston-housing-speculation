const gameState = {
	player: {
		cash: 20000,
		houses: []
	},
	currentHouseForSale: null,
	round: 1,
	inflation: 1,
	gameoverRounds: 0,
	logs: []
};

const MAX_HOUSES = 3;
const INTEREST_RATE = 0.2;
const PRICE_FLUCTUATION_MIN = -0.2;
const PRICE_FLUCTUATION_MAX = 0.16;

class House {
	constructor(id, downPayment, monthlyPayment) {
		this.id = id;
		this.downPayment = downPayment;
		this.monthlyPayment = monthlyPayment;
		this.currentPrice = downPayment;
		this.priceChange = 0; // 0: initial 1: up -1: down
	}
}

const vis5Detector = document.getElementById("vis5Container");

addEventListener("load", (event) => {
	initGame();
});

addEventListener("scroll", (event) => {
	const top = vis5Detector.getBoundingClientRect().top;
	if (top == 0) {
		initGame();
	}
});
  
function initGame() {
	gameState.player.cash = 16384;
	gameState.player.houses = [];
	gameState.round = 1;
	gameState.inflation = 1;
	gameState.gameoverRounds = 0;
	gameState.logs = [];
	
	generateNewHouseForSale();
	updateDisplay();
	togglePassButton(true);

	document.getElementById('gameoverText').style.display = 'none';
}
  
function generateNewHouseForSale() {
	const id = Date.now();
	const downPayment = Math.floor(Math.random() * 5000 * gameState.inflation) + 3000 * gameState.inflation;
	const monthlyPayment = Math.floor(Math.random() * 500 * gameState.inflation) + 300 * gameState.inflation;
	
	gameState.currentHouseForSale = new House(id, downPayment, monthlyPayment);
	document.getElementById("downPrice").innerText = `Down Payment: ${downPayment.toFixed(2)}`;
	document.getElementById("monthlyPrice").innerText = `Monthly Payment: ${monthlyPayment.toFixed(2)}`;
}
  
function addLog(message) {
	gameState.logs.push(message);
	const logEntries = document.getElementsByClassName('logEntry');
	for (let i=0;i<4;i++) {
		logEntries[i].innerText = "";
	}
	for (let i = 0; i < 4 && i < gameState.logs.length; i++) {
		logEntries[i].innerText = gameState.logs[gameState.logs.length - i - 1];
	}
}

function buyHouse() {
	
	const house = gameState.currentHouseForSale;

	endRound();
	
	gameState.player.cash -= house.downPayment;
	gameState.player.houses.push(house);
	addLog(`Bought House: - $${house.downPayment.toFixed(2)}`);
	updateDisplay();
}

function toggleBuyButton(enabled) {
	const buyButton = document.getElementById('buyButton');
	if (enabled) {
		buyButton.style.cursor = 'pointer';
		buyButton.onclick = buyHouse;
		buyButton.onmouseover = function() {
			this.style.borderColor = 'black';
		};
		buyButton.onmouseout = function() {
			this.style.borderColor = 'white';
		}
		buyButton.style.backgroundColor = 'white';
	} else {
		buyButton.style.cursor = 'default';
		buyButton.onclick = null;
		buyButton.onmouseover = function() {
			this.style.borderColor = '#CCC';
		};
		buyButton.onmouseout = function() {
			this.style.borderColor = '#CCC';
		}
		buyButton.style.backgroundColor = '#CCC';
	}
}

function passOnHouse() {
	endRound();
}

function togglePassButton(enabled) {
	const passButton = document.getElementById('passButton');
	if (enabled) {
		passButton.style.cursor = 'pointer';
		passButton.onclick = passOnHouse;
		passButton.onmouseover = function() {
			this.style.borderColor = 'black';
		};
		passButton.onmouseout = function() {
			this.style.borderColor = 'white';
		}
		passButton.style.backgroundColor = 'white';
	} else {
		passButton.style.cursor = 'default';
		passButton.onclick = null;
		passButton.onmouseover = function() {
			this.style.borderColor = '#CCC';
		};
		passButton.onmouseout = function() {
			this.style.borderColor = '#CCC';
		}
		passButton.style.backgroundColor = '#CCC';
	}
}

function sellHouse(houseIndex) {
	const house = gameState.player.houses[houseIndex];
	gameState.player.cash += house.currentPrice;
	
	gameState.player.houses.splice(houseIndex, 1);
	
	addLog(`Sold House #${houseIndex + 1}: + $${house.currentPrice.toFixed(2)}`);
	
	updateDisplay();

	endRound();
}

function updateHousePrices() {
	for (let i=0;i<gameState.player.houses.length;i++) {
		const fluctuation = PRICE_FLUCTUATION_MIN + Math.random() * (PRICE_FLUCTUATION_MAX - PRICE_FLUCTUATION_MIN);
		const priceChange = gameState.player.houses[i].currentPrice * fluctuation;
		gameState.player.houses[i].currentPrice += priceChange;
		gameState.player.houses[i].priceChange = priceChange >= 0 ? 1 : -1;
	}
	updateDisplay();
}

function processMonthlyPayments() {
	
	for (let i=0;i<gameState.player.houses.length;i++) {
		const payment = gameState.player.houses[i].monthlyPayment * (1 + INTEREST_RATE);
		gameState.player.houses[i].currentPrice += payment;
		addLog(`Monthly payment for House #${i + 1}: - $${payment.toFixed(2)}`);
		gameState.player.cash -= payment;
	}
	
	handleRent();
	handleDebt();
}

function handleDebt() {
	while (gameState.player.cash < 0 && gameState.player.houses.length > 0) {
		gameState.player.houses.sort((a, b) => b.currentPrice - a.currentPrice);
		
		const house = gameState.player.houses[0];
		gameState.player.cash += house.currentPrice;
		addLog(`House #${1} was forcefully sold for $${house.currentPrice.toFixed(2)} due to debt.`);
		gameState.player.houses.shift();
	}
	updateDisplay();
}

function handleRent() {
	for (let i=0;i<gameState.player.houses.length; i++) {
		const gotRent = Math.random() > 0.5;
		if (gotRent) {
			const rent = Math.floor(Math.random() * 2000) + 500;
			gameState.player.cash += rent;
			addLog(`Received rent from House #${i + 1}: +$${rent.toFixed(2)}`);
		}
	} 
}

function endRound() {
	
	processMonthlyPayments();
	
	gameState.round++;
	gameState.inflation += gameState.round < 10 ? 0.125 : 0.25;

	console.log(gameState.player.houses);
	
	updateHousePrices();
	generateNewHouseForSale();

	updateDisplay();
	
	if (isGameOver()) {
		gameState.gameoverRounds++;
		if (gameState.gameoverRounds >= 3) {
			toggleBuyButton(false);
			togglePassButton(false);
			document.getElementById('gameoverText').style.display = 'block';
			console.log("?");
		}
	}
	else {
		gameState.gameoverRounds = 0;
	}
	
}

function isGameOver() {
	return (gameState.player.cash < 0 && gameState.player.houses.length == 0) || (gameState.player.cash < gameState.currentHouseForSale.downPayment && gameState.player.houses.length == 0);
}

function updateDisplay() {
	const possessions = document.getElementsByClassName('possessProperty');
	const possessPrices = document.getElementsByClassName('possessPrice');
	for (let i=0;i<gameState.player.houses.length;i++) {
		possessions[i].style.display = "block";
		possessPrices[i].innerText = `$${gameState.player.houses[i].currentPrice.toFixed(2)}`;
		switch (gameState.player.houses[i].priceChange) {
			case 0: possessPrices[i].style.color = "black"; break;
			case 1: possessPrices[i].style.color = "#0e6800"; break;
			case -1: possessPrices[i].style.color = "#af0000"; break;
		}
	}
	for (let i=gameState.player.houses.length;i<3;i++) {
		possessions[i].style.display = "none";
	}
	document.getElementById('cash').innerText = `Cash: $${gameState.player.cash.toFixed(2)}`;
	toggleBuyButton(gameState.player.cash > gameState.currentHouseForSale.downPayment);
}