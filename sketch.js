var canvasHeight = 500;
var canvasWidth = 500;
var cols = 5;
var rows = 5;
var height, width;
var grid = new Array(rows);
var current;
var infinity = Number.MAX_VALUE;
var start, end;
var shortestPaths = [];
var visited = [];
var unvisited = [];

function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.shortestPaths = [];
    this.visited = false;
    this.previous = null;
    this.distance = this.x === x && this.y === y ? 0 : infinity;
    this.adjacent = [];
    this.wall = false;

    if (random(1) < 0.2) {
        this.wall = true;
    }

    this.show = function() {
        stroke(0);
        fill(255);

        if (this.visited) {
            fill(255, 0, 0);
        }

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

function dijkstra() {
    if (getUnvistedLength() > 0) {
        let minCoords = getUnvisitedCellWithMinDistance();
        grid[minCoords.y][minCoords.x].visited = true;
        let u = grid[minCoords.y][minCoords.x];

        if (u.x === end.x && u.y === end.y) {
            console.log(u);
            noLoop();
            console.log('FOUND');
        }

        for (let i = 0; i < u.adjacent.length; ++i) {
            let adj = u.adjacent[i];
            let dist = u.distance + 1;

            if (dist < adj.distance && adj.wall === false) {
                grid[adj.y][adj.x].distance = dist;
                grid[adj.y][adj.x].previous = u;
            }
        }
    } else {
        noLoop();
        console.log('NOT FOUND');
    }
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    frameRate(15);
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

    console.log(end);

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

    console.log(grid);
}

function draw() {
    dijkstra();

    for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < cols; ++j) {
            grid[i][j].show();
        }
    }
}
