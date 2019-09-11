var startSelected = false;
var endSelected = false;

function softReset() {
  hide_alerts();

  for (var i = 0; i < rows; ++i) {
    for (var j = 0; j < cols; ++j) {
      grid[i][j].clear(false);
    }
  }

  path = [];
  closedSet = [];
  openedSet = [];
  openedSet.push(grid[start.y][start.x]);
}

function reset() {
  noLoop();
  hide_alerts();
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

  path = [];

  grid[start.y][start.x].show(color(0, 0, 255));
  grid[end.y][end.x].show(color(0, 255, 0));

  grid[start.y][start.x].wall = false;
  grid[end.y][end.x].wall = false;

  closedSet = [];
  openedSet = [];
  openedSet.push(grid[start.y][start.x]);
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

function buildPath(cell) {
  path = [];

  var temp = cell;

  while (temp) {
    path.push(temp);
    temp = temp.previous;
  }
}

function mouseInCanvas() {
  var currX = Math.floor(mouseX / width);
  var currY = Math.floor(mouseY / height);

  if (currY >= 0 && currY <= rows - 1 && currX >= 0 && currX <= cols - 1) {
    return true;
  }

  return false;
}

function mousePressed() {
  var currX = Math.floor(mouseX / width);
  var currY = Math.floor(mouseY / height);

  if (started && mouseInCanvas()) {
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

  if (mouseInCanvas()) {
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

function empty_cell_draw() {
  for (var i = 0; i < rows; ++i) {
    for (var j = 0; j < cols; ++j) {
      grid[i][j].show(color(255));
    }
  }
}

function path_draw() {
  for (let i = 0; i < path.length; ++i) {
    path[i].show(color(255, 255, 0));
  }
}

function points_draw() {
  grid[start.y][start.x].show(color(0, 0, 255));
  grid[end.y][end.x].show(color(0, 255, 0));
}

function get_algorithm() {
  let e = document.getElementById("algo");
  return e.options[e.selectedIndex].value;
}

function hide_alerts() {
  document.getElementById(`success-alert`).style.display = "none";
  document.getElementById(`failed-alert`).style.display = "none";
}

function alert(type, message) {
  hide_alerts();
  document.getElementById(`${type}-alert`).innerHTML = message;
  document.getElementById(`${type}-alert`).style.display = "block";
}

document.getElementById("start-button").addEventListener("click", function() {
  if (started) {
    softReset();
  }

  started = true;
  loop();
});

document.getElementById("reset-button").addEventListener("click", function() {
  reset();
  console.log("reset");
});
