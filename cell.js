export function Cell() {
  this.x = x;
  this.y = y;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.shortestPaths = [];
  this.visited = false;
  this.previous = null;
  this.distance =
    this.x === start.x && this.y === start.y ? 0 : Number.MAX_VALUE;
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

  return this;
}
