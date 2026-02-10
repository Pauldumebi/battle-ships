<script setup>
import { ref } from 'vue';

const props = defineProps({
    disabled: Boolean
});

const emit = defineEmits(['command']);
const input = ref('');

const handleSubmit = () => {
    if (input.value.trim() && !props.disabled) {
        emit('command', input.value.trim());
        input.value = '';
    }
};
</script>

<template>
  <div class="command-input">
    <input 
        v-model="input" 
        type="text" 
        placeholder="Enter coordinates (e.g. A5)" 
        @keyup.enter="handleSubmit"
        :disabled="disabled"
    />
    <button @click="handleSubmit" :disabled="disabled || !input.trim()">
        FIRE
    </button>
  </div>
</template>

<style scoped>
.command-input {
    display: flex;
    gap: 1rem;
    width: 100%;
}

input {
    flex: 1;
    padding: 1rem;
    background: #0f172a;
    border: 2px solid #1e293b;
    border-radius: 8px;
    color: white;
    font-family: inherit;
    text-transform: uppercase;
    font-size: 1rem;
    transition: border-color 0.2s;
}

input:focus {
    outline: none;
    border-color: #3b82f6;
}

button {
    padding: 0 2.5rem;
    background: #a84444; /* Darker red matching mockup */
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 800;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.2s;
}

button:hover:not(:disabled) {
    background: #ef4444;
    transform: translateY(-2px);
}

button:active:not(:disabled) {
    transform: translateY(0);
}

button:disabled {
    opacity: 0.5;
    background: #334155;
    cursor: not-allowed;
}
</style>
