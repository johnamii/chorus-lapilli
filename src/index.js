import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const Pebble = (props) => {

    return (
        <div 
            className='pebble' 
            style={props.light !== null 
                ? props.light === 'Light'
                    ? {backgroundColor:'white'} 
                    :  {backgroundColor:'black'}
                : {visibility:'false'}
            }>

        </div>
    )
}

const Slot = (props) => {
    return (
        <button 
            className='inner-slot' 
            onClick={() => {props.handleClick(); }}
            style={ !props.gameOver 
                        ? props.selected 
                            ? {background: 'rgba(0, 200, 0, .5)'} 
                            : props.available
                                ? {background: 'rgba(50, 100, 250, .5)'}
                                : {background: props.ifCenter}
                        : {background: 'rgba(200, 200, 200, .1)'}
                        }
        >
            { props.value ? <Pebble light={props.value}/> : null}
        </button>
    )
}

const Board = (props) => {
    function renderSlot(i) {
        if (i === 4 && props.centerAlert) {
            var backColor = 'rgba(150, 0, 0, .5)';
        }
        else {
            backColor = 'rgba(0,0,0,.3)';
        }
        return (
            <Slot
                value={props.slots[i]}
                handleClick={() => props.handleClick(i)}
                i={i}
                ifCenter={backColor}
                selected={props.activeSlot === i}
                available={!props.slots[i] && props.availSlots.includes(i)}
                gameOver={props.gameOver}
            />
        );
    }

    return (
        <div className='board'>
            <div className='line'>
                <div className='line' style={{transform:'rotate(90deg)'}}/>
                <div className='line' style={{transform:'rotate(-45deg)'}}/>
                <div className='line' style={{transform:'rotate(45deg)'}}/>

                <div className='slot' style={{transform:'translate(200%, -55%)'}}>{renderSlot(4)}</div>
                <div className='slot' style={{transform:'translate(200%, -405%)'}}>{renderSlot(1)}</div>
                <div className='slot' style={{transform:'translate(20%, -430%)'}}>{renderSlot(0)}</div>
                <div className='slot' style={{transform:'translate(380%, -530%)'}}>{renderSlot(2)}</div>
                <div className='slot' style={{transform:'translate(200%, -210%)'}}>{renderSlot(7)}</div>
                <div className='slot' style={{transform:'translate(450%, -555%)'}}>{renderSlot(5)}</div>
                <div className='slot' style={{transform:'translate(-50%, -655%)'}}>{renderSlot(3)}</div>
                <div className='slot' style={{transform:'translate(20%, -580%)'}}>{renderSlot(6)}</div>
                <div className='slot' style={{transform:'translate(375%, -680%)'}}>{renderSlot(8)}</div>
            </div>
        </div>
    )
}

class Game extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            lightIsNext: true,
            availSlots: [],
            activeSlot: null,
            commentary: "The game begins!",
            centerAlert: false,
            winner: null,
            infoVisible: false
        }
    }

    handleClick(i){
        // Init board and history for change
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const slots = current.squares.slice();

        // Check whose turn it is
        let val = this.state.lightIsNext ? 'Light' : 'Dark';

        // Refuse input if game over!
        if (this.state.winner) {
            this.announce("Game over, " + this.state.winner + " wins!")
            return;
        }

        // Handle clicking of a slot
        if (this.state.stepNumber < 6 && !slots[i]) {
            // PLACING PEBBLES
            slots[i] = val;
            this.announce(val + " pebble was placed in the " + positions[i] + " slot.");
        }   
        else if (this.state.stepNumber >= 6) {
            // MOVING PEBBLES
            if (slots[i] === val) {
                // SELECT A SLOT
                this.setState( 
                    this.state.activeSlot === i 
                        ? {activeSlot: null, availSlots: []}
                        : {activeSlot: i, availSlots: neighbors[i]}
                    );
                return;
            }
            else if (this.state.activeSlot !== null && !slots[i] && this.state.availSlots.includes(i)) {
                // MOVE TO AVAILABLE SLOT IF PEBBLE SELECTED
                if (slots[4] === val) {
                    let temp = slots;
                    temp[i] = this.state.lightIsNext ? 'Light' : 'Dark';
                    if (this.state.activeSlot !== 4 && !calculateWinner(temp)){
                        this.announce('Invalid! Move must vacate center or result in victory.')
                        return;
                    }
                }

                slots[this.state.activeSlot] = null;
                slots[i] = val;
                this.announce(val + " pebble was moved to the " + positions[i] + " slot");
                this.setState({activeSlot: null, availSlots: []})
            }
            else {
                return;
            }
        }
        else {
            return;
        }

         // Turn center red if occupied by current mover
         if (slots[4] !== val && slots[4] !== null) {
            this.setState({centerAlert: true})
        }
        else {
            this.setState({centerAlert: false})
        }

        // Other check for victory
        if (calculateWinner(slots)){
            this.announce("Game over, " + val + " wins!")
            this.setState({winner: val});
        }
        
        // Update board and history
        this.setState({
            history: history.concat([{
                squares: slots,
            }]),
            stepNumber: history.length,
            lightIsNext: !this.state.lightIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            lightIsNext: (step % 2) === 0,
        });
        this.announce("Game reverted to turn " + (step + 1));
        if (!calculateWinner(this.state.history[step])){
            this.setState({winner: null});
        }
    }

    announce(str) {
        console.log(str);
        this.setState({commentary: str});
    }

    render(){
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const moves = history.map((step, move) => {
            const desc = move 
            ? 'Go to move #' + move 
            : 'Go to game start';

            return (
                <li key={move}>
                    <button 
                        className='stepback-button'
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>
                </li>
            )
        })

        let status;
        if (this.state.winner) {
            status = 'Winner: ' + this.state.winner;
        }else {
            status = 'Next player: ' + (this.state.lightIsNext ? 'Light' : 'Dark');
        }

        return(
            <div className='game'>
                <div className='header'> <h1>Terni Lapilli</h1> </div>
                <div className='game-commentary'> {this.state.commentary}</div>
                <Board 
                    slots={current.squares} 
                    handleClick={(i) => this.handleClick(i)}
                    activeSlot={this.state.activeSlot}
                    availSlots={this.state.availSlots}
                    centerAlert={this.state.centerAlert}
                    gameOver={this.state.winner != null}
                />

                <div className="game-info">
                    <div className='game-announcements'>{status}</div>
                    <div className='game-moves'>
                        <ol className='step-list'>{moves}</ol>
                    </div>
                </div>

                <button 
                  className='info-button'
                  onClick={(prevState) => this.setState({infoVisible: !this.state.infoVisible})}
                >
                        Info
                </button>
                { this.state.infoVisible && 
                <div className='info-div'>
                    <p className='info-text'>
                        Terni Lapilli is an old Roman pebble game played very similarly to tic-tac-toe.
                        The rules are simple:
                            <li>Each player may only place 3 tiles.</li>
                            <li>Instead of placing a 4th tile, they must reposition a current one.</li>
                            <li>If a tile occupies the center space, its next move must either:</li>
                            <dd>Vacate the space</dd>
                            <dd>Result in victory</dd>
                            <li>A player wins when they can align 3 tiles in a row</li>
                        
                    </p>
                </div> 
                }
            </div>
        )
    }
}

//=====//

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>)

//=============//  

function calculateWinner(squares) {
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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

const neighbors = [
    [1, 3, 4],
    [0, 2, 4],
    [1, 4, 5],
    [0, 4, 6],
    [0, 1, 2, 3, 5, 6, 7, 8],
    [2, 4, 8],
    [3, 4, 7],
    [4, 6, 8],
    [4, 5, 7]
];

const positions = [
    "top left",
    "top center",
    "top right",
    "mid left",
    "center",
    "mid right",
    "bottom left",
    "bottom center",
    "bottom right"
]