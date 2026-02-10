import { ref } from 'vue';
import { useBoard } from './useBoard';
import { createShip } from '../domain/Ship';
import { areAllShipsSunk, parseCoordinates } from '../domain/Board';

export function useGame() {
    const playerBoard = useBoard();
    const computerBoard = useBoard();
    
    const gameState = ref('setup'); // 'setup', 'playing', 'won', 'lost'
    const turn = ref('player'); // 'player', 'computer'
    const logs = ref([]);
    
    const addLog = (msg) => logs.value.unshift(msg);

    const startNewGame = () => {
        playerBoard.resetBoard();
        computerBoard.resetBoard();

        setupBoards();
        gameState.value = 'playing';
        turn.value = 'player';
        logs.value = [];
        addLog('Game Started! Enter coordinates or click on the enemy grid to fire.');
    };

    const setupBoards = () => {
        const playerShips = [
            createShip('Battleship', 5), 
            createShip('Destroyer 1', 4), 
            createShip('Destroyer 2', 4)
        ];
        playerBoard.placeShipsRandomly(playerShips);

        const computerShips = [
            createShip('Battleship', 5), 
            createShip('Destroyer 1', 4), 
            createShip('Destroyer 2', 4)
        ];
        computerBoard.placeShipsRandomly(computerShips);
    };

    const playerFire = (x, y) => {
        if (gameState.value !== 'playing' || turn.value !== 'player') return;

        const status = computerBoard.getCellStatus(x, y);
        if (status !== 'ship' && status !== 'empty') {
            addLog(`Already fired at ${String.fromCharCode(65+y)}${x+1}!`);
            return;
        }

        const result = computerBoard.receiveAttack(x, y);
        let msg = `You fired at ${String.fromCharCode(65+y)}${x+1}: ${result.result.toUpperCase()}`;
        
        if (result.sunk) {
            msg += ` - You sunk my ${result.ship.name}!`;
        }
        addLog(msg);

        if (areAllShipsSunk(computerBoard.board.value)) {
            gameState.value = 'won';
            addLog('YOU WON! All enemy ships sunk.');
            return;
        }

        turn.value = 'computer';
        setTimeout(computerTurn, 800);
    };

    const computerTurn = () => {
        if (gameState.value !== 'playing') return;

        let x, y;
        let valid = false;
        while (!valid) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            const status = playerBoard.getCellStatus(x, y);
            if (status === 'ship' || status === 'empty') {
                valid = true;
            }
        }

        const result = playerBoard.receiveAttack(x, y);
        let msg = `Computer fired at ${String.fromCharCode(65+y)}${x+1}: ${result.result.toUpperCase()}`;
        
        if (result.sunk) {
            msg += ` - Your ${result.ship.name} was sunk!`;
        }
        addLog(msg);

        if (areAllShipsSunk(playerBoard.board.value)) {
            gameState.value = 'lost';
            addLog('GAME OVER! The computer sunk all your ships.');
            return;
        }

        turn.value = 'player';
    };

    const processCommand = (command) => {
        const coords = parseCoordinates(command);
        if (!coords) {
            addLog(`Invalid command: "${command}". Use format like "A5".`);
            return;
        }
        playerFire(coords.x, coords.y);
    };

    return {
        gameState,
        turn,
        logs,
        playerBoard,
        computerBoard,
        startNewGame,
        playerFire,
        processCommand
    };
}
