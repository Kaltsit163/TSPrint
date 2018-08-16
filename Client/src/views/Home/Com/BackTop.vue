<template>
  <div v-show="showGoTop" class="back-top" @click="goTopBack"></div>
</template>
<script>
export default {
  props: {
    showGoTop: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goTopBack () {
      this.$emit('goTopBack')
    }
  }
}
</script>
<style lang="scss" scoped>
  .back-top{
    position: fixed;
    width: 120px;
    height: 120px;
    bottom: 136px;
    right: 20px;
    background-image: url("https://inimg01.jiuyan.info/in/2017/12/27/30e85d4c-25e1-4165-9b0e-c5b1c8cc4d45");
    background-size: contain;
    z-index: 100;
  }
</style>
