// a_star
var openedSet = []; // nodes that still need to be processed
var closedSet = []; // nodes that have already been processed

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

function a_star_draw() {
  for (var i = 0; i < closedSet.length; ++i) {
    closedSet[i].show(color(255, 153, 51));
  }

  for (var i = 0; i < openedSet.length; ++i) {
    openedSet[i].show(color(255, 51, 0));
  }
}

function a_star_update() {
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
      alert(
        'success',
        '<strong>A* Algorithm: shortest path found to ending block</strong>'
      );
      noLoop();
      return;
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
    alert(
      'failed',
      '<strong>A* Algorithm: no possible paths available to ending block</strong>'
    );
    noLoop();
    return;
  }
}
