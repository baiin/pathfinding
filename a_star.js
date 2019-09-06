export function AStar() {
  this.obj.run = function(grid) {
    if (openedSet.length > 0) {
      // keep going

      var winner = 0;
      for (var i = 0; i < openedSet.length; ++i) {
        if (openedSet[i].f < openedSet[winner].f) {
          winner = i;
        }
      }

      var current = openedSet[winner];

      if (current === end) {
        noLoop();
        console.log("DONE");
      }

      removeFromArray(openedSet, current);
      closedSet.push(current);

      var neighbors = current.neighbors;

      for (var i = 0; i < neighbors.length; ++i) {
        if (!closedSet.includes(neighbors[i]) && !neighbors[i].wall) {
          var tempG = current.g + 1;

          var newPath = false;

          if (openedSet.includes(neighbors[i])) {
            if (tempG < neighbors[i].g) {
              neighbors[i].g = tempG;
              newPath = true;
            }
          } else {
            neighbors[i].g = tempG;
            newPath = true;
            openedSet.push(neighbors[i]);
          }

          if (newPath) {
            neighbors[i].h = heuristic(neighbors[i], end);
            neighbors[i].f = neighbors[i].g + neighbors[i].h;
            neighbors[i].previous = current;
          }
        }
      }
    } else {
      console.log("no solution");
      noLoop();
      return;
      // no solution
    }
  };

  return obj;
}

var cols = 30;
var rows = 30;
var grid = new Array(cols);
var openedSet = []; // nodes that still need to be processed
var closedSet = []; // nodes that have already been processed
var start;
var end;
var w, h;
var path = [];

function Spot(i, j) {
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.i = i;
  this.j = j;
  this.wall = false;

  if (random(1) < 0.35) {
    this.wall = true;
  }

  this.show = function(color) {
    stroke(0);

    if (this.wall) {
      fill(0);
    } else {
      fill(color);
    }

    if (this.i === start.i && this.j === start.j) {
      fill("#fae");
    }

    if (this.i === end.i && this.j === end.j) {
      fill(255, 204, 0);
    }

    rect(this.i * w, this.j * h, w, h);
  };

  this.neighbors = [];
  this.previous = undefined;

  this.addNeighbors = function(grid) {
    if (this.i < cols - 1) {
      this.neighbors.push(grid[this.i + 1][this.j]);
    }

    if (this.i > 0) {
      this.neighbors.push(grid[this.i - 1][this.j]);
    }

    if (this.j < rows - 1) {
      this.neighbors.push(grid[this.i][this.j + 1]);
    }

    if (this.j > 0) {
      this.neighbors.push(grid[this.i][this.j - 1]);
    }

    if (this.i > 0 && this.j > 0) {
      this.neighbors.push(grid[this.i - 1][this.j - 1]);
    }

    if (this.i < cols - 1 && this.j > 0) {
      this.neighbors.push(grid[this.i + 1][this.j - 1]);
    }

    if (this.i > 0 && this.j < rows - 1) {
      this.neighbors.push(grid[this.i - 1][this.j + 1]);
    }

    if (this.i < cols - 1 && this.j < rows - 1) {
      this.neighbors.push(grid[this.i + 1][this.j + 1]);
    }
  };
}

function heuristic(a, b) {
  return dist(a.i, a.j, b.i, b.j);
}

function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; --i) {
    if (arr[i] === elt) {
      arr.splice(i, 1);
    }
  }
}

function setup() {
  createCanvas(400, 400);
  frameRate(60);

  w = width / cols;
  h = height / rows;

  for (var i = 0; i < rows; ++i) {
    grid[i] = new Array(cols);
  }

  for (var i = 0; i < rows; ++i) {
    for (var j = 0; j < cols; ++j) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (var i = 0; i < rows; ++i) {
    for (var j = 0; j < cols; ++j) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start =
    grid[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];
  end =
    grid[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];

  start.wall = false;
  end.wall = false;
  openedSet.push(start);

  console.log(grid);
}

function draw() {
  if (openedSet.length > 0) {
    // keep going

    var winner = 0;
    for (var i = 0; i < openedSet.length; ++i) {
      if (openedSet[i].f < openedSet[winner].f) {
        winner = i;
      }
    }

    var current = openedSet[winner];

    if (current === end) {
      noLoop();
      console.log("DONE");
    }

    removeFromArray(openedSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;

    for (var i = 0; i < neighbors.length; ++i) {
      if (!closedSet.includes(neighbors[i]) && !neighbors[i].wall) {
        var tempG = current.g + 1;

        var newPath = false;

        if (openedSet.includes(neighbors[i])) {
          if (tempG < neighbors[i].g) {
            neighbors[i].g = tempG;
            newPath = true;
          }
        } else {
          neighbors[i].g = tempG;
          newPath = true;
          openedSet.push(neighbors[i]);
        }

        if (newPath) {
          neighbors[i].h = heuristic(neighbors[i], end);
          neighbors[i].f = neighbors[i].g + neighbors[i].h;
          neighbors[i].previous = current;
        }
      }
    }
  } else {
    console.log("no solution");
    noLoop();
    return;
    // no solution
  }

  background(0);

  for (var i = 0; i < cols; ++i) {
    for (var j = 0; j < rows; ++j) {
      grid[i][j].show(color(255));
    }
  }

  for (var i = 0; i < closedSet.length; ++i) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (var i = 0; i < openedSet.length; ++i) {
    openedSet[i].show(color(0, 255, 0));
  }

  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (var i = 0; i < path.length; ++i) {
    path[i].show(color(0, 0, 255));
  }
}
