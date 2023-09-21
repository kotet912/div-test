<template>
    <img :src="starImage" :class="starClasses" :style="starStyle" alt="" />
</template>

<script>
export default {
    name: 'DivTestStar',
    props: {
        starImage: String,
        starClasses: Array,
        starStyle: Object
    }
};
</script>
