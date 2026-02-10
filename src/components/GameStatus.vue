<script setup>
defineProps({
    logs: {
        type: Array,
        required: true
    },
    gameState: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['restart']);
</script>

<template>
    <div class="status-container">
        <div class="game-header">
            <h2>Status: <span :class="gameState">{{ gameState.toUpperCase() }}</span></h2>
            <button v-if="gameState === 'won'" @click="$emit('restart')" class="restart-btn">
                Play Again
            </button>
        </div>
        
        <div class="logs-window">
             <div v-for="(log, index) in logs" :key="index" class="log-entry">
                 > {{ log }}
             </div>
        </div>
    </div>
</template>

<style scoped>
.status-container {
    background: #1e293b;
    padding: 1.5rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
}

.game-header h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
}

.won {
    color: #4ade80;
}

.playing {
    color: #60a5fa;
}

.restart-btn {
    padding: 0.4rem 0.8rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.8rem;
}

.logs-window {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    height: 220px;
    overflow-y: auto;
    padding: 1rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.8rem;
    color: #94a3b8;
}

.log-entry {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #1e293b;
    display: flex;
    gap: 0.4rem;
}

.log-entry::before {
    content: ">";
    color: #60a5fa;
}
</style>
