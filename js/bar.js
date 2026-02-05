console.log("bar.js loaded ✅");

function setup() {
  const c = createCanvas(700, 400);
  c.parent("sketch-holder");
  background(245);
  fill(20);
  textSize(22);
  text("p5 is working ✅", 20, 50);
  rect(20, 80, 200, 60);
}

function draw() {}
