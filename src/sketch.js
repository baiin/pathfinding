var canvasHeight = 600;
var canvasWidth = 800;
var cols = 28;
var rows = 21;
var height, width;
var grid = new Array(rows);
var start, end;
var path = [];
var started = false;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(30);
  height = canvasHeight / rows;
  width = canvasWidth / cols;
  initializeStartAndEnd();
  reset();
}

function draw() {
  background(0);
  empty_cell_draw();

  if (started) {
    let e = document.getElementById('algo');
    let val = e.options[e.selectedIndex].value;

    if (val === 'dijkstra') {
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

document.getElementById('start-button').addEventListener('click', function() {
  if (started) {
    softReset();
  }

  started = true;
  loop();
});

document.getElementById('reset-button').addEventListener('click', function() {
  reset();
});
