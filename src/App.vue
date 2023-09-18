<template>
  <Game />
</template>

<script>
import Game from './components/Game.vue';
export default {
  name: 'App',
  components: {
    Game
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
