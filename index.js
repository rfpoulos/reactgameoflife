let submitButton = document.querySelector('button');
let reactRoot = document.querySelector('.react-root');
let h = React.createElement



submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    let form = document.forms["size"];
    let columnsInput = form["columns"];
    let rowsInput = form["rows"];
    let columns = parseInt(columnsInput.value);
    let rows = parseInt(rowsInput.value);
    form.setAttribute("class", "hide");
    let startBoard = generateBoard(rows, columns);
    ReactDOM.render(h(Board, {seed: startBoard}, []), reactRoot);
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

let nextFrame = seed =>
    seed.map((row, indexRow) =>
        row.map((column, indexColumn) => 
            checkNeighbors(seed, indexRow, indexColumn))
    );


let checkNeighbors = (seed, myRow, myColumn) => {
    let myself = seed[myRow][myColumn];
    let aliveCount = 0;
    for (let currentRow = myRow - 1; currentRow < myRow + 2; currentRow++) {
        for (let currentColumn = myColumn - 1; currentColumn < myColumn + 2; currentColumn++) {
            let rowCoor = checkWrap(currentRow, seed.length);
            let columnCoor = checkWrap(currentColumn, seed[0].length);
            if (seed[rowCoor][columnCoor] === 'alive'){
                aliveCount++;
            };
        };
    };
    if (myself === 'alive') {
        aliveCount -= 1;
    }
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
    if ((myself === 'alive' && aliveCount === (2 || 3)) 
        || (myself === 'dead' && aliveCount === 3)) {
            return 'alive';
    } else {
        return 'dead';
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            seed: props.seed
        }
    };
    render() {
        let { seed } = this.state;
        let onClick = () => {
            this.setState({ seed: nextFrame(seed) });
        };
        return (
        <div key="board" className="container" onClick={onClick}>
            {this.state.seed.map((row, rowIndex) =>
                <div key={rowIndex.toString()} className="row">
                    {row.map((column, columnIndex) =>
                        <div key={columnIndex.toString()} className={column}>
                        </div>
                )}</div>
            )}
        </div>);
    }
}