var diagonals = false;
var infinity = Number.MAX_VALUE;

function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.visited = false;
  this.previous = null;
  this.distance = this.x === start.x && this.y === start.y ? 0 : infinity;
  this.adjacent = [];
  this.neighbors = [];
  this.isAdjecent = false;
  this.wall = false;

  this.show = function(color) {
    stroke(0);
    fill(color);

    if (this.wall) {
      fill(0);
    }

    rect(this.x * width, this.y * height, width, height);
  };

  this.clear = function(clearWall) {
    this.isAdjecent = false;
    this.visited = false;
    this.previous = null;
    this.distance = this.x === start.x && this.y === start.y ? 0 : infinity;
    this.f = 0;
    this.g = 0;
    this.h = 0;

    if (clearWall) {
      this.wall = false;
    }
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

  this.checkNeighbors = function() {
    this.neighbors = [];

    if (this.y > 1 && !grid[this.y - 2][this.x].visited) {
      this.neighbors.push(grid[this.y - 2][this.x]);
    }

    if (this.y < rows - 2 && !grid[this.y + 2][this.x].visited) {
      this.neighbors.push(grid[this.y + 2][this.x]);
    }

    if (this.x > 2 && !grid[this.y][this.x - 2].visited) {
      this.neighbors.push(grid[this.y][this.x - 2]);
    }

    if (this.x < cols - 2 && !grid[this.y][this.x + 2].visited) {
      this.neighbors.push(grid[this.y][this.x + 2]);
    }

    var r = floor(random(0, this.neighbors.length));
    return this.neighbors[r];
  };
}
