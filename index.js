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
    for (let currentRow = Math.max(0, myRow - 1); currentRow < Math.min(seed.length, myRow + 2); currentRow++) {
        for (let currentColumn = Math.max(0, myColumn - 1); currentColumn < Math.min(seed[0].length, myColumn + 2); currentColumn++) {
            if (seed[currentRow][currentColumn] === 'alive'){
                aliveCount++;
            };
        };
    };
    if (myself === 'alive') {
        aliveCount -= 1;
    }
    return checkIsAlive(myself, aliveCount);
};

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
    handleClick() {
        this.setState({
            seed: nextFrame(this.state.seed)
        })
    }
    render() {
        return (
        <div key="board" className="container" onClick={this.handleClick.bind(this)}>
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