const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
const height = 600;


//total number of EITHER vertical or horizontal cells
const cells = 3;

const engine = Engine.create();
const { world } = engine;
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
Runner.run(Runner.create(), engine )

// walls 
const walls = [
    Bodies.rectangle(width / 2, 0, width, 40,{isStatic: true}),
    Bodies.rectangle(width / 2, height, width, 40,{isStatic: true}),
    Bodies.rectangle(0, height/2, 40, height, {isStatic: true}),
    Bodies.rectangle(width, height/2, 40, height, {isStatic: true})
]

World.add(world, walls);



// maze generation

const shuffleNeighbors = (arr) => {
    let counter = arr.length;

    while( counter > 0){
        const index = Math.floor(Math.random() * counter);
        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}
const grid = 
Array(cells)
    .fill(null)
    .map(() => Array(cells)
    .fill(false));

// console.log(grid);

const verticals = 

Array(cells)
    .fill(null)
    .map(()=> Array(cells - 1)
    .fill(false));

const horizontals = 
    Array(cells - 1)
        .fill(null)
        .map(() =>  Array(cells)
        .fill(false));


// console.log(verticals);
// console.log(horizontals);

const startRow  = Math.floor(Math.random() * cells);
const startCol  = Math.floor(Math.random() * cells);

const gridWallSetup = (row, col) =>{
    // if cell[row, col] visited, return
    if(grid[row][col]){
        return;
    }
    // else mark visited => grid array update
    grid[row][col] = true;

    // Assemble random order of neighbor
    const neighbors = shuffleNeighbors([
        //top
        [row-1, col],
        //right 
        [row, col +1],
        //bottom
        [row +1, col],
        //left
        [row, col -1]
    ]);

    // For each neighbor
        // check neighbor bounds
            // if visited continue to next
            // else visit next cell
            // remove the wall from the corresponding tracking array
            
}

gridWallSetup(1, 1);

