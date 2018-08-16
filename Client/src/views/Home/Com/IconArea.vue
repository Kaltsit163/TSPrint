<template>
  <ul class="icons" id="jsIcon" v-if="buttons.length">
    <li class="icon-item"
        v-for="(iconItem, index) in buttons"
        :key="index"
        @click="jumpFromIcon(iconItem)">
      <div class="icon">
        <img v-lazy="iconItem.image" @load="iconLoaded"/>
      </div>
      <div>{{iconItem.title}}</div>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    buttons: {
      type: Array
    }
  },
  methods: {
    jumpFromIcon (item) {
    },
    iconLoaded () {
      this.$emit('iconLoaded')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../scss/mixin.scss';
.icons{
  @include flex-warrper();
  margin-top: 40px;
  margin-bottom: 20px;
  color: #666666;
  font-size: 24px;
}
.icon-item {
  @include flex-item(1);
  text-align: center;
  font-size: 24px;
  img {
    display: block;
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }
  .icon{
    margin-bottom: 20px;
  }
}
</style>
