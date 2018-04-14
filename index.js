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
    form.style="display:none";
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

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            seed: props.seed
        }
    };
    render() {
        return (
        <div className="container">
            {this.state.seed.map(row =>
                <div className="row">{row.map(column =>
                    <div className={column}></div>
                )}</div>
            )}
        </div>);
    }
}