const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const width = 600;
const height = 600;
//total number of EITHER vertical or horizontal cells
const cells = 3;
const unitLength = width / cells;
const wallThickness = 2;

const engine = Engine.create();
const { world } = engine;
world.gravity.y = false;
const render = Render.create({
  element: document.body,
  engine: engine,
  //canvas dimensions
  options: {
    wireframes: true,
    width,
    height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, wallThickness, {
    isStatic: true,
    label: "outerWall"
  }),
  Bodies.rectangle(width / 2, height, width, wallThickness, {
    isStatic: true,
    label: "outerWall"
  }),
  Bodies.rectangle(0, height / 2, wallThickness, height, {
    isStatic: true,
    label: "outerWall"
  }),
  Bodies.rectangle(width, height / 2, wallThickness, height, {
    isStatic: true,
    label: "outerWall"
  })
];

World.add(world, walls);

// maze generation

const shuffleNeighbors = arr => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};
const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));

// console.log(grid);

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

// console.log(verticals);
// console.log(horizontals);

const startRow = Math.floor(Math.random() * cells);
const startCol = Math.floor(Math.random() * cells);

const gridWallSetup = (row, col) => {
  // if cell[row, col] visited, return
  if (grid[row][col]) {
    return;
  }
  // else mark visited => grid array update
  grid[row][col] = true;

  // Assemble random order of neighbor
  const neighbors = shuffleNeighbors([
    //top
    [row - 1, col, "up"],
    //right
    [row, col + 1, "right"],
    //bottom
    [row + 1, col, "down"],
    //left
    [row, col - 1, "left"]
  ]);

  // For each neighbor
  for (let neighbor of neighbors) {
    const [nextRow, nextCol, direction] = neighbor;
    // check neighbor bounds
    if (nextRow < 0 || nextRow >= cells || nextCol < 0 || nextCol >= cells) {
      continue;
    }
    // if visited continue to next
    if (grid[nextRow][nextCol]) {
      continue;
    }

    // remove the wall from the corresponding tracking array
    if (direction == "left") {
      verticals[row][col - 1] = true;
    } else if (direction == "right") {
      verticals[row][col] = true;
    } else if (direction == "up") {
      horizontals[row - 1][col] = true;
    } else if (direction == "down") {
      horizontals[row][col] = true;
    }
    // else visit next cell
    gridWallSetup(nextRow, nextCol);
  }
};

gridWallSetup(startRow, startCol);

horizontals.forEach((rowOfWalls, rowIndex) => {
  rowOfWalls.forEach((noWall, columnIndex) => {
    if (noWall) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      wallThickness,
      { isStatic: true, label: "innerHorizontalWall" }
    );
    World.add(world, wall);
  });
});

verticals.forEach((colOfWalls, rowIndex) => {
  colOfWalls.forEach((noWall, columnIndex) => {
    if (noWall) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      wallThickness,
      unitLength,
      { isStatic: true, label: "innerVerticalWall" }
    );
    World.add(world, wall);
  });
});

//finish point of maze
const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.7,
  unitLength * 0.7,
  { isStatic: true, label: "goal" }
);
World.add(world, goal);

//starting icon to move throughout the maze
const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength / 4, {
  label: "ball"
});
World.add(world, ball);

document.addEventListener("keypress", event => {
  const { x, y } = ball.velocity;
  // console.log("x velocity: ", x, "y velocity: ", y);
  const pressed = event.key.toLocaleLowerCase();
  if (pressed === "w") {
    // console.log("move up");
    Body.setVelocity(ball, { x, y: y - 5 });
  } else if (pressed === "a") {
    // console.log("move left");
    Body.setVelocity(ball, { x: x - 5, y });
  } else if (pressed === "s") {
    // console.log("move down");
    Body.setVelocity(ball, { x, y: y + 5 });
  } else if (pressed === "d") {
    // console.log("move right");
    Body.setVelocity(ball, { x: x + 5, y });
  } else {
    console.log("ANY other key besides WASD");
  }
});

//win condition

Events.on(engine, "collisionStart", event => {
  event.pairs.forEach(collision => {
    const labels = ["ball", "goal"];

    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      console.log("winner");
    }
  });
});
