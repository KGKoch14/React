import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const NUM_ROWS = 3;
const NUM_COLS = 3;

function Square(props) {
  return (
    <button 
    className="square" 
    onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      >{i}</Square>
    );
  }

  createBoard()
  {
    let board = [];

    for (let r = 0; r < NUM_ROWS; r++)
    {
      let rows = [];
      for(let c = 0; c < NUM_COLS; c++)
      {
        rows.push(this.renderSquare((NUM_COLS * r) + c))
      }
      board.push(<div className="board-row">{rows}</div>)
    }
    return board.slice();
  }

  render() {
    return (
      <div>{this.createBoard()}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveIndex: null,
      }],
      xTurn: true,
      stepNumber: 0,
      ascending: true,
    };
  }

  render() {
    const ascending = this.state.ascending;
    const history = this.state.history;
    //const historyMap = ascending ? history.slice() : history.slice().reverse();
    const current = history[this.state.stepNumber].squares;
    const winner = calculateWinner(current);

    var moves = history.map((step, move) => {
      const desc = move ?
      'Go to move ' + move + ': ' + (move % 2 === 0 ? 'O' : 'X') + this.getCoords(step.moveIndex):
      'Go to game start';
      const selected = move === this.state.stepNumber ? 'selected' : 'none';
      return (
        <li key={move} class={selected}>
          <button onClick={() => this.jumpTo(move)}>
          {selected.value} {desc} {step.squares}
          </button>
        </li>
      );
    });
    moves = ascending ? moves : moves.reverse();

    const status = winner ? 'Winner is ' + winner : 'Next player: ' + (this.state.xTurn ? 'X' : 'O');
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({ascending: !ascending})}>Reverse Moves</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  handleClick(i)
  {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const squares = history[history.length - 1].squares.slice();
    const xTurn = this.state.xTurn;
    if (squares[i] || calculateWinner(squares))
    {
      return;
    }
    squares[i] = xTurn ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveIndex: i,
      }]),
      xTurn: !xTurn,
      stepNumber: history.length,
    })
  }

  jumpTo(step)
  {
    this.setState({
      stepNumber: step,
      xTurn: (step % 2) === 0,
    })
  }

  getCoords(index)
  {
    if(null == index)
    {
      return 'null'
    }
    const row = Math.floor(index / NUM_ROWS);
    const col = index % NUM_COLS;
    return ('('+row+', '+col+')')
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares)
{
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
    {
      return squares[a]
    }
  }
  return null;
}
