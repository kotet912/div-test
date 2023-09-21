<template>
    <div class="game">
        <div class="game__box">
            <div class="game__box__stages__threshold" v-for="(stage, index) in stages" :key="stage.id">
                <img v-if="shouldShowStar(index)" :src="getStarImage(stage.thresholdPoints)" :class="getStarClasses(index)"
                    :style="getStarStyle(index)" alt="" />
            </div>
            <img class="game__box__stages__threshold__cup" src="../assets/cup.svg" alt="">
        </div>

        <div class="game__line">
            <div class="game__line__process" :style="{ width: gameProgress + '%' }"></div>
            <span class="game__line__process__vertical-line" v-for="(stage, index) in stages" :key="stage.id"
                :style="getVerticalLineStyle(index)"></span>
        </div>

        <div class="game__box">
            <span>0</span>
            <div class="game__box__threshold-points" v-for="(stage, index) in stages" :key="stage.id">
                <span v-if="index + 1 === currentIndex + 1" :style="getThresholdPointsStyle(index)">
                    {{ totalPoints }} / {{ stage.thresholdPoints }}
                </span>
                <span v-else :style="getThresholdPointsStyle(index)">
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
    components: {
    },
    data () {
        return {
            currentIndex: 0,
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
            return this.stageCount === 0 ? 0 : 100 / this.stageCount;
        },
        gameProgress () {
            if (this.stageCount === 0) {
                return 0;
            }

            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.currentIndex = this.stages.findIndex((stage) => this.totalPoints < stage.thresholdPoints);

            if (this.currentIndex === -1) {
                return 100;
            }

            const currentStage = this.stages[this.currentIndex];
            const prevStage = this.stages[this.currentIndex - 1] || { thresholdPoints: 0 };

            const progressInCurrentStage = (this.totalPoints - prevStage.thresholdPoints) /
                (currentStage.thresholdPoints - prevStage.thresholdPoints);

            return Math.min((this.currentIndex * this.stageWidth) + (progressInCurrentStage * this.stageWidth), 100);
        },
    },
    methods: {

        getStarClasses (index) {
            const classes = ['game__box__stages__threshold__star-image'];
            if (this.totalPoints < this.stages[index].thresholdPoints) {
                classes.push('game__box__stages__threshold__star-contrast-image');
            }
            if (index + 1 === this.currentIndex + 1) {
                classes.push('game__box__stages__threshold__large-star');
            }
            return classes;
        },
        getCommonStyle (index) {
            return {
                left: (index * this.stageWidth) + '%'
            };
        },

        getStarStyle (index) {
            return {
                ...this.getCommonStyle(index),
                marginLeft: this.getStarMarginLeft(index)
            };
        },
        getVerticalLineStyle (index) {
            return {
                ...this.getCommonStyle(index),
                display: index === 0 ? 'none' : ''
            };
        },

        getThresholdPointsStyle (index) {
            const commonStyle = {
                ...this.getCommonStyle(index),
                marginLeft: index === 0 ? this.stageWidth + '%' : ''
            };

            if (index + 1 === this.currentIndex + 1) {
                commonStyle.marginLeft = this.stageWidth + '%';
                if (index === this.stages.length - 1) {
                    commonStyle.marginLeft = this.stageWidth - (this.stageWidth / 3) + '%';
                } else {
                    commonStyle.marginLeft = this.stageWidth - (this.stageWidth / 7) + '%';
                }
            } else {
                commonStyle.marginLeft = index === 0 ? this.stageWidth - (this.stageWidth / 30) + '%' : (index === this.stages.length - 1 ? this.stageWidth - (this.stageWidth / 3) + '%' : this.stageWidth - (this.stageWidth / 15) + '%');
            }

            return commonStyle;
        },

        shouldShowStar (index) {
            return index < this.stages.length - 1;
        },

        getStarImage (thresholdPoints) {
            return this.totalPoints >= thresholdPoints
                ? require('@/assets/Star.svg')
                : require('@/assets/StarContr.svg');
        },

        getStarMarginLeft (index) {
            const baseMargin = this.stageWidth - (this.stageWidth / 30);

            if (index === 0) {
                if (index + 1 === this.currentIndex + 1) {
                    // Смещение для первой большой звезды
                    return `${baseMargin - (this.stageWidth / 40)}%`;
                } else {
                    // Смещение для первой обычной звезды
                    return `${baseMargin}%`;
                }
            } else if (index === this.stages.length - 1) {
                // Смещение для последней звезды
                return `${this.stageWidth - (this.stageWidth / 3)}%`;
            } else if (index + 1 === this.currentIndex + 1) {
                // Смещение для остальных больших звезд
                return `${this.stageWidth - (this.stageWidth / 15)}%`;
            } else {
                // Смещение для остальных обычных звезд
                return `${this.stageWidth - (this.stageWidth / 24)}%`;
            }
        },


        updateBestResults () {
            this.stages.forEach((stage) => {
                const randomBestResult = Math.floor(Math.random() * 151);
                stage.games = stage.games.map((game) => ({
                    ...game,
                    bestResult: Math.min(randomBestResult, stage.thresholdPoints),
                }));
            });
        },
    },
};
</script>

<style src="./Game.less" lang="less" />
