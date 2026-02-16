const CSV_FILE = "winequality-red.csv";
const STRIP_VAR = "residual sugar";

let table;
let values = [];
let minV, maxV;

let m = { l: 80, r: 30, t: 30, b: 70 };

function preload() {
  table = loadTable(CSV_FILE, "csv", "header");
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
  stroke(0, 20);
  strokeWeight(1);
  for (let i = 0; i <= 10; i++) {
    const y = lerp(y0, y1, i / 10);
    line(x0, y, x1, y);
  }
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
  text("Jittered strip plot", (x0 + x1) / 2, y1 + 30);

  push();
  translate(x0 - 55, (y0 + y1) / 2);
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
  fill(0, 45);
  const jitter = 140;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const x = cx + random(-jitter, jitter);
    const y = mapY(v);
    circle(x, y, 3);
  }
}
