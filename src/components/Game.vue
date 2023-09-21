<template>
    <div class="game">
        <div class="game__box">
            <div class="game__box__stages__threshold" v-for="(stage, index) in stages" :key="stage.id">
                <Star v-if="shouldShowStar(index)" :starImage="getStarImage(stage.thresholdPoints)"
                    :starClasses="getStarClasses(index)" :starStyle="getStarStyle(index)" />
            </div>
            <img class="game__box__stages__threshold__cup" src="../assets/cup.svg" alt="">
        </div>
        <div class="game__line">
            <div class="game__line__process" :style="{ width: gameProgress + '%' }"></div>
            <VerticalLine class="game__line__process__vertical-line" v-for="(stage, index) in stages" :key="stage.id"
                :verticalLineStyle="getVerticalLineStyle(index)" />
        </div>
        <div class="game__box">
            <span>0</span>
            <ThresholdPoints v-for="(stage, index) in stages" :key="stage.id" :index="index" :currentIndex="currentIndex"
                :thresholdPointsStyle="getThresholdPointsStyle(index)" :totalPoints="totalPoints"
                :thresholdPoints="stage.thresholdPoints" :stage="stage" />
        </div>
    </div>
</template>

<script>
import Star from './Star.vue';
import VerticalLine from './VerticalLine.vue';
import ThresholdPoints from './ThresholdPoints.vue';

export default {
    name: 'DivTestGame',
    components: {
        Star,
        VerticalLine,
        ThresholdPoints,
    },
    data () {
        return {
            currentIndex: 0,
        };
    },
    computed: {
        // Возвращает массив этапов из хранилища Vuex
        stages () {
            return this.$store.state.stages;
        },
        // Вычисляет общее количество очков, суммируя лучший результат каждой игры во всех этапах
        totalPoints () {
            return this.$store.state.stages.reduce((sum, stage) => {
                return sum + stage.games.reduce((stageSum, game) => stageSum + game.bestResult, 0);
            }, 0);
        },
        // Возвращает общее количество этапов
        stageCount () {
            return this.stages.length;
        },
        // Вычисляет ширину каждого этапа на основе общего количества этапов
        stageWidth () {
            // Если нет этапов, ширина равна 0
            return this.stageCount === 0 ? 0 : 100 / this.stageCount;
        },
        // Вычисляет прогресс игры в процентах на основе текущего количества очков
        gameProgress () {
            if (this.stageCount === 0) {
                return 0;
            }
            // Найдем индекс текущего этапа, который не пройден
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.currentIndex = this.stages.findIndex((stage) => this.totalPoints < stage.thresholdPoints);
            if (this.currentIndex === -1) {
                return 100; // Если все этапы пройдены, процент равен 100%
            }
            const currentStage = this.stages[this.currentIndex];
            const prevStage = this.stages[this.currentIndex - 1] || { thresholdPoints: 0 }; // Обработка первого этапа
            // Рассчитываем прогресс в текущем этапе на основе количества очков
            const progressInCurrentStage = (this.totalPoints - prevStage.thresholdPoints) /
                (currentStage.thresholdPoints - prevStage.thresholdPoints);
            // Ограничиваем прогресс до 100%
            return Math.min((this.currentIndex * this.stageWidth) + (progressInCurrentStage * this.stageWidth), 100);
        },
    },
    methods: {
        // Получает классы для изображения звезды в зависимости от условий
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

        // Общие стили элементов
        getCommonStyle (index) {
            return {
                left: (index * this.stageWidth) + '%'
            };
        },

        // Стили для изображения звезды
        getStarStyle (index) {
            return {
                ...this.getCommonStyle(index),
                marginLeft: this.getStarMarginLeft(index)
            };
        },

        // Стили для вертикальных линий
        getVerticalLineStyle (index) {
            return {
                ...this.getCommonStyle(index),
                display: index === 0 ? 'none' : ''
            };
        },

        // Стили для текста с баллами
        getThresholdPointsStyle (index) {
            const commonStyle = {
                ...this.getCommonStyle(index),
                marginLeft: index === 0 ? this.stageWidth + '%' : ''
            };

            // Проверяем, если этот этап текущий (совпадает с currentIndex)
            if (index + 1 === this.currentIndex + 1) {
                commonStyle.marginLeft = this.stageWidth + '%'; // Устанавливаем отступ, если текущий этап
                if (index === this.stages.length - 1) {
                    commonStyle.marginLeft = this.stageWidth - (this.stageWidth / 3) + '%'; // Если последний этап
                } else {
                    commonStyle.marginLeft = this.stageWidth - (this.stageWidth / 7) + '%'; // Если не последний этап
                }
            } else {
                // Если этап не текущий, устанавливаем разные отступы в зависимости от индекса
                commonStyle.marginLeft = index === 0 ? this.stageWidth - (this.stageWidth / 30) + '%' : (index === this.stages.length - 1 ? this.stageWidth - (this.stageWidth / 3) + '%' : this.stageWidth - (this.stageWidth / 15) + '%');
            }
            return commonStyle;
        },

        // Проверяет, нужно ли показывать звезду
        shouldShowStar (index) {
            return index < this.stages.length - 1;
        },

        // Получает изображение звезды в зависимости от условий
        getStarImage (thresholdPoints) {
            // Проверяем, была ли хотя бы одна игра с установленным флагом isPlayed
            const hasPlayedGameInAnyStage = this.stages.some(stage => {
                return stage.games && stage.games.some(game => game.isPlayed);
            });

            // В зависимости от условий возвращаем соответствующее изображение
            return hasPlayedGameInAnyStage && this.totalPoints >= thresholdPoints
                ? require('@/assets/Star.svg') // Горящая звезда
                : require('@/assets/StarContr.svg'); // Звезда без подсветки
        },

        // Получает отступ для звезды в зависимости от условий
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
    },
};
</script>

<style src="./Game.less" lang="less" />
