let nrows = 11;
let ncols = 11;
let nwalls = 7;

let board = document.querySelector(".board");

for (let i = 0; i < nrows; i++) {
  let rowElement = document.createElement("div");
  rowElement.classList.add("row");
  for (let j = 0; j < ncols; j++) {
    let cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    rowElement.appendChild(cellElement);
  }
  board.appendChild(rowElement);
}

let boardArray = document.querySelectorAll(".cell");

for (i = 0; i < boardArray.length; i++) {
  if (i % 2 == 0) boardArray[i].classList.add("color-one");
  else boardArray[i].classList.add("color-two");
}

class Snake {
  constructor() {
    this.chopSnake = true;
    this.snakeArray = [];
    this.wallArray = [];
    this.snakeDirection = undefined;
    this.constructArray();
    this.draw();
  }

  constructArray() {
    let center = Math.floor(nrows / 2) * ncols + Math.floor(ncols / 2);
    for (let i = center - 2; i < center + 2; i++) {
      this.snakeArray.push(i);
    }

    for (let i = 0; i < nwalls; i++) {
      let wall = Math.floor(Math.random() * boardArray.length);
      if (
        insideArray(wall, this.snakeArray) ||
        insideArray(wall, this.wallArray)
      ) {
        wall = Math.floor(Math.random() * boardArray.length);
      }
      this.wallArray.push(wall);
    }
  }

  draw() {
    for (let i = 0; i < this.snakeArray.length; i++) {
      boardArray[this.snakeArray[i]].classList.add("snake");
    }

    for (let i = 0; i < this.wallArray.length; i++) {
      boardArray[this.wallArray[i]].classList.add("wall");
    }
  }

  move(direction) {
    let collision = checkCollision(
      this.snakeArray[this.snakeArray.length - 1],
      direction
    );
    if (collision) {
      initialize();
      return;
    }

    if (this.chopSnake) {
      let lastCell = this.snakeArray.shift();
      boardArray[lastCell].classList.remove("snake");
    } else {
      this.chopSnake = true;
    }

    let nextCell;
    if (direction == "left") {
      nextCell = this.snakeArray[this.snakeArray.length - 1] - 1;
      // this.snakeDirection = 'left';
    } else if (direction == "right") {
      nextCell = this.snakeArray[this.snakeArray.length - 1] + 1;
      // this.snakeDirection = 'right';
    } else if (direction == "up") {
      nextCell = this.snakeArray[this.snakeArray.length - 1] - ncols;
      // this.snakeDirection = 'up';
    } else if (direction == "down") {
      nextCell = this.snakeArray[this.snakeArray.length - 1] + ncols;
      // this.snakeDirection = 'down';
    }

    this.snakeArray.push(nextCell);
    boardArray[nextCell].classList.add("snake");
  }

  food() {
    let food = Math.floor(Math.random() * boardArray.length);
    while (
      insideArray(food, this.snakeArray) ||
      insideArray(food, this.wallArray)
    ) {
      food = Math.floor(Math.random() * boardArray.length);
    }
    // boardArray[food].classList.add('food');
    boardArray[food].appendChild(leaf);
    return food;
  }

  grow() {
    this.chopSnake = false;
  }
}

let snake, food, playGame;
let leaf = document.createElement("i");
leaf.classList.add("fas");
leaf.classList.add("fa-leaf");

function initialize() {
  for (let i = 0; i < boardArray.length; i++) {
    boardArray[i].classList.remove("snake");
    boardArray[i].classList.remove("wall");
    // boardArray[i].classList.remove('food');
    // boardArray[i].remove(leaf);
  }
  clearInterval(playGame);

  snake = new Snake();
  food = snake.food();
  playGame = undefined;
}
initialize();

function gamePlay() {
  snake.move(snake.snakeDirection);
  eatFood();
}

function eatFood() {
  if (snake.snakeArray[snake.snakeArray.length - 1] == food) {
    // boardArray[food].classList.remove('food');
    // boardArray[food].remove(leaf);
    food = snake.food();
    snake.grow();
  }
}

function insideArray(element, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (element == arr[i]) {
      return true;
    }
  }
  return false;
}

function checkCollision(snakeHead, direction) {
  if (
    (snakeHead % ncols == 0 && direction == "left") ||
    (snakeHead % ncols == ncols - 1 && direction == "right") ||
    (snakeHead / ncols < 1 && direction == "up") ||
    (snakeHead / ncols > nrows - 1 && direction == "down")
  ) {
    return true;
  } else if (
    (direction == "left" && insideArray(snakeHead - 1, snake.snakeArray)) ||
    (direction == "right" && insideArray(snakeHead + 1, snake.snakeArray)) ||
    (direction == "up" && insideArray(snakeHead - ncols, snake.snakeArray)) ||
    (direction == "down" && insideArray(snakeHead + ncols, snake.snakeArray))
  ) {
    return true;
  } else if (
    (direction == "left" && insideArray(snakeHead - 1, snake.wallArray)) ||
    (direction == "right" && insideArray(snakeHead + 1, snake.wallArray)) ||
    (direction == "up" && insideArray(snakeHead - ncols, snake.wallArray)) ||
    (direction == "down" && insideArray(snakeHead + ncols, snake.wallArray))
  ) {
    return true;
  }
  return undefined;
}

document.addEventListener("keydown", function (e) {
  if (
    !playGame &&
    !(e.code == "ArrowUp" || e.code == "ArrowRight" || e.code == "ArrowDown")
  ) {
    console.log("here");
    return;
  }

  let moved = false;
  if (
    e.code == "ArrowUp" &&
    snake.snakeDirection != "up" &&
    snake.snakeDirection != "down"
  ) {
    snake.move("up");
    snake.snakeDirection = "up";
    moved = true;
  } else if (
    e.code == "ArrowDown" &&
    snake.snakeDirection != "up" &&
    snake.snakeDirection != "down"
  ) {
    snake.move("down");
    snake.snakeDirection = "down";
    moved = true;
  } else if (
    e.code == "ArrowLeft" &&
    snake.snakeDirection != "left" &&
    snake.snakeDirection != "right"
  ) {
    snake.move("left");
    snake.snakeDirection = "left";
    moved = true;
  } else if (
    e.code == "ArrowRight" &&
    snake.snakeDirection != "left" &&
    snake.snakeDirection != "right"
  ) {
    snake.move("right");
    snake.snakeDirection = "right";
    moved = true;
  }

  if (moved) {
    eatFood();
    clearInterval(playGame);
    playGame = setInterval(gamePlay, 180);
  }
});
