const submitButton = document.querySelector('button');
const reactRoot = document.querySelector('.react-root');
const h = React.createElement

submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    let form = document.forms["size"];
    let columnsInput = form["columns"];
    let rowsInput = form["rows"];
    let columns = parseInt(columnsInput.value);
    let rows = parseInt(rowsInput.value);
    form.setAttribute("class", "hide");
    let startBoard = generateBoard(rows, columns);
    ReactDOM.render(h(Game, {seed: startBoard}, []), reactRoot);
});

let randomAliveOrDead = () => {
    let coinFlip = Math.round(Math.random());
    if (coinFlip === 0) {
        return 'alive';
    } else {
        return 'dead';
    }
}

let generateBoard = (rows, columns) => {
    let boardRows = new Array(rows).fill(null);
    let board = boardRows.map(row => {
        let boardColumns = new Array(columns).fill(null);
        let boardValues = boardColumns.map(column => 
            randomAliveOrDead())
        return boardValues;
    });
    return board;
}

let nextArray = seed =>
    seed.map((row, indexRow) =>
        row.map((column, indexColumn) => 
            checkNeighbors(seed, indexRow, indexColumn))
    );

let checkNeighbors = (seed, row, col) => {
    let myself = seed[row][col];
    let aliveCount = 0;
    for (let currentRow = row - 1; currentRow < row + 2; currentRow++) {
        for (let currentColumn = col - 1; currentColumn < col + 2;  currentColumn++) {
                let rowCoor = checkWrap(currentRow, seed.length);
                let colCoor = checkWrap(currentColumn, seed[0].length);
                if (seed[rowCoor][colCoor] === 'alive'){
                    aliveCount++;
            };
        };
    };
    return checkIsAlive(myself, aliveCount);
};

let checkWrap = (location, length) => {
    if (location === -1) {
        return length - 1;
    } else if (location === length) {
        return 0;
    } else {
        return location;
    }
}

let checkIsAlive = (myself, aliveCount) => {
    //if myself is alive, the check neighbors funciton
    //adds an extra alive count.  Rule changed to 3 or 4.
    if ((myself === 'alive' && aliveCount === (3 || 4)) 
        || (myself === 'dead' && aliveCount === 3)) {
            return 'alive';
    } else {
        return 'dead';
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            seed: props.seed
        }
    };

    render() {
        let onClick = () => {
            this.setState({ seed: nextArray(this.state.seed) });
        };
        return <Board seed={this.state.seed} nextFrame={onClick}/>;
    }
}

let Board = ({seed, nextFrame}) =>
    <div key="board" className="container" onClick={nextFrame}>
            {seed.map((row, rowIndex) =>
                <Row row={row} key={rowIndex}/>
            )}
    </div>;

let Row = ({row}) =>
    <div className="row">
        {row.map((column, columnIndex) =>
            <Cell column={column} key={columnIndex} />
    )}</div>;

let Cell = ({column}) =>
    <div className={column}>
    </div>;
    