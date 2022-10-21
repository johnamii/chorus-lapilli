This is a web-based game of terni lapilli, an old Roman game quite similar to tic-tac-toe. For my assignment, chorus lapilli, I have
derived the tic-tac-toe implementation from a React tutorial (https://reactjs.org/tutorial/tutorial.html), then modified it visually
and functionally to replicate terni lapilli. 

The goal is to place pieces on the board and align them in a sequence of three before your opponent: vertically, horizontally, or diagonally.

The difference is that, in contrast to tic-tac-toe, once each player has 3 pieces on the board, they cannot place any more; rather, they must
move their pieces into open spaces with hopes of maneuvering into a winning sequence.

There is one extra rule: if a players piece occupies the center space, their next move MUST result in a winning sequence or vacate the center
space.

Note: instead of a grid of 9 squares, I decided to implement a circular board with a different design, based on images of old boards used by the
Romans. The game plays identically, just is visaully different.

Controls:
    -For the first 6 turns, the user may select an empty space to place a 'pebble'.

    -The box below the board will indicate which color has the next move.

    -Once 6 pieces are on the board, the user should click one of the available pieces to select it.

    -Then, the user may click one of the highlighted spaces to move their piece there, iff it does not violate the rules of the center space.

    -The user may also scroll and click in the box below, which maps to a list of previous versions of the board. This allows the user to
     step revert to an earlier move, to redo previous decisions.
