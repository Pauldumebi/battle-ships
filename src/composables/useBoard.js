import { ref, computed } from 'vue';
import { createBoard, receiveAttack, placeShipsRandomly } from '../domain/Board';
import { isShipSunk } from '../domain/Ship';

export function useBoard() {
    const boardState = ref(createBoard());

    const applyReceiveAttack = (x, y) => {
        const { board, result } = receiveAttack(boardState.value, x, y);
        boardState.value = board;
        return result;
    };

    const applyPlaceShipsRandomly = (ships) => {
        boardState.value = placeShipsRandomly(boardState.value, ships);
    };

    const getCellStatus = (x, y) => {
        const board = boardState.value;
        const isMiss = board.missedAttacks.some(m => m.x === x && m.y === y);
        const isHit = board.successfulAttacks.some(h => h.x === x && h.y === y);
        const cellContent = board.grid[y][x];
        
        if (isHit) {
            return cellContent && isShipSunk(cellContent) ? 'sunk' : 'hit';
        }
        if (isMiss) return 'miss';
        if (cellContent) return 'ship'; 
        return 'empty';
    };

    const resetBoard = () => {
        boardState.value = createBoard();
    };

    return {
        board: computed(() => boardState.value),
        receiveAttack: applyReceiveAttack,
        placeShipsRandomly: applyPlaceShipsRandomly,
        getCellStatus,
        resetBoard,
        grid: computed(() => boardState.value.grid),
        ships: computed(() => boardState.value.ships),
        missedAttacks: computed(() => boardState.value.missedAttacks),
        successfulAttacks: computed(() => boardState.value.successfulAttacks),
        remainingShips: computed(() => boardState.value.ships.filter(s => !isShipSunk(s)).length)
    };
}
