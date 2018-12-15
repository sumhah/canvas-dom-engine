<template>
  <div id="app">
    <canvas width="1000" height="600" ref="canvas" class="canvas">A drawing of something.</canvas>
  </div>
</template>

<script>
    /* eslint-disable */
    import App from './js/App';
    export default {
        name: 'app',
        mounted() {
            App.init(this.$refs.canvas);
        }
    }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  html, body {
    padding: 0;
    margin: 0;
  }

  img {
    border: 0;
  }

  a {
    outline: none;
  }

  .canvas {
    background-color: #666;
  }

</style>
