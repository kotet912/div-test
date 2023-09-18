<template>
    <div class="game">
        <div class="game__line">
            <div class="game__line__box">
                <div class="game__line__box__process" :style="{ width: gameProgress + '%' }">
                </div>
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
    },
};
</script>

<style src="./Game.less" lang="less" />
