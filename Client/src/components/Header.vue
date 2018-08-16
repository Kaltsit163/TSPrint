<template>
  <section class="web-components com-header" :style="styleObj">
    <section class="title">{{headInfo.title}}</section>
    <!--左侧按钮-->
    <span class="btn-left i-font" @click="onLeftClick">&#xe60a;</span>
    <!--右侧按钮-->
    <span v-if="headInfo.rightBtn"
          class="btn-right"
          :style="headInfo.rightBtn.style"
          @click="onRightClick">{{headInfo.rightBtn.text}}</span>
  </section>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    /**
     * eg:
     * headInfo: {
     *    title: '请选择12张照片',
     *    leftBtn: {
     *      click: () => {}
     *    },
     *    rightBtn: {
     *      text: '',
     *      style: { 'width':'10px', 'height':'10px', 'background-image': 'url(xx.png)' },
     *      click: () => {}
     *    }
     *  }
     */
    headInfo: {
      type: Object,
      default () {
        return {
          title: '',
          height: 56,
          leftBtn: null,
          rightBtn: null
        }
      }
    }
  },
  methods: {
    goback () {
      if (history.length > 1) {
        history.back()
      }
    },
    onLeftClick () {
      if (this.headInfo.leftBtn && this.headInfo.leftBtn.click) {
        this.headInfo.leftBtn.click()
      } else {
        this.goback()
      }
    },
    onRightClick () {
      let hrb = this.headInfo.rightBtn
      hrb && hrb.click && hrb.click()
    }
  },
  computed: {
    styleObj () {
      return {
        height: this.headInfo.height + 'px',
        lineHeight: this.headInfo.height + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .com-header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 56px; /*no*/
    background: #FFF;
    text-align: center;
    font-size: 18px; /*no*/
    line-height: 56px; /*no*/
    z-index: 999;
    border-bottom: 1px solid #ECECEC; /*no*/
  }
  .btn-left {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    left: percentage(15/375);
    color: #888;
    font-size: 20px; /*no*/
  }
  .btn-right {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    right: percentage(15/375);
    color: #333;
    font-size: 16px; /*no*/
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
  }
</style>
