<template>
  <section class="web-components com-footer">
    <section v-for="(item, index) in modules" :key="index"
             class="icon-items" :class="{'actived': activeModuleId === item.id}"
             @click="moduleTap(item, index)">
    <section class="icon">
        <img :src="item.id === activeModuleId ? item.image: item.imageDeactive"/>
        <p>{{item.title}}</p>
        <span v-if="item.id === 'cart' && showCartDot" class="m-dot"></span>
      </section>
    </section>
  </section>
</template>
<script lang="js">
/*
  Author: xiaolin@in66.com
  Data: 2018/08/14
  Props: {
    modules: [{item}] / Array
    activeModuleId: 'home' / String
    activeCartDot: true / Boolean
  },
  Desc: {
    modules 中 item 为可枚举属性
    {
      id: "home/my-coupon/cart/my-order", 当前组件引用的 view 的 id，对应activeModuleId 来激活 module
      image: "", 非激活(红色)状态下，图片的 URI
      imageDeactive: "", 激活(红色)状态下，图片的 URI
      title: "", 显示标题
      url: "", 跳转 URL, 有可能为标准 HTTP URI, 也有可能为 SPA LINK
    }
  }
*/
export default {
  props: {
    modules: {
      type: Array,
      default () {
        return []
      }
    },
    activeModuleId: {
      type: String,
      default: ''
    },
    showCartDot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    transPath (id) {},
    moduleTap (item, index) {
      this.$router.push({ path: 'shopCart' })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../scss/mixin.scss';
  .com-footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 120px;
    @include flex-warrper();
    background-color: #fff;
    -webkit-box-shadow:0px 7px 16px 0 rgba(0, 0, 0, .5);
    -moz-box-shadow:0px 7px 16px 0 rgba(0, 0, 0, .5);
    box-shadow:0px 7px 16px 0 rgba(0, 0, 0, .5);
    justify-content: center;
    align-items: center;
    color: #B0B0B0;
    z-index: 999;
  }
  .actived {
    color: #FF5E51;
  }
  .icon-items {
    position: relative;
    @include flex-item(1);
    text-align: center;
    font-size: 24px;
    img{
      display: block;
      width: 44px;
      margin: 0 auto;
      margin-bottom: 4px;
    }
  }
  .m-dot {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    position: absolute;
    top: 1%;
    right: 37%;
    background: #FF5E51;
  }
</style>
