const CSV_FILE = "winequality-red.csv";
const BOX_VAR = "volatile acidity";

let table;
let values = [];
let m = { l: 70, r: 20, t: 30, b: 60 };

function preload() {
  table = loadTable(CSV_FILE, "csv", "header");
}

function quantile(sorted, q) {
  const n = sorted.length;
  const pos = (n - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  const t = pos - lo;
  return sorted[lo] * (1 - t) + sorted[hi] * t;
}

function setup() {
  const c = createCanvas(800, 450);
  c.parent("sketch");

  for (let r = 0; r < table.getRowCount(); r++) {
    const v = parseFloat(table.getString(r, BOX_VAR));
    if (Number.isFinite(v)) values.push(v);
  }
}

function drawGrid(x0, y0, x1, y1) {
  stroke(0, 25);
  strokeWeight(1);
  for (let i = 0; i <= 10; i++) line(lerp(x0, x1, i / 10), y0, lerp(x0, x1, i / 10), y1);
  for (let j = 0; j <= 10; j++) line(x0, lerp(y0, y1, j / 10), x1, lerp(y0, y1, j / 10));
}

function drawAxes(x0, y0, x1, y1) {
  stroke(0);
  strokeWeight(2);
  line(x0, y1, x1, y1);
  line(x0, y0, x0, y1);

  noStroke();
  fill(0);
  textSize(12);
  textAlign(CENTER, TOP);
  text(BOX_VAR, (x0 + x1) / 2, y1 + 25);

  push();
  translate(x0 - 45, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, TOP);
  text("Value", 0, 0);
  pop();
}

function draw() {
  background(255);
  if (values.length === 0) return;

  const x0 = m.l, y0 = m.t, x1 = width - m.r, y1 = height - m.b;
  drawGrid(x0, y0, x1, y1);
  drawAxes(x0, y0, x1, y1);

  const sorted = [...values].sort((a, b) => a - b);
  const minV = sorted[0];
  const maxV = sorted[sorted.length - 1];
  const q1 = quantile(sorted, 0.25);
  const med = quantile(sorted, 0.5);
  const q3 = quantile(sorted, 0.75);

  const iqr = q3 - q1;
  const lowFence = q1 - 1.5 * iqr;
  const highFence = q3 + 1.5 * iqr;

  let whiskerLow = minV;
  let whiskerHigh = maxV;
  for (const v of sorted) { if (v >= lowFence) { whiskerLow = v; break; } }
  for (let i = sorted.length - 1; i >= 0; i--) { if (sorted[i] <= highFence) { whiskerHigh = sorted[i]; break; } }

  const mapY = (v) => map(v, minV, maxV, y1, y0);
  const cx = (x0 + x1) / 2;
  const boxW = 140;

  stroke(0);
  strokeWeight(2);
  fill(230);
  rectMode(CORNERS);
  rect(cx - boxW / 2, mapY(q3), cx + boxW / 2, mapY(q1));

  strokeWeight(3);
  line(cx - boxW / 2, mapY(med), cx + boxW / 2, mapY(med));

  strokeWeight(2);
  line(cx, mapY(q3), cx, mapY(whiskerHigh));
  line(cx, mapY(q1), cx, mapY(whiskerLow));
  line(cx - boxW / 4, mapY(whiskerHigh), cx + boxW / 4, mapY(whiskerHigh));
  line(cx - boxW / 4, mapY(whiskerLow), cx + boxW / 4, mapY(whiskerLow));

  // outliers highlighted
  noStroke();
  fill(255, 0, 0);
  for (const v of values) {
    if (v < lowFence || v > highFence) circle(cx, mapY(v), 7);
  }
}
