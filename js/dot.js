let table;
const CITY = "San Francisco";

let values = [];

function preload() {
  table = loadTable("data.csv", "csv", "header");
}

function setup() {
  createCanvas(900, 300);
  textFont("Arial");
  textSize(12);

  // Extract precipitation values for SF
  for (let r = 0; r < table.getRowCount(); r++) {
    if (table.getString(r, "Station.City") !== CITY) continue;

    const p = parseFloat(table.getString(r, "Data.Precipitation"));
    if (!Number.isNaN(p)) {
      values.push(p);
    }
  }

  drawPlot();
}

function drawPlot() {
  background(245);
  fill(20);

  text(`Dot Plot of Daily Precipitation — ${CITY}`, width / 2, 25);

  const margin = { left: 60, right: 40 };
  const baselineY = height / 2;
  const plotW = width - margin.left - margin.right;

  // Baseline
  stroke(0);
  line(margin.left, baselineY, width - margin.right, baselineY);

  const maxVal = max(values);

  // Draw dots
  noStroke();
  fill(100, 150, 200);

  let stack = {};

  for (let v of values) {
    const x =
      margin.left + (v / maxVal) * plotW;

    // stack dots with same rounded value
    const key = v.toFixed(2);
    stack[key] = (stack[key] || 0) + 1;

    const y = baselineY - stack[key] * 8;

    ellipse(x, y, 8, 8);
  }

  // Axis labels
  fill(20);
  textAlign(CENTER, TOP);
  text("Precipitation Amount", width / 2, baselineY + 15);
}
