<template>
    <div class="game__box__threshold-points">
        <span v-if="index + 1 === currentIndex + 1" :style="thresholdPointsStyle">
            {{ totalPoints }} / {{ thresholdPoints }}
        </span>
        <span v-else :style="thresholdPointsStyle">
            {{ thresholdPoints }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        index: Number,
        currentIndex: Number,
        totalPoints: Number,
        stage: Object,
        thresholdPoints: Object,
        thresholdPointsStyle: Object,
    },

};
</script>