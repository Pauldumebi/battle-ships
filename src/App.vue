<script setup>
import { useGame } from './composables/useGame';
import BattleshipBoard from './components/BattleshipBoard.vue';
import GameStatus from './components/GameStatus.vue';
import CommandInput from './components/CommandInput.vue';

const { 
    gameState, 
    turn, 
    logs, 
    playerBoard, 
    computerBoard, 
    startNewGame, 
    playerFire,
    processCommand
} = useGame();

// Initialize game
startNewGame();

const handleEnemyGridClick = ({ x, y }) => {
    playerFire(x, y);
};

const handleCommand = (cmd) => {
    processCommand(cmd);
};
</script>

<template>
  <div class="app-container">
    <h1 class="title">BATTLESHIP</h1>
    
    <div class="game-area">
        <!-- Player Board (Left) -->
        <div class="board-column">
            <h2>YOUR FLEET</h2>
            <BattleshipBoard 
                :boardState="playerBoard" 
                :isPlayer="true"
                :canFire="false"
            />
        </div>

        <!-- Info & Controls (Center) -->
        <div class="center-panel">
            <div class="indicator-spacer"></div> <!-- Spacer to match H2 height of boards -->
            <div class="turn-indicator" :class="{ 'turn-cpu': turn === 'computer' }">
                <span v-if="gameState === 'playing'">
                    {{ turn === 'player' ? 'YOUR TURN' : 'ENEMY TURN' }}
                </span>
                <span v-else>
                    GAME OVER
                </span>
            </div>
            
            <GameStatus 
                :logs="logs" 
                :gameState="gameState" 
                @restart="startNewGame"
            />

            <CommandInput 
                :disabled="gameState !== 'playing' || turn !== 'player'"
                @command="handleCommand"
            />
        </div>

        <!-- Computer Board (Right) -->
        <div class="board-column">
            <h2>ENEMY WATERS</h2>
            <BattleshipBoard 
                :boardState="computerBoard" 
                :isPlayer="false"
                :canFire="gameState === 'playing' && turn === 'player'"
                @cell-click="handleEnemyGridClick"
            />
        </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}

.title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    margin-bottom: 2rem;
    letter-spacing: 0.5rem;
    background: linear-gradient(to right, #60a5fa, #ef4444);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 900;
}

.game-area {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    margin-top: 1rem;
}

.board-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0 0 auto;
}

.board-column h2 {
    color: #64748b;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    letter-spacing: 0.3rem;
    font-weight: 800;
    text-transform: uppercase;
}

.center-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    flex: 0 0 380px;
    min-width: 320px;
    margin-bottom: 2rem;
}

.indicator-spacer {
    height: 2.5rem;
}

.turn-indicator {
    background: #1e293b;
    padding: 1.5rem;
    text-align: center;
    border: 2px solid #334155;
    border-radius: 12px;
    color: white;
    font-weight: 900;
    font-size: 1.5rem;
    letter-spacing: 0.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
}

.turn-cpu {
    border-color: #ef4444;
    color: #ef4444;
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
}

@media (max-width: 1200px) {
    .indicator-spacer {
        display: none;
    }
    .center-panel {
        order: -1;
        width: 100%;
        max-width: 600px;
        flex: 1 1 100%;
    }
}
</style>
