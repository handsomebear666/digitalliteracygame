// src/composables/useGameController.js
export function useGameController() {
    const store = useGameStore();

    const startGame = () => { /* ... */ };
    const handleLevelCompleted = (level) => { /* ... */ };

    return { startGame, handleLevelCompleted };
}
