const CSV_FILE = "winequality-red.csv";
const BOX_VAR = "volatile acidity";

let table;
let values = [];

let minV, maxV, q1, med, q3, whiskerLow, whiskerHigh, lowFence, highFence;
let outliers = [];

let m = { l: 90, r: 40, t: 80, b: 90 };

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
  const c = createCanvas(1200, 600);
  c.parent("sketch");

  for (let r = 0; r < table.getRowCount(); r++) {
    const v = parseFloat(table.getString(r, BOX_VAR));
    if (Number.isFinite(v)) values.push(v);
  }

  const sorted = [...values].sort((a, b) => a - b);

  minV = sorted[0];
  maxV = sorted[sorted.length - 1];

  q1 = quantile(sorted, 0.25);
  med = quantile(sorted, 0.5);
  q3 = quantile(sorted, 0.75);

  const iqr = q3 - q1;
  lowFence = q1 - 1.5 * iqr;
  highFence = q3 + 1.5 * iqr;

  whiskerLow = minV;
  whiskerHigh = maxV;

  for (const v of sorted) {
    if (v >= lowFence) {
      whiskerLow = v;
      break;
    }
  }
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i] <= highFence) {
      whiskerHigh = sorted[i];
      break;
    }
  }

  outliers = [];
  for (const v of values) {
    if (v < lowFence || v > highFence) outliers.push(v);
  }

  noLoop();
}

function drawGrid(x0, y0, x1, y1) {
  stroke(0, 20);
  strokeWeight(1);

  for (let i = 0; i <= 10; i++) {
    const y = lerp(y0, y1, i / 10);
    line(x0, y, x1, y);
  }

  for (let i = 0; i <= 10; i++) {
    const x = lerp(x0, x1, i / 10);
    line(x, y0, x, y1);
  }
}

function drawYAxisTicks(x0, y0, y1) {
  fill(0);
  noStroke();
  textSize(14);
  textAlign(RIGHT, CENTER);

  for (let i = 0; i <= 7; i++) {
    const val = lerp(minV, maxV, i / 7);
    const y = map(val, minV, maxV, y1, y0);
    text(val.toFixed(2), x0 - 12, y);
  }
}

function drawAxesAndLabels(x0, y0, x1, y1) {
  stroke(0);
  strokeWeight(3);
  line(x0, y1, x1, y1);
  line(x0, y0, x0, y1);

  fill(0);
  noStroke();

  textAlign(CENTER, TOP);
  textSize(26);
  text("Box Plot (p5)", width / 2, 25);

  textSize(18);
  text(BOX_VAR, (x0 + x1) / 2, y1 + 40);

  push();
  translate(x0 - 65, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, TOP);
  text(BOX_VAR, 0, 0);
  pop();
}

function draw() {
  background(255);

  const x0 = m.l;
  const y0 = m.t;
  const x1 = width - m.r;
  const y1 = height - m.b;

  drawGrid(x0, y0, x1, y1);
  drawAxesAndLabels(x0, y0, x1, y1);
  drawYAxisTicks(x0, y0, y1);

  const mapY = (v) => map(v, minV, maxV, y1, y0);

  const cx = (x0 + x1) / 2;
  const boxW = 700;

  stroke(0);
  strokeWeight(3);
  fill(31, 119, 180, 210);

  rectMode(CORNERS);
  rect(cx - boxW / 2, mapY(q3), cx + boxW / 2, mapY(q1));

  strokeWeight(4);
  line(cx - boxW / 2, mapY(med), cx + boxW / 2, mapY(med));

  strokeWeight(3);
  line(cx, mapY(q3), cx, mapY(whiskerHigh));
  line(cx, mapY(q1), cx, mapY(whiskerLow));

  line(cx - boxW / 5, mapY(whiskerHigh), cx + boxW / 5, mapY(whiskerHigh));
  line(cx - boxW / 5, mapY(whiskerLow), cx + boxW / 5, mapY(whiskerLow));

  noFill();
  stroke(0);
  strokeWeight(2);
  for (const v of outliers) {
    circle(cx, mapY(v), 12);
  }
}
