var canvasHeight = 350;
var canvasWidth = 350;
var cols = 10;
var rows = 10;
var height, width;
var grid = new Array(rows);
var infinity = Number.MAX_VALUE;
var start, end;
var path = [];

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

  if (random(1) < 0.3) {
    this.wall = true;
  }

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
  };
}

function heuristic(a, b) {
  return dist(a.x, a.y, b.x, b.y);
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
    closedSet[i].show(color(255, 0, 0));
  }

  for (var i = 0; i < openedSet.length; ++i) {
    openedSet[i].show(color(0, 255, 0));
  }

  if (openedSet.length > 0) {
    // keep going
    console.log(openedSet);

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

    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
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
        grid[i][j].show(color(255, 102, 26));
      } else if (grid[i][j].isAdjecent) {
        grid[i][j].show(color(204, 153, 0));
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

    if (min.x === end.x && min.y === end.y) {
      console.log("FOUND");
      noLoop();
      return;
    }

    for (let i = 0; i < min.adjacent.length; ++i) {
      let adj = min.adjacent[i];
      let dist = min.distance + 1;

      grid[adj.y][adj.x].isAdjecent = true;

      if (adj.visited === false && dist < adj.distance && adj.wall === false) {
        grid[adj.y][adj.x].distance = dist;
        grid[adj.y][adj.x].previous = min;
      }
    }
  } else {
    console.log("NOT FOUND");
    noLoop();
  }
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);
  height = canvasHeight / rows;
  width = canvasWidth / cols;

  start = {
    x: 0,
    y: 0
  };

  end = {
    x: cols - 1,
    y: rows - 1
  };

  for (let i = 0; i < rows; ++i) {
    grid[i] = new Array(cols);
    for (let j = 0; j < cols; ++j) {
      grid[i][j] = new Cell(j, i);
    }
  }

  for (var i = 0; i < rows; ++i) {
    for (var j = 0; j < cols; ++j) {
      grid[i][j].loadAdjacent();
    }
  }

  grid[start.y][start.x].wall = false;
  grid[end.y][end.x].wall = false;

  openedSet.push(grid[start.y][start.x]);
}

function draw() {
  background(0);

  for (var i = 0; i < cols; ++i) {
    for (var j = 0; j < rows; ++j) {
      grid[i][j].show(color(255));
    }
  }

  //dijkstra();
  a_star();

  for (let i = 0; i < path.length; ++i) {
    path[i].show(color(51, 102, 153));
  }
}
