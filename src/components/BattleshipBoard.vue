<script setup>
const props = defineProps({
  boardState: {
    type: Object,
    required: true
  },
  isPlayer: {
      type: Boolean,
      default: false
  },
  canFire: {
      type: Boolean,
      default: false
  }
});

const emit = defineEmits(['cell-click']);

// We rely on the `useBoard` helper `getCellStatus` which returns:
// 'empty', 'ship', 'miss', 'hit', 'sunk'
// However, for the UI, we might just pass raw data and logic here OR rely on pre-computed grid.
// But `useBoard` provides convenient accessors.
// Let's assume `boardState` is the object returned by `useBoard()`.

const getCellClass = (x, y) => {
    const status = props.boardState.getCellStatus(x, y);
    
    if (status === 'miss') return 'miss';
    if (status === 'hit') return 'hit';
    if (status === 'sunk') return 'sunk';
    if (status === 'ship' && props.isPlayer) return 'ship';
    
    // For computer, 'ship' looks like 'empty' (hidden)
    return 'empty';
};

const handleCellClick = (x, y) => {
    if (props.canFire) {
        emit('cell-click', { x, y });
    }
};
</script>

<template>
  <div class="board-container" :class="{ 'active-target': canFire }">
    <!-- Header row with numbers -->
    <div class="column-labels">
        <div class="label-spacer"></div>
        <div v-for="x in 10" :key="'col-label-'+x" class="col-label">
            {{ x }}
        </div>
    </div>
    
    <!-- Grid rows with letters -->
    <div class="grid-row" v-for="y in 10" :key="'row-'+(y-1)">
        <div class="row-label">{{ String.fromCharCode(64 + y) }}</div>
        <div v-for="x in 10" :key="'cell-'+(x-1)+'-'+(y-1)" 
            class="cell" 
            :class="getCellClass(x-1, y-1)"
            @click="handleCellClick(x-1, y-1)"
        >
        </div>
    </div>
  </div>
</template>

<style scoped>
.board-container {
    display: inline-flex;
    flex-direction: column;
    padding: 1.25rem;
    background: #1e293b;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    border: 2px solid transparent;
    transition: all 0.3s ease;
    user-select: none;
    box-sizing: border-box;
}

.board-container * {
    box-sizing: border-box;
}

.active-target {
    border-color: #ef4444;
    cursor: crosshair;
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
}

.column-labels {
    display: flex;
    gap: 2px;
    margin-bottom: 4px;
}

.label-spacer {
    width: 24px;
}

.col-label {
    width: 28px;
    text-align: center;
    color: #475569;
    font-weight: 800;
    font-size: 0.7rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.grid-row {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 2px;
}

.row-label {
    width: 24px;
    text-align: center;
    color: #475569;
    font-weight: 800;
    font-size: 0.7rem;
}

.cell {
  width: 28px;
  height: 28px;
  background: #0f172a;
  border: 1px solid #1e293b;
  transition: all 0.1s ease;
  position: relative;
}

.active-target .cell:hover {
    background: #1e293b;
}

.cell.miss {
    background: #334155;
}

.cell.miss::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: #94a3b8;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.cell.hit {
    background: #ef4444;
    box-shadow: inset 0 0 10px #7f1d1d;
}

.cell.sunk {
    background: #7f1d1d;
    border-color: #ef4444;
}

.cell.sunk::after {
    content: '✖';
    color: rgba(255, 255, 255, 0.4);
    font-size: 16px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.cell.ship {
    background: #3b82f6;
    box-shadow: inset 0 0 5px #1e40af;
    border-color: #60a5fa;
}
</style>
