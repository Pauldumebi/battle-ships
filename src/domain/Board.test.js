import { describe, it, expect, beforeEach } from 'vitest';
import { createBoard, placeShip, receiveAttack, areAllShipsSunk, parseCoordinates } from './Board';
import { createShip } from './Ship';

describe('Board Functional', () => {
  let board;

  beforeEach(() => {
    board = createBoard();
  });

  it('should initialize with a 10x10 grid', () => {
    expect(board.grid.length).toBe(10);
    expect(board.grid[0].length).toBe(10);
  });

  it('should place a ship vertically', () => {
    const ship = createShip('Test', 3);
    const newBoard = placeShip(board, ship, 0, 0, true);
    expect(newBoard).not.toBeNull();
    expect(newBoard.grid[0][0]).toBe(ship);
    expect(newBoard.grid[1][0]).toBe(ship);
    expect(newBoard.grid[2][0]).toBe(ship);
    expect(board.grid[0][0]).toBeNull();
  });

  it('should place a ship horizontally', () => {
    const ship = createShip('Test', 3);
    const newBoard = placeShip(board, ship, 0, 0, false);
    expect(newBoard).not.toBeNull();
    expect(newBoard.grid[0][0]).toBe(ship);
    expect(newBoard.grid[0][1]).toBe(ship);
    expect(newBoard.grid[0][2]).toBe(ship);
  });

  it('should not allow placing out of bounds', () => {
    const ship = createShip('Test', 3);
    const result = placeShip(board, ship, 8, 0, false);
    expect(result).toBeNull();
  });

  it('should not allow overlapping ships', () => {
    const ship1 = createShip('Test1', 3);
    const boardWithShip = placeShip(board, ship1, 0, 0, false);
    
    const ship2 = createShip('Test2', 3);
    const result = placeShip(boardWithShip, ship2, 1, 0, true); 
    expect(result).toBeNull();
  });

  it('should receive a missed attack', () => {
    const { board: newBoard, result } = receiveAttack(board, 5, 5);
    expect(result.result).toBe('miss');
    expect(newBoard.missedAttacks).toContainEqual({x: 5, y: 5});
  });

  it('should receive a hit', () => {
    const ship = createShip('Test', 3);
    const boardWithShip = placeShip(board, ship, 2, 2, false);
    
    const { board: newBoard, result } = receiveAttack(boardWithShip, 2, 2);
    expect(result.result).toBe('hit');
    expect(result.ship.hits).toBe(1);
    expect(newBoard.successfulAttacks).toContainEqual({x: 2, y: 2});
  });
  
  it('should report sunk', () => {
      const ship = createShip('Test', 1);
      const boardWithShip = placeShip(board, ship, 0, 0, true);
      
      const { result } = receiveAttack(boardWithShip, 0, 0);
      expect(result.result).toBe('hit');
      expect(result.sunk).toBe(true);
  });

  it('should report all ships sunk', () => {
      const ship1 = createShip('Test', 1);
      const boardWithShip = placeShip(board, ship1, 0, 0, true);
      
      expect(areAllShipsSunk(boardWithShip)).toBe(false);
      const { board: finishedBoard } = receiveAttack(boardWithShip, 0, 0);
      expect(areAllShipsSunk(finishedBoard)).toBe(true);
  });

  describe('parseCoordinates', () => {
    it('should parse valid coordinates', () => {
        expect(parseCoordinates('A1')).toEqual({ x: 0, y: 0 });
        expect(parseCoordinates('J10')).toEqual({ x: 9, y: 9 });
        expect(parseCoordinates('B5')).toEqual({ x: 4, y: 1 });
    });

    it('should return null for invalid coordinates', () => {
        expect(parseCoordinates('K1')).toBeNull();
        expect(parseCoordinates('A11')).toBeNull();
        expect(parseCoordinates('Foo')).toBeNull();
    });
  });
});
