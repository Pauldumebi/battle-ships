import { createShip, hitShip, isShipSunk } from './Ship';

export const createBoard = (size = 10) => ({
  gridSize: size,
  grid: Array(size).fill(null).map(() => Array(size).fill(null)),
  ships: [],
  missedAttacks: [],
  successfulAttacks: []
});

export const isValidPlacement = (board, ship, x, y, isVertical) => {
  const { gridSize, grid } = board;

  // Check bounds
  if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return false;
  if (isVertical) {
    if (y + ship.size > gridSize) return false;
  } else {
    if (x + ship.size > gridSize) return false;
  }

  // Check overlap
  for (let i = 0; i < ship.size; i++) {
    let checkX = x;
    let checkY = y;

    if (isVertical) {
      checkY = y + i;
    } else {
      checkX = x + i;
    }

    if (grid[checkY][checkX] !== null) {
      return false;
    }
  }

  return true;
};

export const placeShip = (board, ship, x, y, isVertical) => {
  if (!isValidPlacement(board, ship, x, y, isVertical)) {
    return null;
  }

  const newGrid = board.grid.map(row => [...row]);
  for (let i = 0; i < ship.size; i++) {
    if (isVertical) {
      newGrid[y + i][x] = ship;
    } else {
      newGrid[y][x + i] = ship;
    }
  }

  return {
    ...board,
    grid: newGrid,
    ships: [...board.ships, ship]
  };
};

export const receiveAttack = (board, x, y) => {
  if (x < 0 || x >= board.gridSize || y < 0 || y >= board.gridSize) {
    throw new Error('Coordinates out of bounds');
  }

  const target = board.grid[y][x];

  if (target === null) {
    const alreadyMissed = board.missedAttacks.some(coord => coord.x === x && coord.y === y);
    if (!alreadyMissed) {
      return {
        board: {
          ...board,
          missedAttacks: [...board.missedAttacks, { x, y }]
        },
        result: { result: 'miss', ship: null }
      };
    }
    return { board, result: { result: 'miss', ship: null } };
  }

  const alreadyHit = board.successfulAttacks.some(coord => coord.x === x && coord.y === y);
  if (alreadyHit) {
    return { board, result: { result: 'hit', ship: target, sunk: isShipSunk(target) } };
  }

  // Update the ship itself in the ships array and grid
  const updatedShip = hitShip(target);
  const sunk = isShipSunk(updatedShip);

  // In a truly functional/immutable way, we need to update the ship reference everywhere in the grid
  // This is a bit complex for a simple grid of refs.
  // Alternative: The grid stores ship IDs or we mapping ships.
  // For simplicity, let's update the grid too.
  const newGrid = board.grid.map(row => row.map(cell => cell === target ? updatedShip : cell));
  const newShips = board.ships.map(s => s === target ? updatedShip : s);

  return {
    board: {
      ...board,
      grid: newGrid,
      ships: newShips,
      successfulAttacks: [...board.successfulAttacks, { x, y }]
    },
    result: { result: 'hit', ship: updatedShip, sunk }
  };
};

export const placeShipsRandomly = (board, shipsToPlace) => {
  let currentBoard = board;
  shipsToPlace.forEach(ship => {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * board.gridSize);
      const y = Math.floor(Math.random() * board.gridSize);
      const isVertical = Math.random() < 0.5;
      const result = placeShip(currentBoard, ship, x, y, isVertical);
      if (result) {
        currentBoard = result;
        placed = true;
      }
    }
  });
  return currentBoard;
};

export const areAllShipsSunk = (board) => {
  return board.ships.every(isShipSunk);
};

export const parseCoordinates = (input) => {
  const match = input.toUpperCase().trim().match(/^([A-J])([1-9]|10)$/);
  if (!match) return null;

  const rowChar = match[1];
  const colStr = match[2];

  const y = rowChar.charCodeAt(0) - 'A'.charCodeAt(0);
  const x = parseInt(colStr) - 1;

  return { x, y };
};
