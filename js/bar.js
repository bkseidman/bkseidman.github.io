let table;

const CITY = "San Francisco";
let monthly = new Array(12).fill(0);
let counts = new Array(12).fill(0);

const margin = { top: 40, right: 30, bottom: 60, left: 60 };
const w = 900;
const h = 450;

function preload() {
  table = loadTable("data.csv", "csv", "header");
}

function setup() {
  createCanvas(w, h);
  textFont("Arial");
  textSize(12);

  // --- Aggregate data ---
  for (let r = 0; r < table.getRowCount(); r++) {
    if (table.getString(r, "Station.City") !== CITY) continue;

    const m = int(table.getString(r, "Date.Month")) - 1;
    const p = parseFloat(table.getString(r, "Data.Precipitation"));

    if (m >= 0 && m < 12 && !Number.isNaN(p)) {
      monthly[m] += p;
      counts[m] += 1;
    }
  }

  drawChart();
}

function drawChart() {
  background(245);
  fill(20);

  // --- Chart area ---
  const chartW = w - margin.left - margin.right;
  const chartH = h - margin.top - margin.bottom;

  // Find max for scaling
  const maxVal = max(monthly);

  // --- Axes ---
  stroke(0);
  line(margin.left, margin.top, margin.left, margin.top + chartH); // y-axis
  line(
    margin.left,
    margin.top + chartH,
    margin.left + chartW,
    margin.top + chartH
  ); // x-axis

  // --- Y-axis ticks ---
  const ticks = 5;
  for (let i = 0; i <= ticks; i++) {
    const val = (maxVal / ticks) * i;
    const y =
      margin.top + chartH - (val / maxVal) * chartH;

    stroke(0);
    line(margin.left - 5, y, margin.left, y);
    noStroke();
    textAlign(RIGHT, CENTER);
    text(val.toFixed(1), margin.left - 8, y);
  }

  // --- Bars ---
  const barW = chartW / 12;

  for (let i = 0; i < 12; i++) {
    const barH = (monthly[i] / maxVal) * chartH;
    const x = margin.left + i * barW;
    const y = margin.top + chartH - barH;

    fill(100, 150, 200);
    rect(x + 5, y, barW - 10, barH);

    // Month labels
    fill(20);
    textAlign(CENTER, TOP);
    text(i + 1, x + barW / 2, margin.top + chartH + 8);
  }

  // --- Titles ---
  textAlign(CENTER, TOP);
  textSize(16);
  text(
    `Monthly Total Precipitation — ${CITY}`,
    w / 2,
    10
  );

  textSize(12);
  textAlign(CENTER, BOTTOM);
  text("Month", w / 2, h - 10);

  push();
  translate(15, h / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, TOP);
  text("Total Precipitation", 0, 0);
  pop();
}

function draw() {}
