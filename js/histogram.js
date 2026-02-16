const CSV_FILE = "winequality-red.csv";
const HIST_VAR = "alcohol";
const NUM_BINS = 20;

let table;
let values = [];
let bins = [];
let minV, maxV;

let m = { l: 70, r: 20, t: 30, b: 60 };

function preload() {
  table = loadTable(CSV_FILE, "csv", "header");
}

function setup() {
  const c = createCanvas(800, 450);
  c.parent("sketch");

  for (let r = 0; r < table.getRowCount(); r++) {
    const v = parseFloat(table.getString(r, HIST_VAR));
    if (Number.isFinite(v)) values.push(v);
  }

  if (values.length === 0) return;

  minV = Math.min(...values);
  maxV = Math.max(...values);

  bins = new Array(NUM_BINS).fill(0);
  for (const v of values) {
    let t = (v - minV) / (maxV - minV || 1);
    let idx = Math.floor(t * NUM_BINS);
    if (idx === NUM_BINS) idx = NUM_BINS - 1;
    bins[idx]++;
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
  text(HIST_VAR, (x0 + x1) / 2, y1 + 25);

  push();
  translate(x0 - 45, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, TOP);
  text("Count", 0, 0);
  pop();
}

function draw() {
  background(255);

  if (bins.length === 0) {
    fill(0);
    text("No numeric data found for " + HIST_VAR, 20, 20);
    return;
  }

  const x0 = m.l, y0 = m.t, x1 = width - m.r, y1 = height - m.b;
  drawGrid(x0, y0, x1, y1);
  drawAxes(x0, y0, x1, y1);

  const maxCount = Math.max(...bins);
  const bw = (x1 - x0) / bins.length;

  stroke(0);
  strokeWeight(1);
  fill(180);

  let hovered = -1;

  for (let i = 0; i < bins.length; i++) {
    const h = (bins[i] / (maxCount || 1)) * (y1 - y0);
    const bx = x0 + i * bw;
    const by = y1 - h;

    if (mouseX >= bx && mouseX < bx + bw && mouseY >= by && mouseY <= y1) hovered = i;
    rect(bx, by, bw, h);
  }

  if (hovered !== -1) {
    const binStart = lerp(minV, maxV, hovered / NUM_BINS);
    const binEnd = lerp(minV, maxV, (hovered + 1) / NUM_BINS);
    const label = `${binStart.toFixed(2)} to ${binEnd.toFixed(2)}\ncount: ${bins[hovered]}`;

    textSize(12);
    const tw = textWidth("count: " + bins[hovered]) + 90;
    const th = 40;

    const tx = constrain(mouseX + 12, 10, width - tw - 10);
    const ty = constrain(mouseY - th - 12, 10, height - th - 10);

    noStroke();
    fill(255);
    rect(tx, ty, tw, th);
    stroke(0, 60);
    noFill();
    rect(tx, ty, tw, th);

    noStroke();
    fill(0);
    textAlign(LEFT, TOP);
    text(label, tx + 10, ty + 6);
  }
}
//test
