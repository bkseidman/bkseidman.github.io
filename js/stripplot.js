const STRIP_VAR = "Open";

let table;
let values = [];
let minV, maxV;
let m = { l: 70, r: 20, t: 30, b: 60 };

function preload() {
  table = loadTable("AAPL.csv", "csv", "header");
}

function setup() {
  const c = createCanvas(800, 450);
  c.parent("sketch");

  for (let r = 0; r < table.getRowCount(); r++) {
    const v = parseFloat(table.getString(r, STRIP_VAR));
    if (Number.isFinite(v)) values.push(v);
  }

  minV = Math.min(...values);
  maxV = Math.max(...values);
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
  text("Jittered strip for " + STRIP_VAR, (x0 + x1) / 2, y1 + 25);

  push();
  translate(x0 - 45, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, TOP);
  text(STRIP_VAR, 0, 0);
  pop();
}

function draw() {
  background(255);
  if (values.length === 0) return;

  const x0 = m.l, y0 = m.t, x1 = width - m.r, y1 = height - m.b;
  drawGrid(x0, y0, x1, y1);
  drawAxes(x0, y0, x1, y1);

  const cx = (x0 + x1) / 2;
  const mapY = (v) => map(v, minV, maxV, y1, y0);

  noStroke();
  fill(0, 140);

  const jitter = 60;
  for (const v of values) {
    const x = cx + random(-jitter, jitter);
    const y = mapY(v);
    circle(x, y, 5);
  }
}
