document.addEventListener("DOMContentLoaded", () => {
	const svg = d3.select("#desk-svg");
	const arrow = document.getElementById("price-arrow");
	const label = document.getElementById("price-label");
	const dropdown = document.getElementById("city-select");


	// Load and bind data
	d3.csv("./files/ownership.csv").then(function(data) {

		const cities = Array.from(data).map(d => ({
			city: d.city,
			corporateRatio: +d.corporate_sale_ratio,
			avgPrice: +d.weighted_avg_price
		}));
		cities.sort((a, b) => a.corporateRatio - b.corporateRatio);
			
		const priceExtent = d3.extent(cities, d => d.avgPrice); 
		const priceScale = d3.scaleLog()
				.domain(priceExtent)
				.range([170, 10]);  

		let currentCityIndex = 0;
		let dir = 1;
		updateViz(cities[currentCityIndex].city);

		function autoLoopCities() {
			currentCityIndex += dir;
			if (currentCityIndex == 0 || currentCityIndex == cities.length - 1) {
				dir = -dir;
			}
			updateViz(cities[currentCityIndex].city);
		}
		
		var loopInterval = setInterval(autoLoopCities, 50);

		document.getElementById("searchCityInput").addEventListener('input', (evt) => {
			const inputValue = document.getElementById("searchCityInput").value.trim().toLowerCase();
			
			if (inputValue === "") {
				if (!loopInterval) {
					loopInterval = setInterval(autoLoopCities, 50);
				}
				return;
			}
			
			const index = cities.findIndex(c => c.city.toLowerCase() === inputValue);
			
			if (index >= 0) {
				if (loopInterval) {
					clearInterval(loopInterval);
					loopInterval = null;
				}
				updateViz(cities[index].city);
			} else {
				if (!loopInterval) {
					loopInterval = setInterval(autoLoopCities, 50);
				}
			}
		});

		function updateViz(city) {

			const index = cities.findIndex(c => c.city === city);
			const corporateRatio = cities[index].corporateRatio;
			const ownerRatio = 1 - corporateRatio;
			const avgPrice = cities[index].avgPrice;

			document.getElementById("vis3CityName").innerText = `Neighborhood: ${city}`;
			document.getElementById("price-amount").textContent = `$${Math.round(avgPrice).toLocaleString()}`;

			arrow.style.top = `${priceScale(avgPrice)}px`;

			svg.selectAll("*").remove();

			const tileWidth = 400;
			const tileHeight = 30;
			const tileGap = -25; // space in pixels between tiles
			const barMaxHeight = 280;  // total height for full 100% stack
			const maxLayers = Math.floor(barMaxHeight / (tileHeight + tileGap));

			const corpLayers = Math.round(corporateRatio * maxLayers);
			const ownerLayers = Math.round(ownerRatio * maxLayers);

			const corporateX = 120;
			const ownerX = (corporateX +230);
			const baseY = 320; // Bottom of the stack

			for (let i = 0; i < corpLayers; i++) {
			svg.append("image")
					.attr("href", "./images/leftstack.png")
					.attr("x", corporateX)
					.attr("y", baseY - (i + 1) * (tileHeight + tileGap))
					.attr("width", tileWidth)
					.attr("height", tileHeight);
				
			}

			for (let i = 0; i < ownerLayers; i++) {
				svg.append("image")
					.attr("href", "./images/rightstack.png")
					.attr("x", ownerX)
					.attr("y", baseY - (i + 1) * (tileHeight + tileGap))
					.attr("width", tileWidth)
					.attr("height", tileHeight);
			}

			// Labels
			svg.append("text")
				.attr("x", corporateX + 190)
				.attr("y", baseY + 60)
				.attr("text-anchor", "middle")
				.text("Corporate-Owned");

			svg.append("text")
				.attr("x", ownerX + 210)
				.attr("y", baseY + 60)
				.attr("text-anchor", "middle")
				.text("Owner-Occupied");

			// Corporate % label
			svg.append("text")
			.attr("x", corporateX + 190)
			.attr("y", baseY + 75)  
			.attr("text-anchor", "middle")
			.attr("font-size", "14px")
			.text(`${(corporateRatio * 100).toFixed(1)}%`);

			// Owner-Occupied % label
			svg.append("text")
			.attr("x", ownerX + 210)
			.attr("y", baseY + 75)  
			.attr("text-anchor", "middle")
			.attr("font-size", "14px")
			.text(`${(ownerRatio * 100).toFixed(1)}%`);

		}
	});
});