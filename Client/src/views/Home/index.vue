<template>
  <section>
    <div class="nav fake" v-show="showFakeToolBar" v-if="collections.length" id="jsTopNav" v-bind:style="{width: Wid + 'px'}">
        <ul>
          <li class="nav-item js-top-nav-item" 
          v-for="(item, index) in collections" 
          v-bind:data-id="item.id"
          v-bind:class="{choose: index === collectionSeq}"
          @click="changeType(index)"
          >
          <div>{{item.name}}</div>
          </li>
        </ul>
    </div>
    <div id="wrapper" class="wrapper" >

      <section class="inner js-inner" style="-webkit-transform: translate3d(0,0,0);">
        <Guest v-if="isGuest" :guestId="guestId"></Guest>
        <!-- Banner -->
        <Banner 
        :bannerInfo="banners" 
        v-if="banners.length" 
        id="jsBanner">
        </Banner>
        <!-- icon导航 -->
        <IconArea 
        :buttons="buttons"
        @iconLoaded="iconLoaded"
        class="js-icon"
        ></IconArea>
        <!-- 推荐区域 -->
        <Recommend 
        :recommends="recommends" 
        class="js-recommend" 
        v-if="recommends.length">
        </Recommend>
        <!-- 跑马灯组件 -->
        <Marquee 
          v-if="marquee.show"
          :content="marquee.content" 
          :delay="marquee.delay" 
          :speed="marquee.speed" 
          :top="0"
          :num="marquee.num" 
          :isFixed="marquee.isFixed" 
          :bgColor="marquee.bgColor" 
          :fontColor="marquee.fontColor" 
          :iconColor="marquee.iconColor" 
          @start="marqueeStart" 
          @delaying="marqueeDelay"
          class="js-marquee">
        </Marquee>
        <div id="jsProducts">
          <div class="nav js-nav" v-if="collections.length" id="jsNav" v-bind:style="{width: Wid + 'px'}">
            <ul>
              <li class="nav-item js-nav-item" 
                  v-for="(item, index) in collections" 
                  v-bind:data-id="item.id"
                  v-bind:key="item.id"
                  v-bind:class="{choose: index === collectionSeq}"
                  @click="changeType(index)"><div>{{item.name}}</div>
              </li>
            </ul>
          </div>
          <!-- 列表区域 -->
          <Products 
          :showFakeToolBar="showFakeToolBar"
          :collections="collections"
          :collectionSeq="collectionSeq"
          :products="products"
          @changeType="changeType"
          ></Products>
        </div>
      </section>
    </div>
    <BackTop @goTopBack="goTopBack" :showGoTop="showGoTop"></BackTop>
  </section>
</template>
<script>
import IconArea from './Com/IconArea'
import Recommend from './Com/Recommend'
import Products from './Com/Products'
import Footer from '@/components/Footer'
import Guest from './Com/Guest'
import Banner from './Com/Banner'
import Request from 'axios'
import BackTop from './Com/BackTop'
import $ from 'jquery'
import { mapState } from 'vuex'

/* global IScroll:true */

const API = {
  getResource: '/home/resources',
  getShelvesCollection: '/home/shelves/collections',
  getMarquee: '/marquee/homepage',
  getCouponData: '/activity/coupon/receive',
  getShelves: '/home/shelves'
}

let cidMaps = []
let cidDom = []
let ThresholdForBar = 0
const clientH = document.documentElement.clientHeight

export default {
  name: 'newHomepage',
  data () {
    return {
      scrollT: null,
      scrollNav: null,
      scrollTopNav: null,
      showFakeToolBar: false,
      barPositionY: 1000000,
      Wid: document.documentElement.clientWidth,
      marquee: {
        speed: 'simple',
        num: 3,
        show: false,
        delay: 3,
        content: '',
        isFixed: false,
        bgColor: '#F6F6F6',
        fontColor: '#B0B0B0',
        iconColor: '#FF5E51'
      },
      coupon: {
        show: false,
        data: {
          style: {},
          coupons: [],
          tips: [],
          button: {}
        }
      },
      footerConf: {
        modules: [],
        activeModuleId: 'home'
      },
      couponLogin: true,
      banners: [],
      buttons: [],
      recommends: [],
      collections: [],
      products: [],
      collectionSeq: 0,
      showGoTop: false,
      isGuest: false,
      guestId: ''
    }
  },
  created () {
    this.initRequestResources()
  },
  components: {
    IconArea,
    Recommend,
    Products,
    Footer,
    BackTop,
    Banner,
    Guest
  },
  methods: {
    iconLoaded () {
      this.initCompute()
    },
    initOrRefreshScroll () {
      let me = this
      var lastKnownScrollPosition = 0
      var ticking = false
      function doScrollCallback(scrollPos) {
        // do something with the scroll position
        if (me.barPositionY === 100000) {
          me.initCompute()
        }
        if (Math.abs(scrollPos) >= me.barPositionY) {
          me.showFakeToolBar = true
        } else {
          me.showFakeToolBar = false
        }
        if (cidMaps.length) {
          me.calculatePosition()
        }
        if (Math.abs(scrollPos) >= 2 * clientH) {
          me.showGoTop = true
        } else {
          me.showGoTop = false
        }
      }
      window.addEventListener('scroll', function(e) {
        lastKnownScrollPosition = window.scrollY
        if (!ticking) {
          window.requestAnimationFrame(function() {
            doScrollCallback(lastKnownScrollPosition)
            ticking = false
          })
        }
        ticking = true
      })
    },
    initCompute () {
      let jsProduct = $('#jsProducts')
      if (jsProduct) {
        let computH
        computH = Math.abs($('#jsProducts').offset().top - window.scrollY)
        if (!isNaN(computH) && computH >= 0) {
          this.barPositionY = computH
        }
      }
    },
    getCouponData () {
      let tplObj = {
        page: 'homepage',
        t: new Date().getTime()
      }
      if (typeof Util.getQueryString('_psource') === 'string') {
        tplObj['source'] = Util.getQueryString('_psource')
      }
      Request.get(API.getCouponData, {
        params: tplObj
      })
        .then(res => {
          res = res.data
          if (res.succ) {
            this.couponLogin = res.isLogin
            this.coupon.show = true
            this.coupon.data = res.data
          } else if (res.code === '412') {
            this.$toast(res.msg)
          }
        })
        .catch(error => {
          this.$toast('网络错误')
          console.log(error)
        })
    },
    couponClickClose () {
      this.coupon.show = false
    },
    couponClickUse () {
      if (!this.couponLogin) {
        Util.loginHandler(location.href)
        return
      }
      this.coupon.show = false
      const tplBtn = this.coupon.data.button
      if (tplBtn && tplBtn.action) {
        this.$nextTick(() => {
          switch (tplBtn.action) {
            case 'redirect':
              location.href = tplBtn.link
              break
            case 'close':
              this.coupon.show = false
              break
            default:
              this.coupon.show = false
          }
        })
      }
    },
    getMarqueeData () {
      Request.get(API.getMarquee, {})
        .then(res => {
          res = res.data
          if (res.succ) {
            this.marquee.content = res.data.message
            this.marquee.delay = parseInt(res.data.frequency)
            this.marquee.show = true
            this.$nextTick(() => {
              this.initCompute()
            })
          }
        })
        .catch(error => {
          this.$toast('网络错误')
          console.log(error)
        })
    },
    marqueeStart (data) {},
    marqueeDelay (data) {
      if (data >= this.marquee.num) {
        this.marquee.show = false
        this.marquee.start = false
        setTimeout(() => {
          this.initCompute()
        }, 400)
      }
    },
    initRequestResources () {
      Request.get(API.getResource, {})
        .then(res => {
          res = res.data
          if (res.succ) {
            this.banners = res.data.banners
            this.buttons = res.data.buttons
            this.recommends = res.data.recommends
            this.footerConf.modules = res.data.tabs
            this.isGuest = res.isGuest
            this.guestId = res.data.guestId + ''
            this.$nextTick(() => {
              this.initCompute()
            })
            /* 2018/05/16 小城 xiaocheng@in66.com 产品变更
              * 更改首页请求弹券顺序，不是 无他相机App 时，必须等游客身份获取后再请求弹券
              * 其余Web 都并行请求
            */
            /* 2018/05/31 墨竹 mozhu@in66.com 技术变更
              * 全部变成串行请求
            */
            this.getCouponData()
          }
        })
        .catch(error => {
          this.$toast('网络错误')
          console.log(error)
        })
    },
    getShelvesCollection () {
      Request.get(API.getShelvesCollection, {})
        .then(res => {
          res = res.data
          if (res.succ) {
            this.collections = res.data.items
            res.data.items.forEach(item => {
              cidMaps.push('[data-cid=' + item.id + ']')
            })
            this.getShelves()
            this.$nextTick(() => {
              ThresholdForBar = $('.js-nav').height()
              if (!this.scrollNav && this.collections.length) {
                this.scrollNav = new IScroll('#jsNav', {
                  probeType: 1,
                  mouseWheel: true,
                  disablePointer: true,
                  disableTouch: false,
                  disableMouse: false,
                  click: true,
                  useTransition: true,
                  scrollX: true,
                  scrollY: false,
                  hScrollbar: false,
                  vScrollbar: false,
                  vScroll: false,
                  momentum: false
                })
                this.scrollTopNav = new IScroll('#jsTopNav', {
                  probeType: 1,
                  mouseWheel: true,
                  disablePointer: true,
                  disableTouch: false,
                  disableMouse: false,
                  click: true,
                  useTransition: true,
                  scrollX: true,
                  scrollY: false,
                  hScrollbar: false,
                  vScrollbar: false,
                  vScroll: false,
                  momentum: false
                })
                setTimeout(() => {
                  this.scrollNav.refresh()
                  this.scrollTopNav.refresh()
                }, 200)
              }
            })
          }
        })
        .catch(error => {
          this.$toast('网络错误')
          console.log(error)
        })
    },
    getShelves () {
      Request.get(API.getShelves, {})
        .then(res => {
          res = res.data
          if (res.succ) {
            res.data.items.forEach(item => {
              item.price = Util.computePrice(item.price)
            })
            this.products = res.data.items
            this.$nextTick(() => {
              this.initDomArr()
            })
          }
        })
        .catch(error => {
          this.$toast('网络错误')
          console.log(error)
        })
    },
    initDomArr () {
      cidMaps.forEach(item => {
        let _t = $(item)
        if (_t.length) {
          cidDom.push(_t[0])
        }
      })
    },
    calculatePosition () {
      if (cidDom.length) {
        try {
          for (var i = 0; i < cidDom.length; i++) {
            if (
              $(cidDom[i]).offset().top <= window.scrollY + 10 &&
              (!cidDom[i + 1] ||
                $(cidDom[i + 1]).offset().top > window.scrollY + 10)
            ) {
              this.collectionSeq = i
              break
            }
          }
        } catch (e) {
          console.log(e)
        }
      }
    },
    changeType (index) {
      if (
        !cidDom[index] ||
        !$(cidDom[index]) ||
        parseInt(index, 10) === this.collectionSeq
      ) {
        return
      }
      let offsetTop = $(cidDom[index]).offset().top
      let _comput = 0
      _comput = offsetTop - ThresholdForBar - 5
      if (!isNaN(_comput)) {
        window.scrollTo(0, Math.abs(_comput), 200)
      }
      Tracker.add('newH*tabs*click_' + this.collections[index].id)
      $('#wrapper').trigger('scroll')
      setTimeout(() => {
        this.collectionSeq = parseInt(index, 10)
      }, 200)
    },
    goTopBack () {
      window.scrollTo(0, 0, 100)
      setTimeout(() => {
        this.showFakeToolBar = false
        this.collectionSeq = 0
      }, 100)
    },
    onTouch (e) {
      e.stopPropagation()
    }
  },
  mounted () {
    this.getShelvesCollection()
    this.getMarqueeData()
    this.initOrRefreshScroll()
  },
  watch: {
    marquee: {
      handler (curVal, oldVal) {
        if (curVal.show !== oldVal.show) {
          setTimeout(() => {
            this.initCompute()
          }, 200)
        }
      },
      deep: true
    },
    collectionSeq (newV, old) {
      if (newV === old) return
      if (this.scrollNav) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollNav.scrollToElement(
              document.querySelectorAll('.js-nav-item')[newV]
            )
          }, 100)
        })
      }
      if (this.scrollTopNav) {
        this.scrollTopNav.scrollToElement(
          document.querySelectorAll('.js-top-nav-item')[newV],
          100
        )
      }
    },
    showFakeToolBar (newV, old) {
      if (newV && this.scrollTopNav) {
        this.scrollTopNav.refresh()
        this.$nextTick(() => {
          this.scrollTopNav.refresh()
        })
      }
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
@import './src/scss/mixin.scss';

body {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.wrapper {
  .inner {
    overflow: hidden;
    padding-bottom: 100px;
  }
}
* {
  -webkit-user-modify: read-only;
}

.nav {
  position: relative;
  height: 80px;
  background-color: #fff;
  overflow-y: hidden;
  white-space: nowrap;
  overflow: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  &:after {
    @include onepixelBorder(2px);
    border-top: none;
    border-left: none;
    border-right: none;
  }
  @media only screen and (-webkit-min-device-pixel-ratio: 2) {
    &:after {
      @include onepixelBorder(1px);
      border-top: none;
      border-left: none;
      border-right: none;
    }
  }
  ul {
    position: relative;
    display: inline-block;
    height: 80px;
    white-space: nowrap;
    @include clearDefaultStyle();
    font-size: 0;
    transition: all 0.2s;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .nav-item {
    position: relative;
    display: inline-block;
    font-size: 32px;
    line-height: 80px;
    color: #b0b0b0;
    div {
      position: relative;
      display: inline-block;
      margin-right: 22px;
      margin-left: 30px;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
  .choose {
    color: #333;
    position: relative;
    div:after {
      position: absolute;
      content: '';
      width: 100%;
      height: 6px;
      border-radius: 1000px;
      background-color: #ff5e51;
      bottom: 0;
      left: 0;
    }
  }
}
.fake {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
