var current = null;
var stack = [];

function removeCellBetween(a, b) {
  var xDiff = a.x - b.x;
  var yDiff = a.y - b.y;

  // left
  if (xDiff === 2) {
    grid[a.x - 1][a.y].wall = false;
  } else if (xDiff === -2) {
    grid[a.x + 1][a.y].wall = false;
  }

  if (yDiff === 2) {
    grid[a.x][a.y - 1].wall = false;
  } else if (yDiff === -2) {
    grid[a.x][a.y + 1].wall = false;
  }
}

function maze() {
  for (var i = 0; i < rows; ++i) {
    for (var j = 0; j < cols; ++j) {
      grid[i][j].wall = true;
      grid[i][j].visited = false;
    }
  }

  current = grid[0][0];

  do {
    current.visited = true;
    current.wall = false;
    var next = current.checkNeighbors();

    if (next) {
      next.visited = true;
      next.wall = false;

      stack.push(current);

      removeCellBetween(current, next);

      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else if (stack.length === 0) {
      for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < cols; ++j) {
          grid[i][j].visited = false;
        }
      }

      break;
    }
  } while (true);

  for (var i = 0; i < rows; ++i) {
    for (var j = 0; j < cols; ++j) {
      grid[i][j].show(color(255));
    }
  }

  grid[start.y][start.x].wall = false;
  grid[end.y][end.x].wall = false;
  grid[start.y][start.x].show(color(0, 0, 255));
  grid[end.y][end.x].show(color(0, 255, 0));
}

document.getElementById("maze-button").addEventListener("click", function() {
  maze();
});
