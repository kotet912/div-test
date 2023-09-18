<template>
    <div class="game">
        <div class="game__line">
            <div class="game__line__process" :style="{ width: gameProgress + '%' }">
            </div>
        </div>

        <div class="game__box">
            <span>0</span>
            <div class="game__box__threshold-points" v-for="stage in stages" :key="stage.id">
                <span v-for="game in stage.games" :key="game.name">
                    {{ game.bestResult }} / {{ stage.thresholdPoints }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DivTestGame',
    computed: {
        gameProgress () {
            const totalPoints = this.$store.state.stages.reduce((sum, stage) => {
                return sum + stage.games.reduce((stageSum, game) => stageSum + game.bestResult, 0);
            }, 0);

            const totalThresholdPoints = this.$store.state.stages.reduce((sum, stage) => {
                return sum + stage.thresholdPoints;
            }, 0);

            const progress = (totalPoints / totalThresholdPoints) * 100;

            return Math.min(progress, 100);
        },
        stages () {
            return this.$store.state.stages;
        },
    },
};
</script>

<style src="./Game.less" lang="less" />
