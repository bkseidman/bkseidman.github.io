let table;
const CITY = "San Francisco";

// data structure: data[year][month] = total precipitation
let data = {};
let years = [];

const margin = { top: 60, right: 40, bottom: 60, left: 80 };
const w = 900;
const h = 500;

function preload() {
  table = loadTable("data.csv", "csv", "header");
}

function setup() {
  createCanvas(w, h);
  textFont("Arial");
  textSize(12);

  //// Agreggate data for San Francisco by year and month
  for (let r = 0; r < table.getRowCount(); r++) {
    if (table.getString(r, "Station.City") !== CITY) continue;

    const year = table.getString(r, "Date.Year");
    const month = int(table.getString(r, "Date.Month")) - 1;
    const p = parseFloat(table.getString(r, "Data.Precipitation"));

    if (Number.isNaN(p) || month < 0 || month > 11) continue;

    if (!data[year]) {
      data[year] = new Array(12).fill(0);
      years.push(year);
    }

    data[year][month] += p;
  }

  years = years.filter(y => y !== "2017");
  years.sort();
  drawHeatmap();
}

function drawHeatmap() {
  background(245);

  const chartW = w - margin.left - margin.right;
  const chartH = h - margin.top - margin.bottom;

  const cellW = chartW / years.length;
  const cellH = chartH / 12;

  // find max value for color scaling
  let maxVal = 0;
  for (let y of years) {
    for (let m = 0; m < 12; m++) {
      maxVal = max(maxVal, data[y][m]);
    }
  }

  // cells
  stroke(220);      // faint grid lines
  strokeWeight(1);
  for (let c = 0; c < years.length; c++) {
    const year = years[c];
    for (let r = 0; r < 12; r++) {
      const val = data[year][r];
      const t = maxVal === 0 ? 0 : val / maxVal;

      // blue color scale
      const col = lerpColor(
        color(230, 240, 255),
        color(30, 90, 180),
        t
      );
      fill(col);

      rect(
        margin.left + c * cellW,
        margin.top + r * cellH,
        cellW,
        cellH
      );
    }
  }

  // axes
  fill(20);
  textAlign(CENTER, TOP);
  for (let c = 0; c < years.length; c++) {
    text(
      years[c],
      margin.left + c * cellW + cellW / 2,
      margin.top + chartH + 10
    );
  }

  textAlign(RIGHT, CENTER);
  for (let r = 0; r < 12; r++) {
    text(
      r + 1,
      margin.left - 10,
      margin.top + r * cellH + cellH / 2
    );
  }

  // titles
  textAlign(CENTER, TOP);
  textSize(16);
  text(
    `Monthly Total Precipitation Heatmap — ${CITY}`,
    w / 2,
    15
  );

  textSize(12);
  text("Year", w / 2, h - 10);

  push();
  translate(20, h / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, TOP);
  text("Month", 0, 0);
  pop();
}

function draw() {}
