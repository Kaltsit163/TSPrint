<template>
<section class="recommend-wrapper">
  <ul class="recommend">
    <li class="recommend-item"
        v-for="(recommend, index) in recommends"
        :key="index"
        v-lazy:background-image="recommend.image" 
        @click="jumpRecommend(recommend)">
    </li>
  </ul>
</section>
</template>
<script>
export default {
  props: {
    recommends: {
      type: Array
    }
  },
  methods: {
    jumpRecommend (recommend) {
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../scss/mixin.scss';
.recommend-wrapper{
  padding: 20px 0;
}
.recommend{
  position: relative;
  width: 680px;
  height: 330px;
  margin: 0 auto;
  overflow: hidden;
}
.recommend-item{
  background-size: cover;
  background-position: center;
}
.recommend-item[lazy=loaded] {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}
.recommend-item:nth-child(1){
  position: absolute;
  width: 364px;
  height: 330px;
  top: 0;
  left: 0;
  border-radius: 10px;
  overflow: hidden;
}
.recommend-item:nth-child(2) {
  position: absolute;
  left: 376px;
  top: 0;
  height: 159px;
  width: 304px;
  border-radius: 10px;
  overflow: hidden;
}
.recommend-item:nth-child(3) {
  position: absolute;
  left: 376px;
  top: 171px;
  height: 159px;
  width: 304px;
  border-radius: 10px;
  overflow: hidden;
}
</style>
