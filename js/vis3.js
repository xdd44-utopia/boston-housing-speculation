document.addEventListener("DOMContentLoaded", () => {
	const svg = d3.select("#desk-svg");
	const arrow = document.getElementById("price-arrow");
	const label = document.getElementById("price-label");
	const dropdown = document.getElementById("city-select");


	// Load and bind data
	d3.csv("./files/ownership_and_vacancy_over_time.csv").then(files => {
		console.log("Loaded rows:", files.length);
		console.log(files[0]);

		//group by city
		const cityMap = new Map();
		files.forEach(d => {
			if (!cityMap.has(d.city)) {
				cityMap.set(d.city, {
					city: d.city,
					corporateSales: +d.corporate_sales,
					totalSales: +d.total_sales
				});
			} else {
				const existing = cityMap.get(d.city);
				existing.corporateSales += +d.corporate_sales;
				existing.totalSales += +d.total_sales;
			}
		});

			// create array with corporate ratio and sort
			const cities = Array.from(cityMap.values()).map(d => ({
				city: d.city,
				corporateRatio: d.corporateSales / d.totalSales
			}));
			cities.sort((a, b) => a.corporateRatio - b.corporateRatio);
			
			//scroll and mouseover
			const cityList = document.getElementById("city-list");

			cities.forEach(({ city, corporateRatio }) => {
				const cityDiv = document.createElement("div");
				cityDiv.classList.add("city-entry"); 
				cityDiv.textContent = `${city}`;

				cityDiv.addEventListener("mouseenter", () => {
					const allCities = cityList.querySelectorAll(".city-entry");
					allCities.forEach(div => div.classList.remove("selected"));
					cityDiv.classList.add("selected");
					
					updateViz(city);
				});

				cityList.appendChild(cityDiv);
			});

			
			// define price scale
			const priceExtent = d3.extent(files, d => +d.avg_price); 

			const priceScale = d3.scaleLog()
					.domain(priceExtent)
					.range([170, 10]);  
	

			//auto scroll
			let scrollInterval = null;

			cityList.addEventListener("mousemove", (event) => {
				const bounds = cityList.getBoundingClientRect();
				const mouseY = event.clientY - bounds.top;

				const scrollThreshold = 40; 
				const scrollSpeed = 5; 

				clearInterval(scrollInterval); 

				if (mouseY < scrollThreshold) {
					scrollInterval = setInterval(() => {
						cityList.scrollTop -= scrollSpeed;
					}, 16); // ~60fps
				} else if (mouseY > bounds.height - scrollThreshold) {
					scrollInterval = setInterval(() => {
						cityList.scrollTop += scrollSpeed;
					}, 16);
				}
			});

			cityList.addEventListener("mouseleave", () => {
				clearInterval(scrollInterval);
			});

			updateViz(cities[0].city);


		function updateViz(city) {

			const cityRows = files.filter(row => row.city === city);
			if (cityRows.length === 0) return;

			const totalCorporateSales = cityRows.reduce((sum, d) => sum + (+d.corporate_sales), 0);
			const totalOwnerOccSales = cityRows.reduce((sum, d) => sum + (+d.owner_occ_sales), 0);
			const totalSales = cityRows.reduce((sum, d) => sum + (+d.total_sales), 0);
			const avgPrice = cityRows.reduce((sum, d) => sum + (+d.avg_price), 0) / cityRows.length;

			const corporateRatio = totalCorporateSales / totalSales;
			const ownerRatio = totalOwnerOccSales / totalSales;

			const priceAmount = document.getElementById("price-amount");
			if (priceAmount) {
					priceAmount.textContent = `$${Math.round(avgPrice).toLocaleString()}`;
			}

			arrow.style.top = `${priceScale(avgPrice)}px`;

			svg.selectAll("*").remove();

			const viewBoxWidth = 800;
			const viewBoxHeight = 400;

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

document.getElementById("city-list").addEventListener("mouseenter", (event) => {
	window.scrollLocked = true;
})

document.getElementById("city-list").addEventListener("mouseleave", (event) => {
	window.scrollLocked = false;
})