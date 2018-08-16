<template>
  <div class="banner">
    <div class="swiper-container" ref="swiper" v-if="bannerInfo.length>1">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(eleInfo, index) in bannerInfo">
          <a :href="getPUrl(eleInfo.url)" @click="jumpfromBanner(eleInfo)">
            <img :src="eleInfo.image">
          </a>
        </div>
      </div>
      <div class="swiper-pagination" ref="swiperPag"></div>
      <slot name="icon"></slot>
    </div>
    <a v-else class="single-img js-single" :href="getPUrl(bannerInfo[0].url)" @click="jumpfromBanner(bannerInfo[0])">
      <img :src="bannerInfo[0].image">
    </a>
  </div>
</template>

<script>

import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
export default {
  data () {
    return {
    }
  },
  computed: {
  },
  props: {
    bannerInfo: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    jumpfromBanner (ele) {
    },
    getPUrl (url) {
    }
  },
  mounted () {
    /* eslint-disable no-new */
    new Swiper(this.$refs.swiper, {
      direction: 'horizontal',
      loop: true,
      autoplay: 3000,
      slidesPerView: 'auto',
      centeredSlides: true,
      observer: true,
      observeParents: true,
      pagination: this.$refs.swiperPag
    })
  }
}

</script>
<style lang="scss">
.banner {
  position: relative;
  width: 100%;
}

.swiper-container, .js-single{
  width: 100%;
  height: 340px;
}

.swiper-slide {
  img {
    width: 100%;
    vertical-align: bottom;
  }
}
.swiper-pagination{
  .swiper-pagination-bullet {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .swiper-pagination-bullet-active {
    border-radius: 1000px;/*no*/
    width: 16px;/*no*/
    background-color: rgba(255, 255, 255, 1);
  }
}
.single-img{
  display: block;
  width: 100%;
  img{
    width: 100%;
    vertical-align: bottom;
  }
}

.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
    margin: 0 3px;/*no*/
}

</style>
