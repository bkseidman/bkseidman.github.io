const CSV_FILE = "winequality-red.csv";
const STRIP_VAR = "residual sugar";

let table;
let values = [];
let points = [];
let minV, maxV;

let m = { l: 80, r: 30, t: 80, b: 80 };

function preload() {
  table = loadTable(CSV_FILE, "csv", "header");
}

function setup() {
  const c = createCanvas(1200, 600);
  c.parent("sketch");

  for (let r = 0; r < table.getRowCount(); r++) {
    const v = parseFloat(table.getString(r, STRIP_VAR));
    if (Number.isFinite(v)) values.push(v);
  }

  minV = Math.min(...values);
  maxV = Math.max(...values);

  const pad = (maxV - minV) * 0.05;
  minV -= pad;
  maxV += pad;

  const x0 = m.l;
  const y0 = m.t;
  const x1 = width - m.r;
  const y1 = height - m.b;

  const cx = (x0 + x1) / 2;
  const jitter = 100;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const y = map(v, minV, maxV, y1, y0);
    const x = cx + random(-jitter, jitter);
    points.push({ x, y });
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

function drawAxes(x0, y0, x1, y1) {
  stroke(0);
  strokeWeight(3);
  line(x0, y1, x1, y1);
  line(x0, y0, x0, y1);

  const cx = (x0 + x1) / 2;
  line(cx, y1, cx, y1 + 12);

  noStroke();
  fill(0);
  textSize(28);
  textAlign(CENTER, TOP);
  text("Strip Plot (p5)", width / 2, 20);

  textSize(18);
  push();
  translate(x0 - 60, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, TOP);
  text(STRIP_VAR, 0, 0);
  pop();
}

function draw() {
  background(255);

  const x0 = m.l;
  const y0 = m.t;
  const x1 = width - m.r;
  const y1 = height - m.b;

  drawGrid(x0, y0, x1, y1);
  drawAxes(x0, y0, x1, y1);

  noStroke();
  fill(31, 119, 180, 220);

  for (let i = 0; i < points.length; i++) {
    circle(points[i].x, points[i].y, 10);
  }
}
