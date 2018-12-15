<template>
  <div id="app">
    <div class="GameScreen">
      <canvas width="512" height="448" ref="canvas" class="canvas">A drawing of something.</canvas>
    </div>
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
    background-color: #666600;
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

  .GameScreen {
    position: absolute;
    overflow: hidden;
    width: 512px;
    height: 448px;
    left: 50%;
    margin-left: -256px;
    top: 50%;
    margin-top: -224px;
    border: #630 double 4px;
    background: #000;
  }

</style>
