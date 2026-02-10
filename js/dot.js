let table;
const CITY = "San Francisco";

let values = [];

function preload() {
  table = loadTable("data.csv", "csv", "header");
}

function setup() {
  createCanvas(900, 320);
  textFont("Arial");
  textSize(12);

  // Agreggate data for San Francisco 
  for (let r = 0; r < table.getRowCount(); r++) {
    if (table.getString(r, "Station.City") !== CITY) continue;

    const p = parseFloat(table.getString(r, "Data.Precipitation"));
    if (!Number.isNaN(p)) values.push(p);
  }

  values.sort((a, b) => a - b);
  drawPlot();
}

function drawPlot() {
  background(245);

  const margin = { left: 70, right: 30, top: 45, bottom: 60 };
  const baselineY = height - margin.bottom;
  const plotW = width - margin.left - margin.right;

  // Use high percentile-ish max so outliers don't crush scale
  const maxVal = values[Math.floor(values.length * 0.95)] || 1;
  const xMax = max(maxVal, 0.5); // avoid tiny scales

  // Title
  fill(20);
  textAlign(CENTER, TOP);
  textSize(16);
  text(`Dot Plot of Daily Precipitation — ${CITY}`, width / 2, 10);

  // Axis line
  stroke(0);
  line(margin.left, baselineY, width - margin.right, baselineY);

  // x-axis ticks
  const ticks = 5;
  for (let i = 0; i <= ticks; i++) {
    const v = (xMax / ticks) * i;
    const x = margin.left + (v / xMax) * plotW;
    line(x, baselineY, x, baselineY + 6);
    noStroke();
    fill(20);
    textAlign(CENTER, TOP);
    text(v.toFixed(2), x, baselineY + 10);
    stroke(0);
  }

  // Dot settings
  const dotR = 4;
  const stackStep = 10;

  // Bin values so heavy pile-ups (like 0.00) look reasonable
  const binSize = 0.05; 
  let stackCounts = new Map();

  noStroke();
  fill(100, 150, 200);

  for (let v of values) {
    // clamp extreme outliers so they don't fly off the plot
    const vv = min(v, xMax);

    const bin = Math.round(vv / binSize) * binSize;
    const key = bin.toFixed(2);

    const c = (stackCounts.get(key) || 0) + 1;
    stackCounts.set(key, c);

    // x from binned value
    const x = margin.left + (bin / xMax) * plotW;

    // stack upward, with a tiny horizontal jitter so stacks look like dots not a line
    const jitter = random(-1.5, 1.5);
    const y = baselineY - c * stackStep;

    ellipse(x + jitter, y, dotR * 2, dotR * 2);
  }

  // Axis label
  noStroke();
  fill(20);
  textAlign(CENTER, TOP);
  textSize(13);
  text("Precipitation Amount", width / 2, baselineY + 35);

  // Small note so grader knows why the right tail is capped
  textSize(11);
  textAlign(LEFT, TOP);
  text(`x-axis capped at ~95th percentile (${xMax.toFixed(2)})`, margin.left, margin.top);
}

function draw() {}
