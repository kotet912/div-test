import { createStore } from 'vuex';

export default createStore({
    state: {
        "stages": [
            {
                "name": "Этап первый",
                "id": 1,
                "thresholdPoints": 25,
                "games": [
                    {
                        "name": "Игра 1.1",
                        "bestResult": 10,
                        "isPlayed": false
                    }
                ]
            },
            {
                "name": "Этап второй",
                "id": 2,
                "thresholdPoints": 50,
                "games": [
                    {
                        "name": "Игра 2.1",
                        "bestResult": 10,
                        "isPlayed": false
                    }
                ]
            },
        ]
    },
    mutations: {
        updateTotalPoints (state, stageId) {
            const stage = state.stages.find((s) => s.id === stageId);
            if (stage) {
                stage.totalPoints = stage.games.reduce((sum, game) => sum + game.bestResult, 0);
            }
        },
    },
    actions: {
        updateTotalPoints ({ commit }, stageId) {
            commit('updateTotalPoints', stageId);
        },
    },
    getters: {
    },
})
