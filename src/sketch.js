var canvasHeight = 600;
var canvasWidth = 600;
var cols = 30;
var rows = 30;
var height, width;
var grid = new Array(rows);
var start, end;
var path = [];
var started = false;

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
    if (get_algorithm() === "dijkstra") {
      dijkstra_update();
      dijkstra_draw();
    } else {
      a_star_update();
      a_star_draw();
    }
  } else {
    noLoop();
  }

  path_draw();
  points_draw();
}
