<template>
  <transition name="fade">
  <div class="shell-cover" v-show="showShell" :style="{zIndex: zIndex}"
       @click="slideDownShell">
    <div class="shell-content" :style="{maxHeight: shellContH + 'px'}" @click.stop>
      <slot></slot>
    </div>
  </div>
  </transition>
</template>
<script>
export default {
  data () {
    return {
      showShell: false
    }
  },
  props: {
    shellContH: {
      type: Number
    },
    zIndex: {
      type: Number,
      default: 1000
    }
  },
  methods: {
    slideUpShell () {
      this.showShell = true
    },
    slideDownShell () {
      this.showShell = false
      this.$emit('slideDownShell')
    }
  }
}

</script>
<style lang="scss" scoped>
.shell-cover{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
}
.shell-content{
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  background-color: #fff;
  overflow: auto;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
  .shell-content {
    transform: translate(0, 100%);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
  .shell-content {
    transition: transform .3s ease;
  }
}
</style>
