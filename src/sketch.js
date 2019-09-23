var canvasHeight = 500;
var canvasWidth = window.screen.availWidth - 40;
var cols = Math.floor((canvasWidth / canvasHeight) * 30);
var rows = 30;
var height, width;
var grid = new Array(rows);
var start, end;
var path = [];
var started = false;
var found = false;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(0);
  frameRate(30);
  height = canvasHeight / rows;
  width = canvasWidth / cols;
  initializeStartAndEnd();
  reset();
}

function draw() {
  empty_cell_draw();

  if (started) {
    for (let i = 0; i < 10 && !found; ++i) {
      if (get_algorithm() === "dijkstra") {
        dijkstra_update();
      } else {
        a_star_update();
      }
    }
  } else {
    noLoop();
  }

  if (get_algorithm() === "dijkstra") {
    dijkstra_draw();
  } else {
    a_star_draw();
  }

  if (found) {
    path_draw();
  }

  points_draw();
}
