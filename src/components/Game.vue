<template>
    <div class="game">
        <div class="game__box__stages">
            <div />
            <div class="game__box__stages__threshold" v-for="(stage, index) in stages" :key="stage.id">
                <img v-if="index < stages.length - 1"
                    :src="totalPoints >= stage.thresholdPoints ? require('@/assets/Star.svg') : require('@/assets/StarContr.svg')"
                    :class="[
                        totalPoints >= stage.thresholdPoints ? 'game__box__stages__threshold__star-image' : 'game__box__stages__threshold__star-contrast-image',
                        index + 1 === currentIndex + 1 ? 'game__box__stages__threshold__large-star' : ''
                    ]" :style="{
    left: (index * stageWidth) + '%',
    marginLeft: index === 0 ? stageWidth + '%' : stageWidth + '%' // Расстояние между звездами
}" alt="" />
            </div>
            <img class="game__box__stages__threshold__cup" src="../assets/cup.svg" alt="">
        </div>

        <div class="game__line">
            <div class="game__line__process" :style="{ width: gameProgress + '%' }">
            </div>
            <!-- <span class="game__line__process__vertical-line" v-for="(stage) in stages" :key="stage.id"></span> -->
        </div>

        <div class="game__box">
            <span>0</span>
            <div class="game__box__threshold-points" v-for="(stage, index) in stages" :key="stage.id">
                <span v-if="totalPoints < stage.thresholdPoints" :style="{
                    left: (index * stageWidth) + '%',
                    marginLeft: index === 0 ? stageWidth - (stageWidth / 30) + '%' : (index === stages.length - 1 ? stageWidth - (stageWidth / 3) + '%' : stageWidth - (stageWidth / 15) + '%')
                }">
                    {{ totalPoints }} / {{ stage.thresholdPoints }}
                </span>
                <span v-else :style="{
                    left: (index * stageWidth) + '%',
                    marginLeft: index === 0 ? stageWidth - (stageWidth / 30) + '%' : (index === stages.length - 1 ? stageWidth - (stageWidth / 3) + '%' : stageWidth - (stageWidth / 15) + '%')
                }">
                    {{ stage.thresholdPoints }}
                </span>
            </div>
        </div>
        <button @click="updateBestResults">Данные</button>
    </div>
</template>

<script>
export default {
    name: 'DivTestGame',
    data () {
        return {
            currentIndex: -1,
        };
    },
    computed: {
        stages () {
            return this.$store.state.stages;
        },
        totalPoints () {
            return this.$store.state.stages.reduce((sum, stage) => {
                return sum + stage.games.reduce((stageSum, game) => stageSum + game.bestResult, 0);
            }, 0);
        },
        stageCount () {
            return this.stages.length;
        },
        stageWidth () {
            if (this.stageCount === 0) {
                return 0;
            }
            return 100 / this.stageCount;
        },
        gameProgress () {
            if (this.stageCount === 0) {
                return 0;
            }

            // Найдем индекс текущего этапа, который не пройден
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.currentIndex = -1; // Обновляем значение currentIndex
            for (let i = 0; i < this.stageCount; i++) {
                if (this.totalPoints < this.stages[i].thresholdPoints) {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.currentIndex = i;
                    break;
                }
            }

            if (this.currentIndex === -1) {
                return 100; // Если все этапы пройдены, процент равен 100%
            }

            if (this.currentIndex === 0) {
                // Если текущий этап первый, используем общее количество очков
                return (this.totalPoints / this.stages[this.currentIndex].thresholdPoints) * this.stageWidth;
            } else {
                // Рассчитываем текущую ширину процесс-бара на основе индекса текущего этапа
                const currentWidth = (this.currentIndex * this.stageWidth) + ((this.totalPoints - this.stages[this.currentIndex - 1].thresholdPoints) / (this.stages[this.currentIndex].thresholdPoints - this.stages[this.currentIndex - 1].thresholdPoints)) * this.stageWidth;

                return Math.min(currentWidth, 100);
            }
        },
    },
    methods: {
        updateBestResults () {
            this.stages.forEach((stage) => {
                // Генерируем случайное число от 0 до thresholdPoints для этапа
                const randomBestResult = Math.floor(Math.random() * (150 + 1));
                stage.games.forEach((game) => {
                    // Ограничиваем значение bestResult максимумом thresholdPoints этапа
                    game.bestResult = Math.min(randomBestResult, stage.thresholdPoints);
                });
            });
        },
    },
};
</script>

<style src="./Game.less" lang="less" />
