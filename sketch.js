var canvasHeight = 700;
var canvasWidth = 700;
var cols = 10;
var rows = 10;
var height, width;
var grid = new Array(rows);
var current;
var infinity = Number.MAX_VALUE;
var start, end;
var shortestPaths = [];
var visited = [];
var unvisited = [];
var path = [];

function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.shortestPaths = [];
    this.visited = false;
    this.previous = null;
    this.distance = this.x === start.x && this.y === start.y ? 0 : infinity;
    this.adjacent = [];
    this.isAdjecent = false;
    this.wall = false;

    if (random(1) < 0.45) {
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

function getUnvisitedCellWithMinDistance() {
    var currentMin = infinity;
    var minCoord = {
        x: null,
        y: null
    };

    for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < cols; ++j) {
            if (!grid[i][j].visited && grid[i][j].distance < currentMin && grid[i][j].wall === false) {
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
    if (getUnvistedLength() > 0) {
        let minCoords = getUnvisitedCellWithMinDistance();
        if (minCoords.x === null || minCoords.y === null) {
            console.log('NOT POSSIBLE');
            noLoop();
            return;
        }

        grid[minCoords.y][minCoords.x].visited = true;
        grid[minCoords.y][minCoords.x].isAdjecent = false;
        let min = grid[minCoords.y][minCoords.x];

        buildPath(min);

        if (min.x === end.x && min.y === end.y) {
            console.log('FOUND');
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
        console.log('NOT FOUND');
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
}

function draw() {
    dijkstra();

    background(0);

    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
            if (grid[i][j].visited) {
                grid[i][j].show(color(255, 102, 26));
            } else if (grid[i][j].isAdjecent) {
                grid[i][j].show(color(204, 153, 0));
            } else {
                grid[i][j].show(color(255, 255, 255));
            }
        }
    }

    for (let i = 0; i < path.length; ++i) {
        path[i].show(color(51, 102, 153));
    }
}
