<template>
    <div class="game">
        <div class="game__line">
            <div class="game__line__process" :style="{ width: gameProgress + '%' }"></div>
        </div>

        <div class="game__box">
            <span>0</span>
            <div class="game__box__threshold-points" v-for="stage in stages" :key="stage.id">
                <img :src="totalPoints >= stage.thresholdPoints ? require('@/assets/Star.svg') : require('@/assets/StarContr.svg')"
                    alt="">
                <span v-if="totalPoints < stage.thresholdPoints">
                    {{ totalPoints }} / {{ stage.thresholdPoints }}
                </span>
                <span v-else>
                    {{ stage.thresholdPoints }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DivTestGame',
    computed: {
        stages () {
            return this.$store.state.stages;
        },
        totalPoints () {
            return this.$store.state.stages.reduce((sum, stage) => {
                return sum + stage.games.reduce((stageSum, game) => stageSum + game.bestResult, 0);
            }, 0);
        },
        gameProgress () {
            const stageCount = this.stages.length;
            if (stageCount === 0) {
                return 0; // Избегаем деления на ноль
            }

            // Рассчитываем ширину каждого этапа в процентах
            const stageWidth = 100 / stageCount;

            // Найдем индекс текущего этапа, который не пройден
            let currentIndex = -1;
            for (let i = 0; i < stageCount; i++) {
                if (this.totalPoints < this.stages[i].thresholdPoints) {
                    currentIndex = i;
                    break;
                }
            }

            if (currentIndex === -1) {
                return 100; // Если все этапы пройдены, процент равен 100%
            }

            if (currentIndex === 0) {
                // Если текущий этап первый, используем общее количество очков
                return (this.totalPoints / this.stages[currentIndex].thresholdPoints) * stageWidth;
            } else {
                // Рассчитываем текущую ширину процесс-бара на основе индекса текущего этапа
                const currentWidth = (currentIndex * stageWidth) + ((this.totalPoints - this.stages[currentIndex - 1].thresholdPoints) / (this.stages[currentIndex].thresholdPoints - this.stages[currentIndex - 1].thresholdPoints)) * stageWidth;

                return Math.min(currentWidth, 100);
            }
        },
    },
};
</script>

<style src="./Game.less" lang="less" />
