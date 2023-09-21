<template>
    <img :src="starImageSrc" :class="starClasses" :style="starStyle" alt="" />
</template>

<script>
export default {
     name: 'DivTestStar',
    props: {
        totalPoints: Number,
        thresholdPoints: Number,
        currentIndex: Number,
        index: Number,
        stageWidth: Number,
    },
    computed: {
        starImageSrc () {
            return this.totalPoints >= this.thresholdPoints
                ? require('@/assets/Star.svg')
                : require('@/assets/StarContr.svg');
        },
        starClasses () {
            return [
                this.totalPoints >= this.thresholdPoints
                    ? 'game__box__stages__threshold__star-image'
                    : 'game__box__stages__threshold__star-contrast-image',
                this.index + 1 === this.currentIndex + 1
                    ? 'game__box__stages__threshold__large-star'
                    : '',
            ];
        },
        starStyle () {
            const marginLeft =
                this.index === 0
                    ? `${this.stageWidth - this.stageWidth / 30}%`
                    : this.index === this.stages.length - 1
                        ? `${this.stageWidth - this.stageWidth / 3}%`
                        : this.index + 1 === this.currentIndex + 1
                            ? `${this.stageWidth - this.stageWidth / 16}%`
                            : `${this.stageWidth - this.stageWidth / 24}%`;

            return {
                left: `${this.index * this.stageWidth}%`,
                marginLeft,
            };
        },
    },
};
</script>
