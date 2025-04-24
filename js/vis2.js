document.addEventListener("DOMContentLoaded", () => {
    const svg = d3.select("#desk-svg");
    const arrow = document.getElementById("price-arrow");
    const label = document.getElementById("price-label");
    const dropdown = document.getElementById("neighborhood-select");

  
    // Load and bind data
    d3.csv("./files/ownership_and_vacancy_over_time.csv").then(files => {
      console.log("Loaded rows:", files.length);
      console.log(files[0]);
  
      const cities = Array.from(new Set(files.map(d => d.city)));
      cities.forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        dropdown.appendChild(opt);
      });
  
    const priceExtent = d3.extent(files, d => +d.avg_price); 
    // const priceScale = d3.scaleLinear()
    //     .domain(priceExtent)
    //     .range([10, 170]); 
    const priceScale = d3.scaleLog()
        .domain(priceExtent)
        .range([170, 10]);  // flipped because top = high price

  
      dropdown.addEventListener("change", () => updateViz(dropdown.value));
      updateViz(cities[0]);
  
      function updateViz(city) {
        const d = files.find(row => row.city === city);
        if (!d) return;
  
        const corporateRatio = +d.corporate_sales / +d.total_sales;
        const ownerRatio = +d.owner_occ_sales / +d.total_sales;
        const avgPrice = +d.avg_price;
  
        const priceAmount = document.getElementById("price-amount");
        if (priceAmount) {
            priceAmount.textContent = `$${Math.round(avgPrice).toLocaleString()}`;
        }

        arrow.style.top = `${priceScale(avgPrice)}px`;
  
        svg.selectAll("*").remove();

        const viewBoxWidth = 800;
        const viewBoxHeight = 400;
  
        const tileWidth = 400;
        const tileHeight = 40;
        const tileGap = -31; // space in pixels between tiles
        const barMaxHeight = 280;  // total height for full 100% stack
        const maxLayers = Math.floor(barMaxHeight / (tileHeight + tileGap));

        const corpLayers = Math.round(corporateRatio * maxLayers);
        const ownerLayers = Math.round(ownerRatio * maxLayers);
  
        const corporateX = 80;
        const ownerX = (corporateX +230);
        const baseY = 330; // Bottom of the stack
  
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
      }
    });
  });
  