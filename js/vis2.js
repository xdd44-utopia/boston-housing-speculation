document.addEventListener("DOMContentLoaded", () => {
const svg = d3.select("#desk-svg");
const arrow = document.getElementById("price-arrow");
const label = document.getElementById("price-label");
const dropdown = document.getElementById("neighborhood-select");

d3.csv("./files/ownership_and_vacancy_over_time.csv").then(files => {
    
    console.log("Loaded rows:", files.length); //debugging lines
    console.log(files[0]); 
    
    const cities = Array.from(new Set(files.map(d => d.city)));
    cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    dropdown.appendChild(opt);
    });

    const priceExtent = d3.extent(files, d => +d.avg_price);
    const priceScale = d3.scaleLinear()
    .domain(priceExtent)
    .range([160, 0]);

    dropdown.addEventListener("change", () => updateViz(dropdown.value));
    updateViz(cities[0]);

    function updateViz(city) {
    const d = files.find(row => row.city === city);
    if (!d) return;

    const corporateRatio = +d.corporate_sales / +d.total_sales;
    const ownerRatio = +d.owner_occ_sales / +d.total_sales;
    const avgPrice = +d.avg_price;

    label.textContent = `Average Price: $${Math.round(avgPrice).toLocaleString()}`;
    arrow.style.top = `${priceScale(avgPrice)}px`;

    svg.selectAll("*").remove();

    const barMaxH = 120;
    const baseY = 240;
    const scaleH = d3.scaleLinear().domain([0, 1]).range([0, barMaxH]);

    // Corporate Stack
    
    svg.append("rect")
        .attr("x", 230)
        .attr("y", baseY - scaleH(corporateRatio))
        .attr("width", 40)
        .attr("height", scaleH(corporateRatio))
        .attr("fill", "#e63946");

    // Owner Stack
    svg.append("rect")
        .attr("x", 420)
        .attr("y", baseY - scaleH(ownerRatio))
        .attr("width", 40)
        .attr("height", scaleH(ownerRatio))
        .attr("fill", "#457b9d");

    // Labels
    svg.append("text")
        .attr("x", 270)
        .attr("y", baseY + 20)
        .attr("text-anchor", "middle")
        .text("Corporate");

    svg.append("text")
        .attr("x", 380)
        .attr("y", baseY + 20)
        .attr("text-anchor", "middle")
        .text("Owner");
    }
});
});
