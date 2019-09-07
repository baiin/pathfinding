var canvasHeight = 500;
var canvasWidth = 500;
var cols = 20;
var rows = 20;
var height, width;
var grid = new Array(rows);
var infinity = Number.MAX_VALUE;
var start, end;
var path = [];
var diagonals = false;
var started = false;

// a_star
var openedSet = []; // nodes that still need to be processed
var closedSet = []; // nodes that have already been processed

function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.shortestPaths = [];
  this.visited = false;
  this.previous = null;
  this.distance = this.x === start.x && this.y === start.y ? 0 : infinity;
  this.adjacent = [];
  this.isAdjecent = false;
  this.wall = false;

  // if (random(1) < 0.3) {
  //   this.wall = true;
  // }

  this.show = function(color) {
    stroke(0);
    fill(color);

    if (this.wall) {
      fill(0);
    }

    rect(this.x * width, this.y * height, width, height);
  };

  this.loadAdjacent = function() {
    if (this.y < rows - 1) {
      this.adjacent.push(grid[this.y + 1][this.x]);
    }

    if (this.y > 0) {
      this.adjacent.push(grid[this.y - 1][this.x]);
    }

    if (this.x < cols - 1) {
      this.adjacent.push(grid[this.y][this.x + 1]);
    }

    if (this.x > 0) {
      this.adjacent.push(grid[this.y][this.x - 1]);
    }

    if (diagonals) {
      if (this.x > 0 && this.y > 0) {
        this.adjacent.push(grid[this.y - 1][this.x - 1]);
      }

      if (this.x < cols - 1 && this.y > 0) {
        this.adjacent.push(grid[this.y - 1][this.x + 1]);
      }

      if (this.x > 0 && this.y < rows - 1) {
        this.adjacent.push(grid[this.y + 1][this.x - 1]);
      }

      if (this.x < cols - 1 && this.y < rows - 1) {
        this.adjacent.push(grid[this.y + 1][this.x + 1]);
      }
    }
  };
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; --i) {
    if (arr[i] === elt) {
      arr.splice(i, 1);
    }
  }
}

function a_star() {
  for (var i = 0; i < closedSet.length; ++i) {
    closedSet[i].show(color(255, 153, 51));
  }

  for (var i = 0; i < openedSet.length; ++i) {
    openedSet[i].show(color(255, 51, 0));
  }

  if (openedSet.length > 0) {
    // keep going
    var winner = 0;
    for (var i = 0; i < openedSet.length; ++i) {
      if (openedSet[i].f < openedSet[winner].f) {
        winner = i;
      }
    }

    var current = openedSet[winner];

    if (current.x === end.x && current.y === end.y) {
      noLoop();
      console.log("DONE");
    }

    removeFromArray(openedSet, current);
    closedSet.push(current);

    var adjacent = current.adjacent;

    for (var i = 0; i < adjacent.length; ++i) {
      if (!closedSet.includes(adjacent[i]) && !adjacent[i].wall) {
        var tempG = current.g + 1;

        var newPath = false;

        if (openedSet.includes(adjacent[i])) {
          if (tempG < adjacent[i].g) {
            adjacent[i].g = tempG;
            newPath = true;
          }
        } else {
          adjacent[i].g = tempG;
          newPath = true;
          openedSet.push(adjacent[i]);
        }

        if (newPath) {
          adjacent[i].h = heuristic(adjacent[i], end);
          adjacent[i].f = adjacent[i].g + adjacent[i].h;
          adjacent[i].previous = current;
        }
      }
    }

    buildPath(current);
  } else {
    console.log("no solution");
    noLoop();
    return;
    // no solution
  }
}

function getUnvisitedCellWithMinDistance() {
  var currentMin = infinity;
  var minCoord = {
    x: null,
    y: null
  };

  for (var i = 0; i < rows; ++i) {
    for (var j = 0; j < cols; ++j) {
      if (
        !grid[i][j].visited &&
        grid[i][j].distance < currentMin &&
        grid[i][j].wall === false
      ) {
        currentMin = grid[i][j].distance;
        minCoord.x = j;
        minCoord.y = i;
      }
    }
  }

  return minCoord;
}

function getUnvistedLength() {
  let unvisited = 0;
  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      if (!grid[i][j].visited) {
        ++unvisited;
      }
    }
  }

  return unvisited;
}

function buildPath(cell) {
  path = [];

  var temp = cell;

  while (temp) {
    path.push(temp);
    temp = temp.previous;
  }
}

function dijkstra() {
  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      if (grid[i][j].visited) {
        grid[i][j].show(color(255, 153, 51));
      } else if (grid[i][j].isAdjecent) {
        grid[i][j].show(color(255, 51, 0));
      }
    }
  }

  if (getUnvistedLength() > 0) {
    let minCoords = getUnvisitedCellWithMinDistance();
    if (minCoords.x === null || minCoords.y === null) {
      console.log("NOT POSSIBLE");
      noLoop();
      return;
    }

    grid[minCoords.y][minCoords.x].visited = true;
    grid[minCoords.y][minCoords.x].isAdjecent = false;
    let min = grid[minCoords.y][minCoords.x];

    buildPath(min);

    // if (min.x === end.x && min.y === end.y) {
    //   console.log('FOUND');
    //   noLoop();
    //   return;
    // }

    for (let i = 0; i < min.adjacent.length; ++i) {
      let adj = min.adjacent[i];
      let dist = min.distance + 1;

      grid[adj.y][adj.x].isAdjecent = true;

      if (adj.visited === false && dist < adj.distance && adj.wall === false) {
        grid[adj.y][adj.x].distance = dist;
        grid[adj.y][adj.x].previous = min;
      }

      if (adj.y === end.y && adj.x === end.x) {
        console.log("FOUND");
        noLoop();
        return;
      }
    }
  } else {
    console.log("NOT FOUND");
    noLoop();
  }
}

function initializeStartAndEnd() {
  start = {};
  end = {};

  start.x = Math.floor(random(1, cols - 1));
  start.y = Math.floor(random(1, rows - 1));

  do {
    end.x = Math.floor(random(1, cols - 1));
    end.y = Math.floor(random(1, rows - 1));
  } while (start.x === end.x && start.y === end.y);
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);
  height = canvasHeight / rows;
  width = canvasWidth / cols;
  initializeStartAndEnd();

  reset();
}

function draw() {
  background(0);

  for (var i = 0; i < cols; ++i) {
    for (var j = 0; j < rows; ++j) {
      grid[i][j].show(color(255));
    }
  }

  if (started) {
    let e = document.getElementById("algo");
    let val = e.options[e.selectedIndex].value;

    if (val === "dijkstra") {
      dijkstra();
    } else {
      a_star();
    }
  } else {
    noLoop();
  }

  for (let i = 0; i < path.length; ++i) {
    path[i].show(color(255, 255, 0));
  }

  grid[start.y][start.x].show(color(0, 0, 255));
  grid[end.y][end.x].show(color(0, 255, 0));
}

document.getElementById("start-button").addEventListener("click", function() {
  started = true;
  loop();
});

document.getElementById("reset-button").addEventListener("click", function() {
  reset();
});

function reset() {
  noLoop();
  started = false;
  grid = new Array(rows);

  for (let i = 0; i < rows; ++i) {
    grid[i] = new Array(cols);
    for (let j = 0; j < cols; ++j) {
      grid[i][j] = new Cell(j, i);
    }
  }

  for (var i = 0; i < rows; ++i) {
    for (var j = 0; j < cols; ++j) {
      grid[i][j].loadAdjacent();
      grid[i][j].show(color(255));
    }
  }

  grid[start.y][start.x].show(color(0, 0, 255));
  grid[end.y][end.x].show(color(0, 255, 0));

  grid[start.y][start.x].wall = false;
  grid[end.y][end.x].wall = false;

  closedSet = [];
  openedSet = [];
  openedSet.push(grid[start.y][start.x]);
}

var startSelected = false;
var endSelected = false;

function mousePressed() {
  var currX = Math.floor(mouseX / width);
  var currY = Math.floor(mouseY / height);

  if (started) {
    reset();
  }
  if (currX === start.x && currY === start.y) {
    startSelected = true;
  } else if (currX === end.x && currY === end.y) {
    endSelected = true;
  }
}

function mouseReleased() {
  startSelected = false;
  endSelected = false;
}

function mouseDragged() {
  var currX = Math.floor(mouseX / width);
  var currY = Math.floor(mouseY / height);

  if (currY >= 0 && currY <= rows - 1 && currX >= 0 && currX <= cols - 1) {
    if (startSelected) {
      grid[start.y][start.x].distance = infinity;
      grid[start.y][start.x].show(color(255));

      start.x = currX;
      start.y = currY;

      grid[start.y][start.x].distance = 0;
      grid[start.y][start.x].show(color(0, 0, 255));
      openedSet = [];
      openedSet.push(grid[start.y][start.x]);
      return;
    }

    if (endSelected) {
      grid[end.y][end.x].show(color(255));

      end.x = currX;
      end.y = currY;

      grid[end.y][end.x].show(color(0, 255, 0));

      return;
    }

    if (
      (currY === start.y && currX === start.x) ||
      (currY === end.y && currX === end.x)
    ) {
      console.log("skip");
    } else {
      grid[currY][currX].show(color(0, 255, 0));
      grid[currY][currX].wall = true;
      grid[currY][currX].show(color(0, 0, 0));
    }
  }
}
