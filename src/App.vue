<template>
  <iBikeMarathon class="app" />
</template>

<script lang="ts">
import iBikeMarathon from './components/iBikeMarathon.vue';

export default {
  name: 'App',
  components: {
    iBikeMarathon
  }
}
</script>

<style lang="scss">
$body-bg: #eee;
$body-color: #333;
$theme-colors: (
  "primary": green,
  "danger": coral
);

@import "../node_modules/bootstrap/scss/bootstrap";
@import "../node_modules/bootstrap-vue/dist/bootstrap-vue.css";
</style>

<style lang="stylus" scoped>
.app::before
  opacity 0.1
  position absolute
  top 0
  left 0
  bottom 0
  right 0
  content ''
  background-size cover
  background-image url('https://cdntwrunning.biji.co/808_8c986234a8d2afb0a32bf18b08556a179b8619251a19057cff70779273e95aa6.jpg')

.app >>>
  .spinner-border
    color red

  caption
    font-size 0.8em
    color #e66a2c

  tbody
    cursor pointer
</style>