<template>
  <div class="buyer">
    <div class="comment">
      <div class="line"></div>
      <div class="comment-title" @click="jumoToBuyerShowList(buyerInfo.url)">
          买家秀(<span>{{buyerInfo.totalCount}}</span>)
          <div class="btn-more">查看全部<i class="i-font icon-qianjin"></i></div>
      </div>
      <div class="comment-box" v-for="item in buyerInfo.list" :key="item">
        <div class="comment-header">
          <div class="m-avater-info">
            <img v-lazy="item.avatar" class="avater">
            <span class="name">{{item.nickname}}</span>
          </div>
          <div class="m-pv-info">
            <span class="i-font icon-eye eye"></span>
            <span>{{item.viewCount}}</span>
            <span class="i-font icon-time time"></span>
            <span>{{item.date}}</span>
          </div>
        </div>
        <div class="word">{{item.content}}</div>
        <div class="images swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(data,index) in item.imageList"  v-lazy:background-image="data.thumbImage" @click="imgEnlarge(item.imageList,index)" :key="data"></div>
          </div>
        </div>
      </div>
    </div>
    <section class="full-swiper" v-show="imgShow">
      <div class="container-wrap">
        <div class="swiper-container" >
          <div class="swiper-wrapper" @click="closeImgShow">
            <div class="img-par swiper-slide" v-for="enlargeImg in enlargeImgList" :key="enlargeImg"  >
              <div class="loading" v-show="!enlargeImg.image"></div>
              <img class="bg"  :src="enlargeImg.image" >
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>           
      </div>         
    </section>    
  </div>
</template>
<script >
import Swiper from 'swiper'
import Util from '@/utils/util.js'
import 'swiper/dist/css/swiper.css'
export default {
  data () {
    return {
      swiperShow: false,
      currentImgNum: '',
      totalNum: '',
      enlargeImgList: this.buyerInfo.list[0].imageList,
      mySwiper: null,
      imgShow: false
    }
  },
  props: {
    buyerInfo: {
      type: Object
    }
  },
  methods: {
    jumoToBuyerShowList (url) {
      window.location.href = Util.getQueryString(url, '_psource') ? url : Util.addSourceTracker(url)
    },
    imgEnlarge (e, ind) {
      var that = this
      this.imgShow = true
      if (that.imgShow) {
      // 利用时间的延迟达到渲染效果
        setTimeout(function () {
          that.mySwiper = new Swiper('.full-swiper .swiper-container', {
            direction: 'horizontal',
            initialSlide: 0,
            slidesPerView: 1,
            freeModeMomentumBounce: false,
            spaceBetween: 20,
            pagination: '.swiper-pagination',
            paginationType: 'custom',
            paginationCustomRender: function (swiper, current, total) {
              return current + '/' + total
            }
          })
          that.mySwiper.slideTo(ind, 10, false)
        }, 100)
      }
    },
    closeImgShow () {
      this.imgShow = false
    }
  },
  mounted () {
    let comment = new Swiper('.images', {
      direction: 'horizontal',
      initialSlide: 0,
      slidesPerView: 'auto',
      freeMode: true
    })
    console.info(comment)
  }
}
</script>
<style lang="scss" scoped>
.comment {
  background-color: #ececec;
  .line {
    height: 20px;
    background-color: #F1F1F1;
  }
  .comment-title {
    padding: 2.67% 3%;
    font-size: 28px;
    height: 52px;
    line-height: 52px;
    color: #333333;
    background-color: #fff;
    position: relative;
    .btn-more {
      font-size: 28px;
      color: #ccc;
      float: right;
      .icon-qianjin {
        font-size: 32px;
      }
    }
  }
  .comment-box {
    border-top: 1px solid rgba(236, 236, 236, .6);/*no*/
    background-color: #fff;
    margin-bottom: 3%;
    .comment-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 3% 3%;
      line-height: 56px;
      font-size: 28px;
      .m-avater-info {
        > img {
          display: inline-block;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          transform: translateY(14px); 
        }
      } 
      .name {
        color: #5b5c5c;
      }
      .m-pv-info {
        span{
          font-size: 20px;
          color: #aaa9aa;
          line-height: 20px;
          vertical-align:  middle;
         }
        .eye, .time{
          height:25px;
          padding-left: 16px;
          font-size: 40px;
          margin-right: -5px;
        }
        .time{
          margin-right: -10px;
        }
      }
      
    }
    .word {
      padding: 0 3%;
      font-size: 32px;
      color: #888;
    }
    .images {
      margin-left: 3%;
      margin-top: 3%;
      height: 100%;
      .swiper-slide {
          width: 25%;
          padding-top: 25%;
          margin-right: 3%;
          overflow: hidden;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
      }
    }
  }
}
.full-swiper{
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #26252c;
  top: 0px;
  left: 0px;
  display: block;
  opacity: 1;
  z-index: 100;
  overflow: hidden;
  .container-wrap{
    width: 100%;
    height: 100%;
  }
  .swiper-container{
    position: relative;
    border: 1px solid #fff;/*no*/
    width: 100%;
    height: 100%;
    .loading{
      position: absolute;
      width: 2.5rem;
      height: 2.5rem;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .img-par{
      width: 750px;
      position: relative;
      .bg{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        max-width: 100%;
        max-height: 100%;
      }
    }
   
    .swiper-pagination{
      width: 100%;
      padding: 3% 0;
      position: fixed;
      bottom: 0;
      background-color: rgba(75,71,85,.2);
      color:#fff;
      font-size: 30px;
    }
  }
}
</style>
