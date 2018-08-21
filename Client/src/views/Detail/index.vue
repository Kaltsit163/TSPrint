<template>
  <div class="wrapper" @touchmove="allHandler($event)">
    <!-- 跑马灯组件 -->
    <marquee v-if="marquee.show" 
             :content="marquee.content" 
             :delay="marquee.delay" 
             :speed="marquee.speed" 
             :top="typeJudge ? '56px' : 0"
             :num="marquee.num" 
             @start="marqueeStart" 
             @delaying="marqueeDelay"></marquee>
    <!-- banner组件 -->
    <banner v-if="bannerInfo" 
            :banner-info="bannerInfo"></banner>
    <!-- 商品信息组件 -->
    <product-info v-if="productInfo" 
                  :product-info="productInfo"></product-info>
    <!-- Sku组件 -->
    <sku-spec v-if="(skuInfo && skuInfo.length > 0)" 
              @skuPopShow="skuShow = true" 
              @skuPopClose="skuShow = false"
              @skuTextClick="changeFullScreenSwiperCurrent"
              @skuPicClick="toggleFullScreenSwiperShow"
              :sku-info="skuInfo" 
              :product-info="productInfo" 
              :visible="skuShow" 
              ref="skuCon"></sku-spec>
    <!-- 打印券区域 -->
    <div v-if="btnInfo && btnInfo.url && btnInfo.url.length > 0" 
         class="m-coupon" 
         @click="jumpToCouponList">
      <p class="i-desc"><em class="i-tag"></em>我的优惠券</p>
      <p class="i-right-part">{{btnInfo.tips}}
        <i class="i-font icon-qianjin"></i>
      </p>
    </div>
    <!-- 买家秀组件 -->
    <buyer-show v-if="buyerShow &&　buyerShow.list && buyerShow.list.length > 0" 
                :buyer-info="buyerShow">
    </buyer-show>
    <!-- 详情列表 -->
    <div class="detail-imgs">
      <video v-if="videoInfo" 
      :src="videoInfo.videoUrl" 
      :poster="videoInfo.videoCoverUrl" controls>
      </video>
      <template v-for="(item, index) in details">
        <img v-if="typeof item === 'string'" :src="item" class="bg" >
        <pic-tab v-else :tab-info="item"></pic-tab>
      </template>
    </div>
    <!-- 购买按钮 -->
    <div class="bottom-bar">
      <!-- 购物车 -->
      <a 
      href="javascript:;" 
      class="cart-icon"
      @click="goShopCart"
      >
        <img src="https://inimg02.jiuyan.info/in/2018/08/14/a79a8e96-8097-410a-a6bf-0c92b24ed02e.png" />
        <div>购物车</div>
        <span v-show="hasProductsInSC" class="m-dot"></span>
      </a>
      <template v-for="btnItem in btns">
        <a v-if="outOfStock !== null && (btnItem.action === 'custom' || btnItem.action === 'directBuy')" 
           href="javascript:;"
           v-bind:class="{disable: outOfStock, 'btn-buy': !productInfo.needCustom, 'btn-cart': productInfo.needCustom}" 
           @click="submit('submit')">{{outOfStock?'已售完':btnItem.text}}</a>
        <a
        v-if="btnItem.action === 'add-to-cart' && !productInfo.needCustom" 
        href="javascript:;" 
        class="btn-cart"
        @click="submit('shopcart')"
        >{{btnItem.text}}</a>
      </template>
    </div>
    <!-- 关闭按钮 -->  
    <div v-if="popupsVisible" class="popups-canvas-bag">
      <div class="content">
        <a href="javascript:;" class="btn" @click="closePops"></a>
      </div>
    </div>
    <!-- 详情页券 -->
    <Coupon v-if="couponVisible"
            :styleConf="couponInfo.style"
            :coupon="couponInfo.coupons"
            :tips="couponInfo.tips" 
            :button="couponInfo.button"
            @clickClose="couponVisible = false" 
            @clickUse="couponClick()"></Coupon>
    <!-- 分享弹起层 -->
    <Share-pop v-show="showShare" 
               :shareConf="shareConf"
               @closeSharePop="closeSharePop" 
               @handleShare="handleShare"></Share-pop>
    <!-- 信息层 -->
    <DialogCmptWithCross :showDialog="showDialog" 
                         :dialogTextConfig="dialogTextConfig" 
                         @dialogSure="dialogSure" 
                         @dialogCancle="dialogCancle"></DialogCmptWithCross>
    <!-- 分享弹起层 -->
    <FullScreenSwiper v-if="fullScreenSwiperShow && fullScreenSwiperConf.pics.length > 0"
                      :current="fullScreenSwiperConf.current"
                      :pics="fullScreenSwiperConf.pics"
                      :autoplay="fullScreenSwiperConf.autoplay"
                      :dataKey="fullScreenSwiperConf.dataKey"
                      @touchClose="fullScreenSwiperConf.touchClose"></FullScreenSwiper>                     
  </div>
</template>

<script>
/* 通用组件 */
// import CustomHead from '@/components/CustomHead'
import Banner from '@/components/Banner'
import PicTab from '@/components/PicTab'
import DialogCmptWithCross from '@/components/DialogCmptWithCross'
import Marquee from '@/components/Marquee'
import FullScreenSwiper from '@/components/FullScreenSwiper'
import SharePop from '@/components/MiniProgramSharePop'
import Coupon from '@/components/coupon/CouponWxStyle'
/* 业务组件 */
import ProductInfo from './ProductInfo'
import SkuSpec from './SkuSpec'
import BuyerShow from './BuyerShow'
/* 通用 JS */
import '@/utils/jsbridge.js'
import Request from '@/utils/http.js'
import Util from '@/utils/util.js'
import Tracker from '@/utils/tracker.js'
import Share from '@/utils/share.js'
import env from '@/mixin/env.js'
import shopcartRedPoint from '@/mixin/shopcartRedPoint.js'
/* 业务配置 */
const ipInterface = '/auth/key'

/* global callApp:true */
export default {
  name: 'detailStandard',
  mixins: [env, shopcartRedPoint],
  components: {
    Banner,
    PicTab,
    ProductInfo,
    SkuSpec,
    Marquee,
    BuyerShow,
    SharePop,
    DialogCmptWithCross,
    Coupon,
    FullScreenSwiper
  },
  data () {
    return {
      scrollTop: 0,
      showDialog: false,
      dialogTextConfig: {
        dialogTitle: '版本升级',
        dialogText: '您的版本较低，请您升级版本',
        sureText: '去升级'
      },
      ifUpgrade: false,
      headInfo: {
        leftBtn: {
          click () {
            Tracker.add('detailStandard*click*headLeft')
            if (history.length > 1) {
              history.back()
            } else {
              // 关闭webview
              callApp && callApp({
                iosMessage: 'in://in?tovc=105&h5=1',
                androidMessage: 'in://in?tovc=105&h5=1'
              })
            }
          }
        },
        title: '详情页',
        height: 56
      },
      marquee: {
        speed: 'simple',
        num: 3,
        show: false,
        delay: 3,
        content: ''
      },
      couponInfo: {
        'style': {},
        'button': {},
        'coupons': [],
        'tips': []
      },
      fullScreenSwiperShow: false,
      fullScreenSwiperConf: {
        current: 0,
        pics: [],
        autoplay: false,
        dataKey: 'src',
        touchClose: () => {
          this.toggleFullScreenSwiperShow()
        }
      },
      bannerInfo: null,
      productInfo: null,
      skuInfo: null,
      skuShow: false,
      buyerShow: {
        totalCount: '',
        url: '',
        list: [] // 20170825 6inch/lomo迁移新增modlues中买家秀数据
      },
      btnInfo: {
        tips: '',
        url: ''
      }, // 20170825 6inch/lomo迁移新增modlues中coupon字段，表示此处按钮的数据
      details: [],
      btns: [],
      couponVisible: false,
      popupsVisible: false,
      numIntoView: 1,
      shelvesId: Util.getQueryString('shelvesId'),
      XToken: Util.getQueryString('XToken'),
      btnText: '立即购买',
      shareConf: {},
      showShare: false,
      focusClose: Util.getQueryString('focusClose'),
      skuId: Util.getQueryString('skuId'),
      userIP: '',
      photoURL: encodeURIComponent(Util.rmImgProtocal(Util.getQueryString('photoUrl'))),
      isLogin: true,
      isGuest: false,
      userId: '',
      videoInfo: null,
      couponLogin: true,
      actionType: 'submit'
    }
  },
  methods: {
    getPageDetail () {
      const t = new Date()
      let configs = {
        params: {
          shelvesId: this.shelvesId,
          skuId: this.skuId,
          photoURL: this.photoURL,
          t: t.getTime()
        }
      }
      if (this.XToken) {
        configs['headers'] = {
          'X-Token': this.XToken
        }
      }
      Request.get('/page/detail', configs)
      .then((res) => {
        res = res.data
        this.isLogin = !(res.code === '401')
        this.isGuest = res.isGuest
        this.userId = res.userId
        if (Util.isWutaApp) {
          Tracker.add(`wuta*detailLoad*userId_${res.userId}*loginState_${!res.isGuest}*shelvesId_${this.shelvesId}`)
        }
        if (res.succ) {
          this.bannerInfo = res.data.bannerInfo
          this.productInfo = res.data.productInfo
          this.skuInfo = res.data.sku
          this.details = res.data.details
          this.headInfo.title = res.data.page_title
          window.document.title = res.data.page_title
          this.buyerShow = res.data.modules.buyerShow
          this.btnInfo = res.data.modules.coupon
          this.btns = res.data.btns
          if (res.data.videoUrl) {
            this.videoInfo = {
              'videoUrl': res.data.videoUrl,
              'videoCoverUrl': res.data.videoCoverUrl
            }
          }
          if (res.data.btn_copy) this.btnText = res.data.btn_copy
          if (res.data.modules.share) {
            this.setShareConfig(res.data.modules.share)
          }
          // 2018/04/27 点击Sku左上角图片 全屏弹起图片预览 Swiper
          if (res.data.sku) {
            let layerSkuPics = []
            res.data.sku.forEach(item => {
              layerSkuPics.push({
                src: Util.filterOriginFromThumb(item.coverImage)
              })
            })
            this.fullScreenSwiperConf.pics = layerSkuPics
          }
        } else {
          this.$toast(res.msg ? res.msg : '请求失败')
        }
      })
      .catch((error) => {
        this.$toast('网络错误')
        console.log(error)
      })
    },
    submit (action) {
      if (!this.outOfStock) {
        // 升级弹框
        if (this.ifUpgrade) {
          this.showDialog = true
          return
        }
        this.actionType = action
        // 标品触发commit事件
        if (this.$refs.skuCon) {
          this.$refs.skuCon.submit()
        } else {
          window.EventBus.$emit('detailStandard.commit', {
            skuId: this.productInfo.id,
            count: 1
          })
        }
      }
    },
    closePops () {
      this.popupsVisible = false
    },
    doShare () {
      // if (parseInt(this.productInfo.type, 10) === 1) {
      //   this.showShare = true
      //   this.closePops()
      // } else {
      callApp && callApp({
        'iosMessage': 'in://in?tovc=102&h5=1&type=all&callback=shareCallback',
        'androidMessage': 'in://in?tovc=102&h5=1&type=all&callback=shareCallback'
      })
      // }
    },
    closeSharePop () {
      this.showShare = false
    },
    handleShare (channel) {
      Tracker.add(`detailStandard*share*${channel}`)
    },
    getCouponData () {
      let requestConfigs = {
        params: {
          '_r': Math.random(),
          'source': Util.getQueryString('_psource', this),
          'shelvesId': this.shelvesId,
          'skuId': this.skuId,
          'page': 'detail'
        }
      }
      if (this.XToken) {
        requestConfigs['headers'] = {
          'X-Token': this.XToken
        }
      }
      Request.get('/activity/coupon/receive', requestConfigs)
      .then((res) => {
        res = res.data
        if (res.succ) {
          this.couponLogin = res.isLogin
          this.couponInfo = res.data
          this.couponVisible = true
        } else if (res.code === '412') {
          this.$toast(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    },
    setShareConfig (conF) {
      let _this = this
      // 控制分享的开关
      if (!parseInt(conF.wmpShareEnable, 10)) return
      // in 内
      if (this.isInApp) {
        this.headInfo.rightBtn = {
          text: '',
          style: {
            'background-image': 'url(//inimg02.jiuyan.info/in/2017/09/04/8680DD1D-0764-F444-FD91-E98520A569E0.png)',
            'background-repeat': 'no-repeat',
            'background-position': 'center center',
            'background-size': '20px',
            'width': '56px',
            'height': '56px',
            'line-height': '56px',
            'display': 'inline-block',
            'right': '0'
          },
          click: () => {
            this.doShare()
            Tracker.add('detailStandard*header*doshare')
            Tracker.add('detailStandard*header*doshare_' + this.skuId)
          }
        }
        // if (parseInt(this.productInfo.type, 10) === 1) {
        //   this.shareConf.wxType = conF.wxType
        //   Util.shareWXXCX(conF)
        //   return
        // }
      }
      Share.initData(
        Object.assign(
          {},
          conF,
          {
            shareTrack: 'detail*share*all',
            success () {
            },
            cancel () {
            }
          }
        )
      )
      window.shareCallBack = {
        succ: function () {
          _this.closeSharePop()
        },
        error: function (error) {
          _this.$toast(error)
        }
      }
    },
    couponClick (btnConf = this.couponInfo.button) {
      if (!this.couponLogin) {
        Util.loginHandler(location.href)
        return
      }
      switch (btnConf.action) {
        case 'redirect':
          this.couponVisible = false
          window.location = btnConf.link
          break
        case 'close':
          this.couponVisible = false
          break
        default: 'close'
          this.couponVisible = false
          break
      }
    },
    jumpToCouponList () {
      if (!this.isInApp && !this.isLogin) {
        Util.loginHandler(location.href) // 这里进入页面已经有source了，直接使用通用方法
      } else {
        location.href = Util.addSourceTracker(this.btnInfo.url)
      }
    },
    goShopCart () {
      if (this.$router) {
        this.$router.push({path: 'shopCart'})
      } else {
        window.location.href = Util.addSourceTracker('/new/shopCart.html')
      }
    },
    getMarquee () {
      let tplObj = {}
      if (Util.getQueryString('shelvesId')) {
        tplObj.shelves = Util.getQueryString('shelvesId')
      } else if (Util.getQueryString('skuId')) {
        tplObj.sku = Util.getQueryString('skuId')
      }
      const tplUrl = Util.formateRequestParams(tplObj)
      Request.get(`/marquee/detail${tplUrl}`, {})
        .then((res) => {
          res = res.data
          if (res.succ) {
            this.marquee.content = res.data.message
            this.marquee.delay = parseInt(res.data.frequency)
            this.marquee.show = true
          }
        })
        .catch((error) => {
          this.$toast('网络错误')
          console.log(error)
        })
    },
    marqueeStart (data) {},
    marqueeDelay (data) {
      if (data >= this.marquee.num) {
        this.marquee.show = false
        this.marquee.start = false
      }
    },
    dialogCancle () {
      this.showDialog = false
    },
    dialogSure () {
      window.location.href = '//a.app.qq.com/o/simple.jsp?pkgname=com.jiuyan.infashion&ckey=CK1283454780035'
    },
    // 用户ip获取
    getUserIP (callback) {
      Request.get(ipInterface, {
      })
      .then((res) => {
        res = res.data
        if (res.succ) {
          this.userIP = res.data.key
          callback && callback()
        }
      })
      .catch((error) => {
        console.log(error)
      })
    },
    allHandler (ev) {
      if (!this.skuShow) return
      const target = ev.target
      const isNodeName = (target.className === 'popups-sku')
      if (isNodeName) {
        ev.preventDefault()
      }
    },
    changeFullScreenSwiperCurrent (index) {
      this.fullScreenSwiperConf.current = index
    },
    toggleFullScreenSwiperShow () {
      this.fullScreenSwiperShow = !this.fullScreenSwiperShow
    }
  },
  computed: {
    outOfStock () {
      if (this.productInfo) {
        if (+this.productInfo.stock === 0) {
          return true
        } else {
          return false
        }
      } else {
        return null
      }
    },
    typeJudge () {
      // lomo 六寸 或者在in外打开要带头
      return (Util.getQueryString('tbhidden') && Util.getQueryString('tbhidden') === '1' && this.isInApp) || (!this.isInApp && !this.isMiniprogram && !this.isWutaApp)
    }
  },
  created() {
    let _this = this
    let hasRequest = false
    window.EventBus.$on('detailStandard.commit', (data) => {
      if (hasRequest) return
      hasRequest = true
      console.log(this.actionType)
      Tracker.add(`detailStandard*commit*${this.shelvesId}|${this.curChannel}`)
      Tracker.add(`detailStandard*intoView-${this.numIntoView}*${this.shelvesId}`)
      if (Util.isWutaApp) {
        Tracker.add(`wuta*detailCommit*userId_${this.userId}*loginState_${!this.isGuest}*shelvesId_${this.shelvesId}`)
      }
      let headersOb = this.XToken ? {'X-Token': this.XToken} : {}
      Request.post('/cart/item/add', {
        shelvesId: this.shelvesId,
        skuId: this.skuId,
        list: [data],
        directBuy: this.actionType !== 'shopcart'
      }, {
        headers: headersOb
      })
      .then((res) => {
        res = res.data
        if (res.succ) {
          if (this.actionType === 'shopcart') {
            if (this.$router) {
              this.$router.push({path: 'shopCart'})
            } else {
              window.location.href = Util.addSourceTracker('/new/shopCart.html')
            }
          } else {
            window.location.href = Util.getQueryString(res.data.url, '_psource') ? res.data.url : Util.addSourceTracker(res.data.url)
          }
        } else {
          if (res.code === '401') {
            this.isLogin = false
            if (!this.isInApp) {
              if (this.isWutaApp) {
                Util.loginHandler(Util.addSourceTracker(location.href))
                return
              }
              _this.getUserIP(() => {
                const redirectUrl = `/auth/in?key=${_this.userIP}&redirect_url=${encodeURIComponent(location.href)}`
                window.location.href = redirectUrl
              })
            }
          } else {
            this.$toast(res.msg ? res.msg : '请求失败')
          }
        }
        hasRequest = false
      })
      .catch((error) => {
        hasRequest = false
        this.$toast('网络错误')
        console.log(error)
      })
    })
    this.getPageDetail()
    this.getCouponData()
    this.getMarquee()
    // 这里在20171208 应后端要求，作出调整，调整请求位置
    // if (!this.isInApp) {
    //   this.getUserIP()
    // }
  },
  mounted() {
    let hfdh = document.documentElement.clientHeight * 0.5
    window.addEventListener('scroll', () => {
      let n = Math.floor(document.body.scrollTop / hfdh) / 2 + 1
      Tracker.add(`detailStandard*intoViewRealtime-${n}*${this.shelvesId}`)
      if (n > this.numIntoView) this.numIntoView = n
    })
    this.ifUpgrade = Util.getQueryString('_v') && Util.isLessThanVersion('2.9.97')
    Tracker.add(`detailStandard*open*${this.shelvesId}|${this.curChannel}`)
    if (this.photoURL && this.photoURL !== 'null') {
      Util.setTempStorage('userPhotoForCustomMade', this.photoURL)
    }
    let _s = Util.getQueryString('_s')
    if (_s) {
      window.LS.set('_s', _s)
    }
    window.LS.set('canvasBag', '')
    if (this.XToken) {
      Util.setStorage('MINIP-X-TOKEN', this.XToken)
    }
    window.LS.clear('previewPhotoData')
  }
}
</script>
<style scoped lang="scss">
  .wrapper {
    line-height: 1.5;
    padding-bottom: 96px;
    overflow: hidden;
  }

  .bannerDown {
    margin-top: 56px;/*no*/
  }

  .bg {
    width: 100%;
    vertical-align: bottom;
  }
  .cart-icon{
    position: relative;
    width: 140px;
    text-align: center;
    font-size: 0.6rem;
    color: #B0B0B0;
    background-color: #fff;
    padding-top: .2rem;
    img{
      display: block;
      width: 1.1rem;
      margin: 0 auto;
      margin-bottom: 0.1rem;
    }
  }
  .btn-cart{
    flex: 1;
    display: inline-block;
    background-color: #FF4545;
    color: #fff;
    font-size: 32px;
    line-height: 96px;
    z-index: 98;
  }
  
  .btn-buy {
    flex: 1;
    display: inline-block;
    background-color: #FFE6DE;
    color: #FF4545;
    font-size: 32px;
    line-height: 96px;
    z-index: 98;
    &.disable {
      background-color: #aaa;
    }
  }
  .bottom-bar{
    position: fixed;
    display: flex;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .popups-canvas-bag {
    z-index: 1;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.7);
    .content {
      position: absolute;
      width: percentage(620/750);
      padding-top: percentage(814/750);
      background: no-repeat center/contain url(../../../assets/popups-bag.png);
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .btn {
        position: absolute;
        width: percentage(280/620);
        height: percentage(70/814);
        left: 50%;
        bottom: percentage(60/814);
        transform: translate(-50%, 0);
      }
    }
  }

  .coupon-style-1 {
    width: 100%;
    background-image: url(../../../assets/coupon_bg.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    .c-content {
      position: relative;
      padding: percentage(35/517);
      border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
      color: #fff;
      height: 100px;
      .num {
        position: absolute;
        left: percentage(35/517);
        top: 50%;
        transform: translate(0, -50%);
        font-size: 28px;
        em {
          font-size: 125px;
        }
      }
      .name {
        width: 320px;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: keep-all;
        overflow: hidden;
        font-size: 46px;
        line-height: 1.2;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
    .c-desc {
      text-align: center;
      width: 90%;
      margin: 0 auto;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: keep-all;
      overflow: hidden;
      color: #6083a9;
      font-size: 28px;
      line-height: 55px;
    }
  }

  .coupon-first {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    .content {
      position: relative;
      margin: 35% auto;
      width: percentage(640/720);
      background-color: #fff;
      border-radius: 5px;
      .t-part {
        padding: percentage(60/640) 0;
        margin: 0 percentage(60/640);
        border-bottom: 1px dashed #ececec;
      }
      .b-part {
        padding: percentage(60/640);
        padding-top: 0;
        .text {
          text-align: center;
          font-size: 32px;
          color: #5f5f5f;
          margin: percentage(40/640) 0;
        }
        .btn-use {
          text-align: center;
          display: block;
          color: #fff;
          background-color: #ec584d;
          font-size: 40px;
          line-height: 88px;
          width: percentage(540/640);
          margin: auto;
          border-radius: 100px;
        }
      }
      .close-part {
        position: absolute;
        bottom: 100%;
        right: percentage(20/640);
        width: percentage(60/640);
        padding-top: percentage(220/640);
        background-image: url('../../../assets/btn_close.png');
        background-size: 98% 100%;
        background-repeat: no-repeat;
        background-position: center center;
        .btn-close {
          position: absolute;
          width: 100%;
          padding-top: 100%;
          top: 0;
          left: 0;
        }
      }
    }
  }

  .line {
    height: 20px;
    background-color: #F1F1F1;
  }

  .m-coupon {
    position: relative;
    height: 104px;
    line-height: 104px;
    font-size: 28px;
    color: #333333;
    text-indent: 20px;
    text-align: left;
    background: rgba(255,251,251,0.79);
    &:before {
      content: '';
      display: inline-block;
      height: 0;
      width: 95%;
      position: absolute;
      border-top: 1px solid #F5F5F5; /* no */
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .i-desc {
      .i-tag {
        margin-right: 10px;
        display: inline-block;
        width: 26px;
        height: 26px;
        background-repeat: no-repeat;
        background-size: cover;
        background-image: url('https://inimg07.jiuyan.info/in/2017/11/08/10FBE3E6-8838-0296-56D4-3928B5143216.png');
      }
    }
    .i-right-part {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      color: #36D4B0;
      .icon-qianjin {
        color: #C7C7CC;
        font-size: 32px;
      }
    }
  }

  .header-zhan{
    height: 44px;
  }

  .detail-imgs {
    padding-top: 20px;
    background-color: #f1f1f1;
    font-size: 0;
    video{
      width: 100%;
      height: auto;
    }
  }
  .m-dot{
    display: inline-block;
    width: .35rem;
    height: .35rem;
    border-radius: 50%;
    position: absolute;
    top: 10%;
    right: 32%;
    background: #ff5e51;
  }
</style>
