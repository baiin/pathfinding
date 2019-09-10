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

function dijkstra_draw() {
  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      if (grid[i][j].visited) {
        grid[i][j].show(color(255, 153, 51));
      } else if (grid[i][j].isAdjecent) {
        grid[i][j].show(color(255, 51, 0));
      }
    }
  }
}

function dijkstra_update() {
  if (getUnvistedLength() > 0) {
    let minCoords = getUnvisitedCellWithMinDistance();
    if (minCoords.x === null || minCoords.y === null) {
      alert(
        'failed',
        "<strong>Dijkstra's Algorithm: no possible paths available to ending block</strong>"
      );
      noLoop();
      return;
    }

    grid[minCoords.y][minCoords.x].visited = true;
    grid[minCoords.y][minCoords.x].isAdjecent = false;
    let min = grid[minCoords.y][minCoords.x];

    buildPath(min);

    for (let i = 0; i < min.adjacent.length; ++i) {
      let adj = min.adjacent[i];
      let dist = min.distance + 1;

      grid[adj.y][adj.x].isAdjecent = true;

      if (adj.visited === false && dist < adj.distance && adj.wall === false) {
        grid[adj.y][adj.x].distance = dist;
        grid[adj.y][adj.x].previous = min;
      }

      if (adj.y === end.y && adj.x === end.x) {
        alert(
          'success',
          "<strong>Dijkstra's Algorithm: shortest path found to ending block</strong>"
        );
        noLoop();
        return;
      }
    }
  } else {
    alert(
      'failed',
      "<strong>Dijkstra's Algorithm: no possible paths available to ending block</strong>"
    );
    noLoop();
  }
}
