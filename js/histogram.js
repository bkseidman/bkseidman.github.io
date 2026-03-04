const CSV_FILE = "winequality-red.csv";
const HIST_VAR = "alcohol";
const NUM_BINS = 20;

let table;
let values = [];
let bins = [];
let minV, maxV;

let m = { l: 80, r: 30, t: 60, b: 80 };

function preload() {
  table = loadTable(CSV_FILE, "csv", "header");
}

function setup() {
  const c = createCanvas(1200, 600);
  c.parent("sketch");

  for (let r = 0; r < table.getRowCount(); r++) {
    const v = parseFloat(table.getString(r, HIST_VAR));
    if (Number.isFinite(v)) values.push(v);
  }

  minV = Math.min(...values);
  maxV = Math.max(...values);

  bins = new Array(NUM_BINS).fill(0);

  for (let v of values) {
    let t = (v - minV) / (maxV - minV);
    let idx = floor(t * NUM_BINS);
    if (idx === NUM_BINS) idx = NUM_BINS - 1;
    bins[idx]++;
  }

  noLoop();
}

function drawGrid(x0, y0, x1, y1) {
  stroke(0, 20);
  strokeWeight(1);

  for (let i = 0; i <= 10; i++) {
    let x = lerp(x0, x1, i / 10);
    line(x, y0, x, y1);
  }

  for (let i = 0; i <= 10; i++) {
    let y = lerp(y0, y1, i / 10);
    line(x0, y, x1, y);
  }
}

function drawAxes(x0, y0, x1, y1, maxCount) {
  stroke(0);
  strokeWeight(3);

  line(x0, y1, x1, y1);
  line(x0, y0, x0, y1);

  fill(0);
  noStroke();
  textSize(14);

  for (let i = 0; i <= 5; i++) {
    let val = lerp(minV, maxV, i / 5);
    let x = lerp(x0, x1, i / 5);
    textAlign(CENTER, TOP);
    text(val.toFixed(1), x, y1 + 10);
  }

  for (let i = 0; i <= 5; i++) {
    let val = floor(lerp(0, maxCount, i / 5));
    let y = lerp(y1, y0, i / 5);
    textAlign(RIGHT, CENTER);
    text(val, x0 - 10, y);
  }

  textAlign(CENTER);
  textSize(26);
  text("Histogram (p5)", width / 2, 30);

  textSize(18);
  text(HIST_VAR, (x0 + x1) / 2, y1 + 40);

  push();
  translate(x0 - 60, (y0 + y1) / 2);
  rotate(-HALF_PI);
  text("Count", 0, 0);
  pop();
}

function draw() {
  background(255);

  let x0 = m.l;
  let y0 = m.t;
  let x1 = width - m.r;
  let y1 = height - m.b;

  drawGrid(x0, y0, x1, y1);

  let maxCount = Math.max(...bins);

  let bw = (x1 - x0) / bins.length;

  fill(180);
  stroke(0);

  for (let i = 0; i < bins.length; i++) {
    let h = map(bins[i], 0, maxCount, 0, y1 - y0);
    rect(x0 + i * bw, y1 - h, bw, h);
  }

  drawAxes(x0, y0, x1, y1, maxCount);
}
