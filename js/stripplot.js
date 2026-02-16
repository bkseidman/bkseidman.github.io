// Strip plot of DAILY PERCENT CHANGE
// (Close - Open) / Open

let table;
let values = [];
let minV, maxV;
let m = { l: 80, r: 30, t: 30, b: 70 };

function preload() {
  table = loadTable("AAPL.csv", "csv", "header");
}

function setup() {
  const c = createCanvas(800, 450);
  c.parent("sketch");

  for (let r = 0; r < table.getRowCount(); r++) {
    const open = parseFloat(table.getString(r, "Open"));
    const close = parseFloat(table.getString(r, "Close"));

    if (Number.isFinite(open) && Number.isFinite(close) && open !== 0) {
      const pct = (close - open) / open;
      values.push(pct);
    }
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
  text("Daily % Change", (x0 + x1) / 2, y1 + 30);

  push();
  translate(x0 - 55, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, TOP);
  text("(Close - Open) / Open", 0, 0);
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

  const cx = (x0 + x1) / 2;

  const mapY = (v) => map(v, minV, maxV, y1, y0);

  // zero reference line
  const zeroY = mapY(0);
  stroke(255, 0, 0, 120);
  strokeWeight(2);
  line(x0, zeroY, x1, zeroY);

  noStroke();
  fill(0, 40);   // transparent dots

  const jitter = 140;

  for (let i = 0; i < values.length; i += 2) {  // slight downsample
    const v = values[i];
    const x = cx + random(-jitter, jitter);
    const y = mapY(v);
    circle(x, y, 3);
  }
}
