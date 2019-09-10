var canvasHeight = 600;
var canvasWidth = window.screen.width - 40;
var cols = Math.floor(20 * (canvasWidth / canvasHeight));
var rows = 20;
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
    if (get_algorithm() === 'dijkstra') {
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
